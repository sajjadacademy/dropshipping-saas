
import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/ads/search"
OUTPUT_FILE = "verification_results.txt"

def log(msg):
    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        f.write(msg + "\n")

def test_endpoint(name, params):
    log(f"\n--- Testing: {name} ---")
    log(f"Params: {params}")
    try:
        response = requests.get(BASE_URL, params=params)
        log(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            # Verify structure
            if "ads" not in data: log("FAILURE: Missing 'ads' key")
            if "total" not in data: log("FAILURE: Missing 'total' key")
            
            ads = data['ads']
            log(f"Ads Returned: {len(ads)}")
            
            if len(ads) > 0:
                first_ad = ads[0]
                required_fields = ["id", "thumbnail", "cta", "country", "status", "niche", "start_date"]
                missing = [f for f in required_fields if f not in first_ad]
                if missing:
                    log(f"FAILURE: Missing fields in Ad object: {missing}")
                else:
                    log(f"SUCCESS: Ad Structure OK. Sample ID: {first_ad['id']}")
            
            # Verify Paging
            if "paging" in data:
                log(f"SUCCESS: Paging Object Present: {data['paging']}")
            else:
                log(f"WARNING: Paging Object Missing")
                
        else:
            log(f"FAILURE: Status {response.status_code} - {response.text}")
            
    except Exception as e:
        log(f"EXCEPTION: {str(e)}")

# Clear file
with open(OUTPUT_FILE, "w") as f:
    f.write("Verification Log\n")

test_endpoint("Default Load", {})
test_endpoint("Multi Country", {"country": "US,FR"})
test_endpoint("Niche", {"niche": "Tech"})
test_endpoint("CTA", {"cta": "Shop Now"})
test_endpoint("Pagination", {"cursor": "test_cursor"})
