import sys
import os

# Fix Path to allow imports from 'app'
# We are in /backend, and we want to import 'app' which is in /backend.
# So we add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, text, engine, Base
from app.models import GlobalStore, GlobalProduct
import random
from datetime import datetime

# Initialize Tables (if not already done by main app)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Cleanup old data
db.execute(text("DELETE FROM global_products"))
db.execute(text("DELETE FROM global_stores"))
db.commit()

print("🧹 Old data cleaned.")

# Mock Data Sources
NICHES = ['Fashion', 'Health', 'Tech', 'Home', 'Pets', 'Beauty']
COUNTRIES = ['US', 'FR', 'GB', 'DE', 'BR']
IMAGES = [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1534237710431-e2fc698436d5?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200'
]

stores = []

# Create 50 Mock Stores
for i in range(50):
    store = GlobalStore(
        name=f"Store_{i}_{random.randint(100,999)}",
        url=f"store{i}.com",
        logo_url=f"https://ui-avatars.com/api/?name=S{i}&background=random",
        niche=random.choice(NICHES),
        country=random.choice(COUNTRIES),
        monthly_revenue=random.uniform(5000, 500000),
        active_ads=random.randint(0, 5000)
    )
    db.add(store)
    stores.append(store)

db.commit() # Commit to get IDs

# Create 200 Mock Products
print(f"🏪 Created {len(stores)} stores.")

for i in range(200):
    store = random.choice(stores)
    prod = GlobalProduct(
        store_id=store.id,
        title=f"Premium {store.niche} Product {i}",
        handle=f"premium-product-{i}",
        image_url=random.choice(IMAGES),
        price=round(random.uniform(10.0, 150.0), 2),
        revenue_est=round(random.uniform(1000.0, 50000.0), 2),
        ads_count=random.randint(0, store.active_ads),
        traffic_growth=round(random.uniform(-20.0, 100.0), 2),
        is_winner=random.random() > 0.8,
        is_new=random.random() > 0.9
    )
    db.add(prod)

db.commit()
print("📦 Created 200 products.")
print("✅ Seeding Complete!")
db.close()
