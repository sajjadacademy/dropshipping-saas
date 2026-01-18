import os
import requests
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(dotenv_path=".env")

def test_gemini():
    print("\n--- TEST 1: GEMINI ---")
    key = os.getenv("GEMINI_API_KEY")
    if not key: return print("[!] No Key")
    try:
        genai.configure(api_key=key)
        model = genai.GenerativeModel('gemini-pro')
        resp = model.generate_content("Say OK")
        print(f"[OK] Response: {resp.text}")
    except Exception as e:
        print(f"[FAIL] {e}")

def test_rapidapi():
    print("\n--- TEST 2: RAPIDAPI (AliExpress) ---")
    key = os.getenv("RAPIDAPI_KEY")
    if not key: return print("[!] No Key")
    
    url = "https://aliexpress-datahub.p.rapidapi.com/item_search"
    querystring = {"q":"watch","page":"1"}
    headers = {
        "x-rapidapi-key": key,
        "x-rapidapi-host": "aliexpress-datahub.p.rapidapi.com"
    }
    try:
        resp = requests.get(url, headers=headers, params=querystring)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("[OK] RapidAPI working")
        else:
            print(f"[FAIL] Body: {resp.text[:200]}")
    except Exception as e:
        print(f"[FAIL] {e}")

def test_meta():
    print("\n--- TEST 3: META ADS ---")
    token = os.getenv("META_ACCESS_TOKEN")
    if not token: return print("[!] No Token")
    
    url = "https://graph.facebook.com/v19.0/ads_archive"
    params = {
        'access_token': token,
        'search_terms': 'gym',
        'ad_active_status': 'ACTIVE',
        'ad_reached_countries': 'US',
        'limit': 1
    }
    try:
        resp = requests.get(url, params=params)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("[OK] Meta API working")
        else:
            print(f"[FAIL] Body: {resp.text[:200]}")
    except Exception as e:
        print(f"[FAIL] {e}")

if __name__ == "__main__":
    test_gemini()
    test_rapidapi()
    test_meta()
