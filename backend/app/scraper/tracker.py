import asyncio
import json
import os
from datetime import datetime
from playwright.async_api import async_playwright
try:
    from playwright_stealth import stealth_async
except ImportError:
    # Fallback if stealth not installed, though it should be
    stealth_async = None

class StealthTracker:
    def __init__(self, raw_data_dir="backend/raw_data"):
        self.raw_data_dir = raw_data_dir
        os.makedirs(self.raw_data_dir, exist_ok=True)

    async def fetch_products(self, url: str) -> str:
        """
        Fetches products.json from a Shopify store using stealth mode.
        Returns the path to the saved JSON file.
        """
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            if stealth_async:
                await stealth_async(page)
            
            # Ensure URL is formatted correctly
            if not url.startswith("http"):
                url = "https://" + url
                
            products_url = f"{url.rstrip('/')}/products.json?limit=250"
            print(f"Fetching: {products_url}")
            
            try:
                await page.goto(products_url, wait_until="networkidle")
                
                # Extract JSON content
                content = await page.content()
                # Use evaluate to get the raw JSON text from the body if it's rendered as text
                # Or just grab the text content if the browser renders the JSON
                json_content = await page.evaluate("document.body.innerText")
                
                # Validate JSON
                try:
                    data = json.loads(json_content)
                except json.JSONDecodeError:
                    # Fallback: sometimes it's wrapped in HTML pre tags
                    json_content = await page.locator("pre").inner_text()
                    data = json.loads(json_content)

                # Save to file
                domain = url.split("//")[-1].replace("/", "_")
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{domain}_{timestamp}.json"
                file_path = os.path.join(self.raw_data_dir, filename)
                
                with open(file_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
                
                print(f"Saved: {file_path}")
                return file_path
                
            except Exception as e:
                print(f"Error fetching {url}: {e}")
                return None
            finally:
                await browser.close()
