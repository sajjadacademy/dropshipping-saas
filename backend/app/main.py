from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from app.shopify.auth import router as shopify_router
from app.shopify.exporter import ShopifyExporter
from app.services.sentry_setup import init_sentry
from app.services.stripe_service import StripeService
from app.scraper.detector import ShopifyDetector  # Added import
import asyncio
import json
import random
from datetime import datetime
from pydantic import BaseModel

# Initialize Sentry
init_sentry()

app = FastAPI(title="Zelvyra API", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
from fastapi.staticfiles import StaticFiles
import os
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include Routers
app.include_router(shopify_router)
from app.routers import products, stores
app.include_router(products.router)
app.include_router(stores.router)
from app.routers import analysis
app.include_router(analysis.router)
from app.routers import ads
app.include_router(ads.router)
from app.routers import product_search
app.include_router(product_search.router)
from app.routers import ai_store
app.include_router(ai_store.router)
from app.routers import store_ai
app.include_router(store_ai.router)
from app.routers import ads_generator
app.include_router(ads_generator.router)

class TrackStoreRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"message": "Zelvyra API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# --- Phase 3: Analytics Endpoints ---

@app.get("/get-store-analytics")
def get_store_analytics():
    """
    Returns aggregated sales metrics.
    """
    # Real Data State (Empty until Store Tracked)
    return {
        "total_revenue": 0.00,
        "average_order_value": 0.00,
        "sales_momentum": 0,
        "top_products": []
    }

async def sales_generator():
    """
    Yields mock sales events.
    """
    # Real Data Mode: Idle until Webhooks or Real Sales
    while True:
        await asyncio.sleep(30)
        # yield newline only (empty string after split) to keep connection alive without parsing error
        yield "\n" 

@app.get("/stream-sales")
async def stream_sales():
    return StreamingResponse(sales_generator(), media_type="application/x-ndjson")

# --- Phase 4: Export Endpoint ---
@app.post("/export-product")
async def export_product(product_data: dict):
    exporter = ShopifyExporter()
    result = await exporter.push_product(product_data)
    if result:
        return {"status": "success", "product": result}
    else:
        return {"status": "error", "message": "Export failed"}

# --- Final Phase: Track Store Endpoint ---
@app.post("/track-new-store")
async def track_new_store(request: TrackStoreRequest):
    detector = ShopifyDetector()
    is_shopify = detector.is_shopify(request.url)
    
    if is_shopify:
        # In real app: Add to DB
        return {"status": "success", "message": f"Successfully tracked {request.url}"}
    else:
        return {"status": "error", "message": "Not a valid Shopify store or unreachable."}

# --- Phase 5: Infrastructure ---
@app.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    service = StripeService()
    return await service.handle_webhook(request)

@app.get("/trigger-error")
def trigger_error():
    division_by_zero = 1 / 0
