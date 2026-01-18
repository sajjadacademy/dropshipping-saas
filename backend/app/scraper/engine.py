import json
import csv
import os
from datetime import datetime

class SalesEngine:
    def compare_snapshots(self, file_path_1: str, file_path_2: str) -> str:
        """
        Compares two products.json snapshots and generates a sales report CSV.
        Returns the path to the generated CSV artifact.
        """
        try:
            with open(file_path_1, 'r', encoding='utf-8') as f1:
                data1 = json.load(f1)
            with open(file_path_2, 'r', encoding='utf-8') as f2:
                data2 = json.load(f2)
        except Exception as e:
            print(f"Error loading files: {e}")
            return None

        # Create a map of product_id -> product_data for faster lookup
        products1 = {str(p['id']): p for p in data1.get('products', [])}
        products2 = {str(p['id']): p for p in data2.get('products', [])}

        sales_report = []

        for p_id, p2 in products2.items():
            p1 = products1.get(p_id)
            if not p1:
                continue # New product, can't calc sales yet

            for v2 in p2['variants']:
                v1 = next((v for v in p1['variants'] if v['id'] == v2['id']), None)
                if not v1:
                    continue

                # Logic 1: Public Inventory
                if 'inventory_quantity' in v1 and 'inventory_quantity' in v2:
                    qty1 = v1['inventory_quantity']
                    qty2 = v2['inventory_quantity']
                    if qty1 > qty2:
                        sold = qty1 - qty2
                        revenue = sold * float(v2['price'])
                        sales_report.append({
                            'product_id': p_id,
                            'product_title': p2['title'],
                            'variant_id': v2['id'],
                            'variant_title': v2['title'],
                            'units_sold_est': sold,
                            'revenue_est': revenue,
                            'timestamp': datetime.now().isoformat(),
                            'method': 'inventory_diff'
                        })
                
                # Logic 2: Hidden Inventory (Status Change)
                else:
                    # Check if status changed from available to not available
                    # Note: products.json often uses 'available' boolean, but sometimes it depends on inventory_management
                    available1 = v1.get('available', True) # Default to true if missing? or strict check
                    available2 = v2.get('available', True)
                    
                    if available1 and not available2:
                        # Sold out!
                        sales_report.append({
                            'product_id': p_id,
                            'product_title': p2['title'],
                            'variant_id': v2['id'],
                            'variant_title': v2['title'],
                            'units_sold_est': 1, # Minimal estimate
                            'revenue_est': float(v2['price']),
                            'timestamp': datetime.now().isoformat(),
                            'method': 'status_change_sold_out'
                        })
                    elif v1.get('updated_at') != v2.get('updated_at'):
                         # Updated but status didn't change to sold out? Maybe price change or simple update.
                         # Strict diff engine might ignore this to avoid false positives.
                         pass

        # Generate CSV
        if not sales_report:
            print("No sales detected between snapshots.")
            return None

        artifact_name = "Phase2_Artifact.csv"
        # Save in backend root for easy access or artifacts dir?
        # User requested "Phase2_Artifact.csv"
        csv_path = os.path.join("backend", artifact_name)
        
        keys = sales_report[0].keys()
        with open(csv_path, 'w', newline='', encoding='utf-8') as output_file:
            dict_writer = csv.DictWriter(output_file, keys)
            dict_writer.writeheader()
            dict_writer.writerows(sales_report)
            
        print(f"Sales report generated: {csv_path}")
        return csv_path
