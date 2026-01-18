from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
from typing import List, Optional
import random
import asyncio

router = APIRouter(
    prefix="/api/ads-gen",
    tags=["ads-generator"]
)

class AdCopyRequest(BaseModel):
    product_name: str
    store_vibe: str # "Professional", "Fun", "Luxury", "Urgent"
    target_audience: str

class AdCopyResponse(BaseModel):
    hook: str
    body: str
    cta: str
    hashtags: str

class CreativeRequest(BaseModel):
    image_url: str
    template: str # "Sale", "Lifestyle", "Minimal"
    text_overlay: str

# --- CONFIG ---
import os

# --- CONFIG ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Auto-detect provider
if GEMINI_API_KEY:
    AI_PROVIDER = "Gemini"
elif OPENAI_API_KEY:
    AI_PROVIDER = "OpenAI"
else:
    AI_PROVIDER = "Mock"


# --- HELPERS ---
def generate_with_gemini(product: str, vibe: str) -> dict:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    prompt = f"""
    You are a professional marketing copywriter. Write a Facebook Ad for a product called "{product}".
    The store vibe is "{vibe}".
    
    Return ONLY a raw JSON object (no markdown formatting) with the following keys:
    - hook: A catchy headline (max 10 words).
    - body: Persuasive ad body text (max 50 words).
    - cta: A short Call to Action.
    - hashtags: 3-5 relevant hashtags.
    """
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    try:
        import requests
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            # Gemini response structure
            candidates = data.get("candidates", [])
            if not candidates:
                print("Gemini: No candidates returned")
                return None
            
            text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            # Clean text to ensure it's valid JSON
            import json
            text = text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        else:
            print(f"Gemini Error: {response.text}")
            return None
    except Exception as e:
        print(f"Gemini Exception: {e}")
        return None

def generate_with_openai(product: str, vibe: str) -> dict:
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    
    prompt = f"""
    You are a professional marketing copywriter. Write a Facebook Ad for a product called "{product}".
    The store vibe is "{vibe}".
    
    Return ONLY a raw JSON object (no markdown formatting) with the following keys:
    - hook: A catchy headline (max 10 words).
    - body: Persuasive ad body text (max 50 words).
    - cta: A short Call to Action.
    - hashtags: 3-5 relevant hashtags.
    """
    
    payload = {
        "model": "gpt-4o-mini", # Cost effective model
        "messages": [
            {"role": "system", "content": "You are a marketing expert. Output JSON only."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }
    
    try:
        import requests
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            import json
            text = text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        else:
            print(f"OpenAI Error: {response.text}")
            return None
    except Exception as e:
        print(f"OpenAI Exception: {e}")
        return None

@router.post("/copy", response_model=AdCopyResponse)
async def generate_ad_copy(req: AdCopyRequest):
    """
    Generates ad copy using chosen AI Provider.
    """
    # 1. Try Gemini
    if AI_PROVIDER == "Gemini" and "YOUR_GEMINI_KEY" not in GEMINI_API_KEY:
        result = generate_with_gemini(req.product_name, req.store_vibe)
        if result:
            return AdCopyResponse(**result)
            
    # 2. Try OpenAI (If configured)
    if AI_PROVIDER == "OpenAI" and "sk-" in OPENAI_API_KEY:
        result = generate_with_openai(req.product_name, req.store_vibe)
        if result:
            return AdCopyResponse(**result)
        
    # 3. Fallback to Mock
    await asyncio.sleep(1.0)
    
    product = req.product_name
    vibe = req.store_vibe.lower()
    
    # ... mock logic continues below ...
    
    hooks = [
        f"Stop scrolling! The {product} you've been waiting for is here.",
        f"Transform your life with {product}.",
        f"Why is everyone talking about {product}?",
        f"The secret to a better day? {product}."
    ]
    
    bodies = [
        f"Experience the ultimate quality and design. Our {product} is crafted for those who demand the best.",
        f"Get yours today and join 10,000+ happy customers. Limited stock available!",
        f"Designed for comfort, built for style. {product} is the upgrade you need.",
        f"Don't miss out on the trend. {product} is selling out fast!"
    ]
    
    ctas = [
        "Shop Now", "Get 50% Off Today", "Claim Yours", "Order Now & Save"
    ]
    
    if vibe == "luxury":
        hooks = [f"Elevate your standard with {product}.", f"Sophistication meets {product}."]
        bodies = [f"Indulge in the finest craftsmanship. {product} is not just a product, it's a statement.", f"Exclusively for the discerning few."]
    
    if vibe == "urgent":
        hooks = [f"LAST CHANCE for {product}!", f"Flash Sale Alert: {product}."]
        bodies = [f"Only a few left in stock. Grab your {product} before it's gone forever!", f"Time is ticking. 50% Off ends in 1 hour."]

    return AdCopyResponse(
        hook=random.choice(hooks),
        body=random.choice(bodies),
        cta=random.choice(ctas),
        hashtags=f"#{product.replace(' ', '')} #MustHave #Trending #ShopNow"
    )

@router.post("/creative")
async def generate_creative(req: CreativeRequest):
    """
    Mock endpoint for Ad Creative Generation.
    In real usage, this would use Canvas API or Python PIL/OpenCV.
    Here we return predefined 'processed' image URLs based on template.
    """
    await asyncio.sleep(2.0) # Simulate Image Processing
    
    # We return mock images that look "Edited"
    # In a real app, you would composite req.image_url with a template.
    
    mock_creatives = {
        "Sale": "https://ae01.alicdn.com/kf/S8f566c54767245999818817342095856P.jpg",
        "Lifestyle": "https://ae01.alicdn.com/kf/Se2528753232845348981440787383216o.jpg",
        "Minimal": "https://ae01.alicdn.com/kf/Sbc0f5080034c44249071060965767243P.jpg"
    }
    
    return {
        "status": "success", 
        "creative_url": mock_creatives.get(req.template, mock_creatives["Minimal"]),
        "template_used": req.template
    }
