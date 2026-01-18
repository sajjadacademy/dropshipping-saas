import requests
from urllib.parse import urlparse

class ShopifyDetector:
    def is_shopify(self, url: str) -> bool:
        """
        Determines if a given URL is a Shopify store.
        """
        # 1. Check URL structure
        parsed_url = urlparse(url)
        if "myshopify.com" in parsed_url.netloc:
            return True

        try:
            # 2. Check Headers and Source
            response = requests.get(url, timeout=10)
            
            # Check Headers
            if "X-ShopId" in response.headers:
                return True
            
            # Check Source Code
            if "Shopify.theme" in response.text or "cdn.shopify.com" in response.text:
                return True
                
        except requests.RequestException:
            # If request fails, we can't definitively say it's not, but return False for now
            return False
            
        return False
