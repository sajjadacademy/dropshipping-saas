from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
# ... imports ...
import google.generativeai as genai
import os
import json

# ... existing code ...

# Configure Gemini
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

# ... prefixes/suffixes ...

@router.post("/generate-store", response_model=AIStoreResponse)
async def generate_store_concept(params: dict):
    niche = params.get("niche", "General")
    
    # 1. Generate Concept (Gemini or Fallback)
    name = ""
    tagline = ""
    description = ""
    
    # Try Gemini First
    if GEMINI_KEY:
        try:
            print(f"DEBUG: Asking Gemini for store concept in niche: {niche}")
            model = genai.GenerativeModel('gemini-pro')
            prompt = f"""
            You are a branding expert. Create a premium, catchy, short store name, a modern tagline, and a 1-sentence description for a dropshipping store in the '{niche}' niche.
            Return ONLY raw JSON with keys: "name", "tagline", "description". 
            Example: {{"name": "UrbanPulse", "tagline": "Beat of the City", "description": "Urban essentials for modern living."}}
            """
            response = model.generate_content(prompt)
            # Clean response if markdown code blocks exist
            valid_json = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(valid_json)
            
            name = data.get("name")
            tagline = data.get("tagline")
            description = data.get("description")
            print(f"DEBUG: Gemini Success: {name}")
        except Exception as e:
            print(f"DEBUG: Gemini Error: {e}. Falling back to random.")
    
    # Fallback if Gemini failed or no key
    if not name:
        base_name = niche.capitalize()
        if random.random() > 0.5:
            name = f"{random.choice(PREFIXES)} {base_name}"
        else:
            name = f"{base_name}{random.choice(SUFFIXES)}"
        tagline = random.choice(TAGLINES).format(niche=niche)
        description = f"A curated collection of the best {niche} products."

    palette = random.choice(PALETTES)
    
    concept = StoreConcept(
        name=name,
        tagline=tagline,
        description=description,
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
