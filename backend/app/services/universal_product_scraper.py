import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

class UniversalProductScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        }

    def scrape_url(self, url: str):
        if not url.startswith("http"):
            url = "https://" + url
            
        domain = urlparse(url).netloc
        
        try:
            res = requests.get(url, headers=self.headers, timeout=15)
            res.raise_for_status()
            soup = BeautifulSoup(res.text, "html.parser")
            
            data = {
                "title": "",
                "description": "",
                "images": [],
                "price": "",
                "source": domain,
                "original_url": url
            }
            
            # Strategy 1: Open Graph Tags (Universal)
            og_title = soup.find("meta", property="og:title")
            if og_title:
                data["title"] = og_title.get("content", "")
                
            og_image = soup.find("meta", property="og:image")
            if og_image:
                data["images"].append(og_image.get("content", ""))
                
            og_desc = soup.find("meta", property="og:description")
            if og_desc:
                data["description"] = og_desc.get("content", "")
                
            # Strategy 2: Fallback to Standard Information
            if not data["title"]:
                data["title"] = soup.title.string if soup.title else ""
                
            # Strategy 3: Find additional images (Generic)
            # Look for large images or gallery images
            for img in soup.find_all("img", src=True):
                src = img["src"]
                if src.startswith("//"):
                    src = "https:" + src
                elif src.startswith("/"):
                    src = "https://" + domain + src
                
                # Filter small icons
                if "icon" not in src and "logo" not in src:
                    data["images"].append(src)
            
            # Cleanup
            data["title"] = data["title"].strip()
            data["description"] = data["description"].strip()
            # De-duplicate images and limit to 5
            data["images"] = list(set(data["images"]))[:5]
            
            return data
            
        except Exception as e:
            print(f"Scrape Error: {e}")
            return {"error": str(e)}
