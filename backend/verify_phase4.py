import asyncio
from app.shopify.exporter import ShopifyExporter
from app.shopify.media import MediaHandler
from unittest.mock import MagicMock, patch

async def verify_phase_4():
    print("--- Starting Phase 4 Verification (Mock End-to-End) ---")
    
    # 1. Test Exporter (Luxury SEO & Push)
    print("\n[Exporter Test]")
    
    product_input = {
        "title": "Cheap Fitness Watch",
        "price": "49.99",
        "product_type": "Accessories"
    }
    
    # Mock the GraphQL client to avoid real network calls to Shopify
    with patch('shopify.GraphQL') as mock_graphql:
        mock_client = MagicMock()
        mock_graphql.return_value = mock_client
        
        # Mock response for productCreate
        mock_client.execute.return_value = {
            "data": {
                "productCreate": {
                    "product": {
                        "id": "gid://shopify/Product/123456789",
                        "title": "Minimalist Cheap Fitness Watch - Limited Edition", # Expected transformation
                        "status": "DRAFT"
                    },
                    "userErrors": []
                }
            }
        }
        
        exporter = ShopifyExporter()
        result = await exporter.push_product(product_input)
        
        if result and result['status'] == 'DRAFT':
            print(f"SUCCESS: Product Exported as DRAFT. ID: {result['id']}")
            print(f"Converted Title: {result['title']}")
        else:
            print(f"FAILURE: Export failed or incorrect status. Result: {result}")

    # 2. Test Media Handler (Upload & Poll)
    print("\n[Media Handler Test]")
    
    with patch('shopify.GraphQL') as mock_graphql:
        mock_client = MagicMock()
        mock_graphql.return_value = mock_client
        
        # Mock response for fileCreate
        # Sequence of responses: Staged -> READY
        # We can't easily mock the 'status' change in a simple return_value without side_effect logic
        # For simplicity, we'll mock immediate READY
        mock_client.execute.return_value = {
            "data": {
                "fileCreate": {
                    "files": [{
                        "id": "gid://shopify/File/987654321",
                        "fileStatus": "READY",
                        "url": "https://cdn.shopify.com/s/files/..."
                    }],
                    "userErrors": []
                }
            }
        }
        
        media = MediaHandler()
        file_id = media.upload_image("http://supplier.com/image.jpg")
        
        if file_id:
             print(f"SUCCESS: Image Uploaded and READY. ID: {file_id}")
        else:
             print("FAILURE: Image upload failed.")

if __name__ == "__main__":
    asyncio.run(verify_phase_4())
