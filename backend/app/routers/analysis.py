from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime, timedelta
import random

from app.database import get_db
from app.models import GlobalStore, GlobalProduct
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/analysis",
    tags=["analysis"]
)

# --- Schemas ---
class ProductSchema(BaseModel):
    title: str
    image: str
    price: float
    revenue_est: float
    is_winner: bool

class AnalysisResponse(BaseModel):
    id: int
    name: str
    url: str
    logo: Optional[str]
    niche: str
    country: str
    currency: str
    
    # KPIs
    monthly_revenue: float
    traffic: int
    active_ads: int
    average_price: float
    
    # Charts (Mocked History)
    traffic_history: List[dict] # { date: str, value: int }
    revenue_history: List[dict] # { date: str, value: float }
    
    # Lists
    best_products: List[ProductSchema]
    
    class Config:
        from_attributes = True

# --- Endpoints ---

@router.get("/store", response_model=AnalysisResponse)
def analyze_store(
    url: str = Query(..., description="Store URL to analyze"),
    db: Session = Depends(get_db)
):
    # 1. Normalize URL (remove https://, www., trailing slash)
    clean_url = url.replace("https://", "").replace("http://", "").replace("www.", "").strip("/")
    
    # 2. Find Store
    # Try exact match first, then partial
    store = db.query(GlobalStore).filter(GlobalStore.url.ilike(f"%{clean_url}%")).first()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found in our database. We are tracking it now, check back in 24h.")
    
    # 3. Get Products (Best Sellers)
    products = db.query(GlobalProduct)\
        .filter(GlobalProduct.store_id == store.id)\
        .order_by(desc(GlobalProduct.revenue_est))\
        .limit(6)\
        .all()
        
    avg_price = sum(p.price for p in products) / len(products) if products else 0.0

    # 4. Generate Mock History (Last 6 months)
    # In a real app, this would come from a 'StoreHistory' table
    traffic_history = []
    revenue_history = []
    current_date = datetime.now()
    
    base_traffic = store.traffic
    base_revenue = store.monthly_revenue
    
    for i in range(6):
        date_str = (current_date - timedelta(days=30 * (5-i))).strftime("%b")
        # Random fluctuation +/- 20%
        factor = random.uniform(0.8, 1.2)
        
        traffic_history.append({
            "date": date_str,
            "value": int(base_traffic * factor * (0.5 + i*0.1)) # Growing trend mock
        })
        revenue_history.append({
            "date": date_str,
            "value": int(base_revenue * factor * (0.5 + i*0.1))
        })

    return AnalysisResponse(
        id=store.id,
        name=store.name,
        url=store.url,
        logo=store.logo_url,
        niche=store.niche,
        country=store.country,
        currency=store.currency,
        monthly_revenue=store.monthly_revenue,
        traffic=store.traffic,
        active_ads=store.active_ads,
        average_price=round(avg_price, 2),
        traffic_history=traffic_history,
        revenue_history=revenue_history,
        best_products=[
            ProductSchema(
                title=p.title,
                image=p.image_url,
                price=p.price,
                revenue_est=p.revenue_est,
                is_winner=p.is_winner
            ) for p in products
        ]
    )
# --- Real-Time Scan Endpoint (Phase 13) ---
from app.services.store_scanner import StoreScanner

class ScanRequest(BaseModel):
    url: str

@router.post("/scan")
def scan_store_realtime(req: ScanRequest):
    scanner = StoreScanner()
    data = scanner.scan_url(req.url)
    
    # --- Phase 14: Ad & Sales Intelligence ---
    
    # 1. Real Ad Count (from ads.py)
    active_ads_count = 0
    try:
        from app.routers.ads import fetch_real_time_ads
        # Search for the Store Name as keyword
        ad_data = fetch_real_time_ads(keyword=data["title"], limit=10) 
        # Note: This is an approximation. Ideally we filter by "Page Name" match.
        active_ads_count = len(ad_data.get("data", []))
        if active_ads_count == 0:
             # Fallback: Check for REAL Pixel Signals from the scanner
             # If they have a Pixel, they likely run ads even if API is restricted or name mismatch.
             # We assign a baseline of '1' to indicate "Active Ad Operations" for sales math.
             if data.get("has_fb_pixel") or data.get("has_tiktok_pixel"):
                 active_ads_count = 1
                 # Maybe Log this as "inferred"
                 
    except Exception as e:
        print(f"Ad Fetch Error: {e}")
        # Even on error, check pixels
        if data.get("has_fb_pixel") or data.get("has_tiktok_pixel"):
             active_ads_count = 1
        else:
             active_ads_count = 0

    data["active_ads"] = active_ads_count
    
    # 2. Sales Estimation
    estimates = scanner.estimate_sales(
        product_count=data["count"],
        avg_price=data["avg_price"],
        active_ads=active_ads_count
    )
    data["estimates"] = estimates
    
    # 3. Market Share (Heuristic based on Currency)
    # Start with assumption: Currency = Primary Market
    currency_map = {
        "USD": "US", "GBP": "GB", "EUR": "DE", "CAD": "CA", "AUD": "AU"
    }
    primary_country = currency_map.get(data["currency"], "US")
    
    # Construct "Market Share" list
    # Real logic: We allocate 70% to primary, 30% split among others
    data["market_share"] = [
        {"country": primary_country, "percent": 70},
        {"country": "US" if primary_country != "US" else "GB", "percent": 20},
        {"country": "CA" if primary_country != "CA" else "AU", "percent": 10}
    ]

    return {
        "status": "success",
        "data": data
    }
