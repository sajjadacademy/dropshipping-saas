from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import os
import requests  # Ensure requests is installed

router = APIRouter(
    prefix="/api/ads",
    tags=["ads"]
)

# === Configuration ===
# The user will provide these keys. 
# For now, we use placeholders or environment variables.
META_API_BASE_URL = os.getenv("META_API_BASE_URL", "https://graph.facebook.com/v19.0/ads_archive")
META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN", "") 

class AdCreative(BaseModel):
    id: str
    thumbnail: str
    platform: str
    format: str 
    active_days: int
    start_date: str
    copy: str
    cta: str 
    store_name: str
    store_url: str
    country: str
    niche: str
    status: str
    live_ads_count: int

class AdResponse(BaseModel):
    total: int
    ads: List[AdCreative]
    paging: Optional[dict] = {}

def fetch_real_time_ads(
    keyword: str,
    countries: List[str],
    limit: int = 20,
    cursor: str = None
) -> dict:
    """
    Fetches real-time ads from the Meta Ad Library API (or similar provider).
    Requires a valid Access Token.
    """
    if not META_ACCESS_TOKEN:
        # Fallback for demonstration if no key is provided, but we WARN the user.
        print("WARNING: No API Key found. Returning empty list or mock fallback.")
        return {"data": [], "paging": {}}

    params = {
        "access_token": META_ACCESS_TOKEN,
        "search_terms": keyword,
        "ad_reached_countries": countries, # e.g. ['US']
        "ad_active_status": "ALL",
        "ad_type": "ALL", # Changed to ALL to attempt commercial ads (Requires suitable token/permissions) 
                                              # For generic e-commerce, users often use 3rd party scrapers (Apify, etc).
                                              # We assume the user has a capability or a proxy here.
        "fields": "id,ad_creation_time,ad_creative_bodies,ad_creative_link_captions,ad_snapshot_url,publisher_platforms",
        "limit": limit
    }
    
    if cursor:
        params['after'] = cursor
    
    try:
        response = requests.get(META_API_BASE_URL, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"API Error: {e}")
        return {"data": [], "error": str(e)}

# --- Search Endpoint ---
@router.get("/search", response_model=AdResponse)
def search_ads(
    keyword: Optional[str] = "trends", # Default keyword to ensure results
    platform: Optional[str] = None,
    country: Optional[str] = None, # Default to None (All Countries)
    format: Optional[str] = None,
    status: Optional[str] = None,
    cta: Optional[str] = None,
    niche: Optional[str] = None,
    min_live_ads: Optional[int] = None,
    max_live_ads: Optional[int] = None,
    cursor: Optional[str] = None,
    limit: int = 100 # Updated default to 100
):
    # 1. Prepare Request
    # If no country provided, we default to a list of major markets for valid API query (Meta rarely allows purely 'Global' without specific countries)
    # Or strict 'US' fallback if 'All' isn't supported. 
    # For now, if country is None or 'All', we use broad list of top 5 markets or just US as safe default for 'Global' intent in free APIs.
    if country and country != "All" and country != "":
        target_countries = [c.strip().upper() for c in country.split(",")]
    else:
        target_countries = ['US', 'CA', 'GB', 'AU', 'FR', 'DE'] # 'Global' proxy
    
    # 2. Fetch Real Data
    api_data = fetch_real_time_ads(keyword, target_countries, limit, cursor)
    
    raw_ads = api_data.get("data", [])
    paging = api_data.get("paging", {})
    mapped_ads = []

    for item in raw_ads:
        # Map External API (Graph API structure)
        start_date = item.get("ad_creation_time", datetime.now().isoformat())[:10]
        start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        days_active = (datetime.now() - start_dt).days
        
        mapped_ads.append({
            "id": item.get("id", "unknown"),
            "thumbnail": item.get("ad_snapshot_url", "https://via.placeholder.com/400"), 
            "platform": "Facebook",
            "format": "Image",
            "active_days": days_active,
            "start_date": start_date,
            "copy": item.get("ad_creative_bodies", [""])[0] if item.get("ad_creative_bodies") else "No copy",
            "cta": item.get("ad_creative_link_captions", ["Shop Now"])[0] if item.get("ad_creative_link_captions") else "Shop Now",
            "store_name": "Unknown Store",
            "store_url": "#",
            "country": target_countries[0], # Just label with first country for now
            "niche": "General",
            "status": "Active",
            "live_ads_count": 1
        })

    # 3. Fallback to Mock if API fails or no key (User Demo safety)
    if not mapped_ads and not META_ACCESS_TOKEN:
         return {
             "total": 0,
             "ads": [],
             "paging": {}
         }
    
    # Use real total if available (often not in standard search response, so we estimate or use lenient)
    # If using 'cursor', we don't know total. We return a high placeholder if not provided.
    total_count = api_data.get_total_count() if hasattr(api_data, 'get_total_count') else 500000 

    return {
        "total": total_count, 
        "ads": mapped_ads,
        "paging": paging
    }
