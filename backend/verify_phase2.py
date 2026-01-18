import asyncio
import os
from app.scraper.detector import ShopifyDetector
from app.scraper.tracker import StealthTracker
from app.scraper.engine import SalesEngine

async def verify_phase_2():
    print("--- Starting Phase 2 Verification ---")
    
    # 1. Detector Verification
    detector = ShopifyDetector()
    stores = [
        ("https://www.gymshark.com", True),
        ("https://colourpop.com", True),
        ("https://example.com", False)
    ]
    
    print("\n[Detector Test]")
    for url, expected in stores:
        result = detector.is_shopify(url)
        status = "PASS" if result == expected else "FAIL"
        print(f"Store: {url} | Expected: {expected} | Got: {result} | [{status}]")

    # 2. Stealth Tracker & Engine Verification
    print("\n[Tracker & Engine Test]")
    tracker = StealthTracker()
    engine = SalesEngine()
    
    target_store = "https://colourpop.com" # Gymshark is huge, colourpop might be slightly smaller or just use it.
    
    print(f"Fetching Snapshot 1 from {target_store}...")
    file1 = await tracker.fetch_products(target_store)
    
    if not file1:
        print("Failed to fetch Snapshot 1. Aborting.")
        return

    print("Simulating time jump (Mocking data for Snapshot 2)...")
    # To test the engine without waiting hours, we will create a mock Snapshot 2 based on Snapshot 1
    # We will manually decrement inventory of the first product's first variant
    import json
    with open(file1, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Modify data
    modified = False
    if data.get('products'):
        product = data['products'][0]
        variant = product['variants'][0]
        
        # Scenario A: Inventory Quantity exists
        if 'inventory_quantity' in variant:
            print(f"Modifying inventory for {product['title']} - {variant['title']}")
            original_qty = variant['inventory_quantity']
            variant['inventory_quantity'] = original_qty - 5 # Sold 5
            modified = True
            
        # Scenario B: No inventory, simulate Sold Out
        else:
             print(f"Modifying status for {product['title']} - {variant['title']}")
             variant['available'] = False
             modified = True
    
    if modified:
        # Save as snapshot 2
        file2 = file1.replace(".json", "_mock_v2.json")
        with open(file2, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
            
        print(f"Created Mock Snapshot 2: {file2}")
        
        # Run Engine
        print("Running Sales Engine...")
        report_path = engine.compare_snapshots(file1, file2)
        
        if report_path:
             print(f"SUCCESS: Artifact generated at {report_path}")
        else:
             print("FAILURE: No sales reported.")
    else:
        print("Could not modify data for test (no products found?).")

if __name__ == "__main__":
    asyncio.run(verify_phase_2())
