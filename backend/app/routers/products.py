from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..models import GlobalProduct, GlobalStore

router = APIRouter(
    prefix="/api/products",
    tags=["products"]
)

# Request Schema for Advanced Search
class ProductSearchFilter(BaseModel):
    keyword: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_revenue: Optional[float] = None
    min_ads: Optional[int] = None
    niche: Optional[str] = None
    country: Optional[str] = None
    sort_by: Optional[str] = "revenue_est" # revenue_est, ads_count, created_at
    preset: Optional[str] = None # recommended, new_shops, active_ads

@router.post("/search")
def search_products(
    filters: ProductSearchFilter,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(GlobalProduct).join(GlobalStore)

    # 1. Keyword Search
    if filters.keyword:
        query = query.filter(GlobalProduct.title.ilike(f"%{filters.keyword}%"))

    # 2. Price Range
    if filters.min_price is not None:
        query = query.filter(GlobalProduct.price >= filters.min_price)
    if filters.max_price is not None:
        query = query.filter(GlobalProduct.price <= filters.max_price)

    # 3. Revenue
    if filters.min_revenue is not None:
        query = query.filter(GlobalProduct.revenue_est >= filters.min_revenue)

    # 4. Ads
    if filters.min_ads is not None:
        query = query.filter(GlobalProduct.ads_count >= filters.min_ads)

    # 5. Store Filters (Niche/Country)
    if filters.niche:
        query = query.filter(GlobalStore.niche == filters.niche)
    if filters.country:
        query = query.filter(GlobalStore.country == filters.country)

    # 6. Smart Presets
    if filters.preset == "recommended":
        query = query.filter(GlobalProduct.is_winner == True)
    elif filters.preset == "new_shops":
        query = query.filter(GlobalProduct.is_new == True)
    elif filters.preset == "active_ads":
        query = query.filter(GlobalProduct.ads_count > 10) # Example logic

    # 7. Sorting
    if filters.sort_by == "revenue_est":
        query = query.order_by(desc(GlobalProduct.revenue_est))
    elif filters.sort_by == "ads_count":
        query = query.order_by(desc(GlobalProduct.ads_count))
    elif filters.sort_by == "price_low":
        query = query.order_by(asc(GlobalProduct.price))
    else:
        query = query.order_by(desc(GlobalProduct.created_at))

    # Pagination
    total_count = query.count()
    products = query.offset((page - 1) * limit).limit(limit).all()

    # Response Formatting
    results = []
    for p in products:
        results.append({
            "id": p.id,
            "title": p.title,
            "price": p.price,
            "image_url": p.image_url,
            "revenue": p.revenue_est,
            "ads_active": p.ads_count,
            "trend": p.traffic_growth,
            "store": {
                "name": p.store.name,
                "url": p.store.url,
                "logo": p.store.logo_url,
                "country": p.store.country
            }
        })

    return {
        "total": total_count,
        "page": page,
        "results": results
    }
