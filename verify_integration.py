
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api/ads/search"

def test_endpoint(name, params):
    print(f"\n--- Testing: {name} ---")
    print(f"Params: {params}")
    try:
        response = requests.get(BASE_URL, params=params)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            # Verify structure
            assert "ads" in data, "Response missing 'ads' key"
            assert "total" in data, "Response missing 'total' key"
            
            ads = data['ads']
            print(f"Ads Returned: {len(ads)}")
            
            if len(ads) > 0:
                first_ad = ads[0]
                # Check critical fields
                required_fields = ["id", "thumbnail", "cta", "country", "status", "niche"]
                missing = [f for f in required_fields if f not in first_ad]
                if missing:
                    print(f"❌ Missing fields in Ad object: {missing}")
                else:
                    print(f"✅ Ad Structure OK. Sample ID: {first_ad['id']}")
                    
            if "paging" in data:
                print(f"✅ Paging Object Present: {data['paging']}")
            else:
                print(f"⚠️ Paging Object Missing (Expected even if empty)")

        else:
            print(f"❌ Failed with {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

# 1. Default Load
test_endpoint("Default Load (No Params)", {})

# 2. Country Filter (Multiple)
test_endpoint("Country Filter (US, FR)", {"country": "US,FR"})

# 3. Niche Filter
test_endpoint("Niche Filter (Fashion)", {"niche": "Fashion"})

# 4. CTA Filter
test_endpoint("CTA Filter (Shop Now)", {"cta": "Shop Now"})

# 5. Live Ads Count
test_endpoint("Min Live Ads (10+)", {"min_live_ads": 10})

# 6. Date Range
test_endpoint("Date Range", {"date_start": "2024-01-01", "date_end": "2024-12-31"})

# 7. Pagination (Simulate)
# Note: cursor would normally come from a previous response. 
# We just check if passing a random cursor doesn't crash it (API might ignore or return empty).
test_endpoint("Pagination (Cursor)", {"cursor": "MQ=="}) 
