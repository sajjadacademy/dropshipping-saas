from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..models import GlobalStore, GlobalProduct

router = APIRouter(
    prefix="/api/stores",
    tags=["stores"]
)

class StoreSearchFilter(BaseModel):
    keyword: Optional[str] = None
    min_revenue: Optional[float] = None
    min_traffic: Optional[int] = None
    min_ads: Optional[int] = None
    min_products: Optional[int] = None # Added
    min_orders: Optional[int] = None # Added
    min_growth: Optional[float] = None # Added
    niche: Optional[str] = None
    country: Optional[str] = None
    currency: Optional[str] = None # Added
    pixels: Optional[str] = None # Added
    traffic_source: Optional[str] = None
    preset: Optional[str] = None
    sort_by: Optional[str] = "revenue"

@router.post("/search")
def search_stores(
    filters: StoreSearchFilter,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(GlobalStore)

    # 1. Search Tab
    if filters.keyword:
        query = query.filter(
            (GlobalStore.name.ilike(f"%{filters.keyword}%")) | 
            (GlobalStore.url.ilike(f"%{filters.keyword}%"))
        )

    # 2. Filters
    if filters.min_revenue is not None:
        query = query.filter(GlobalStore.monthly_revenue >= filters.min_revenue)
    if filters.min_traffic is not None:
        query = query.filter(GlobalStore.traffic >= filters.min_traffic)
    if filters.min_ads is not None:
        query = query.filter(GlobalStore.active_ads >= filters.min_ads)
    
    # New Advanced Filters
    if filters.min_products is not None:
        query = query.filter(GlobalStore.product_count >= filters.min_products)
    if filters.min_orders is not None:
        query = query.filter(GlobalStore.orders_est >= filters.min_orders)
    if filters.min_growth is not None:
        query = query.filter(GlobalStore.traffic_growth >= filters.min_growth)
    if filters.currency:
        query = query.filter(GlobalStore.currency == filters.currency)
    if filters.pixels:
        query = query.filter(GlobalStore.pixels.ilike(f"%{filters.pixels}%"))
        
    if filters.niche:
        query = query.filter(GlobalStore.niche == filters.niche)
    if filters.country:
        query = query.filter(GlobalStore.country == filters.country)
    if filters.traffic_source:
        query = query.filter(GlobalStore.main_traffic_source.ilike(f"%{filters.traffic_source}%"))

    # Sorting
    if filters.sort_by == "revenue":
        query = query.order_by(desc(GlobalStore.monthly_revenue))
    elif filters.sort_by == "traffic":
        query = query.order_by(desc(GlobalStore.traffic))
    elif filters.sort_by == "ads":
        query = query.order_by(desc(GlobalStore.active_ads))
    elif filters.sort_by == "newest":
        query = query.order_by(desc(GlobalStore.creation_date))
    
    total = query.count()
    stores = query.offset((page - 1) * limit).limit(limit).all()

    # Step 5 requirement: Best Selling Product per store
    results = []
    for s in stores:
        # Fetch best selling (highest revenue/price) product for this store
        best_product = db.query(GlobalProduct).filter(
            GlobalProduct.store_id == s.id
        ).order_by(desc(GlobalProduct.revenue_est)).first()

        results.append({
            "id": s.id,
            "name": s.name,
            "url": s.url,
            "logo": s.logo_url,
            "country": s.country,
            "niche": s.niche,
            "revenue": s.monthly_revenue,
            "orders": s.orders_est,
            "traffic": s.traffic,
            "growth": s.traffic_growth,
            "active_ads": s.active_ads,
            "source": s.main_traffic_source,
            "best_product": {
                "title": best_product.title if best_product else "N/A",
                "image": best_product.image_url if best_product else None,
                "price": best_product.price if best_product else 0
            }
        })

    return {"total": total, "results": results}
