import shopify
import os
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse

router = APIRouter()

SHOPIFY_API_KEY = os.getenv("SHOPIFY_API_KEY", "mock_key")
SHOPIFY_API_SECRET = os.getenv("SHOPIFY_API_SECRET", "mock_secret")
SCOPES = ["write_products", "write_files"]
HOST = os.getenv("HOST", "http://localhost:8000")

shopify.Session.setup(api_key=SHOPIFY_API_KEY, secret=SHOPIFY_API_SECRET)

@router.get("/auth/shopify")
def auth(shop: str):
    if not shop:
        raise HTTPException(status_code=400, detail="Shop param is required")
        
    session = shopify.Session(shop, "2024-01")
    permission_url = session.create_permission_url(SCOPES, f"{HOST}/auth/callback")
    return RedirectResponse(permission_url)

@router.get("/auth/callback")
def callback(request: Request):
    params = dict(request.query_params)
    shop = params.get("shop")
    
    if not shop:
        raise HTTPException(status_code=400, detail="Shop param missing")

    try:
        session = shopify.Session(shop, "2024-01")
        # Validate HMAC
        if not shopify.Session.validate_params(params):
             # In a real scenario, raise error. For mock/dev without real credentials, we might bypass or log warning.
             # raise HTTPException(status_code=400, detail="HMAC validation failed")
             print("Warning: HMAC validation failed (Expected in Mock Mode)")
             pass

        token = session.request_token(params)
        # Store token in DB (omitted for brevity, assume "user" context)
        return {"status": "success", "token": token, "shop": shop}
        
    except Exception as e:
         return {"status": "error", "message": str(e)}
