from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import random
from app.routers.product_search import fetch_rapidapi_search, get_mock_results, ProductResult

router = APIRouter(
    prefix="/api/ai",
    tags=["ai-store"]
)

class StoreConcept(BaseModel):
    name: str
    tagline: str
    description: str
    colors: Dict[str, str] # primary, secondary, accent
    niche: str

class AIStoreResponse(BaseModel):
    concept: StoreConcept
    products: List[ProductResult]

# "Smart" Generators
SUFFIXES = ["ify", "ly", "verse", "zone", "hub", "flow", "box", "crate", "haus"]
PREFIXES = ["The", "My", "Urban", "Eco", "Pro", "Ultra", "Hyper", "Zen"]
TAGLINES = [
    "Premium {niche} essentials for the modern life.",
    "Elevate your {niche} experience.",
    "The ultimate destination for {niche} lovers.",
    "Curated quality, Unbeatable prices.",
    "Redefining {niche} style."
]

PALETTES = [
    {"primary": "#000000", "secondary": "#D4AF37", "accent": "#FFFFFF"}, # Luxury Gold
    {"primary": "#1A1A1A", "secondary": "#00FF94", "accent": "#2D2D2D"}, # Cyber Neon
    {"primary": "#2C3E50", "secondary": "#E74C3C", "accent": "#ECF0F1"}, # Bold Tech
    {"primary": "#F4F1EA", "secondary": "#5D4037", "accent": "#8D6E63"}, # Organic/Earth
    {"primary": "#FFFFFF", "secondary": "#3498DB", "accent": "#2980B9"}, # Clean Sky
]

@router.post("/generate-store", response_model=AIStoreResponse)
async def generate_store_concept(params: dict):
    niche = params.get("niche", "General")
    
    # 1. Generate Concept
    base_name = niche.capitalize()
    if random.random() > 0.5:
        name = f"{random.choice(PREFIXES)} {base_name}"
    else:
        name = f"{base_name}{random.choice(SUFFIXES)}"
        
    tagline = random.choice(TAGLINES).format(niche=niche)
    palette = random.choice(PALETTES)
    
    concept = StoreConcept(
        name=name,
        tagline=tagline,
        description=f"A curated collection of the best {niche} products.",
        colors=palette,
        niche=niche
    )
    
    # 2. Fetch Products (Curated Top 4)
    # Reuse scraper from product_search
    # Try real scrape first, fallback to mock
    products = fetch_rapidapi_search(niche)
    if not products:
        products = get_mock_results(niche, "Both")
    
    # Limit to top 4 for the "Starter Pack"
    selected_products = products[:4]
    
    return {
        "concept": concept,
        "products": selected_products
    }
