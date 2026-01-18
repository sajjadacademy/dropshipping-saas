import sys
import os

# Ensure backend can be imported
sys.path.append(os.getcwd())

from backend.app.database import SessionLocal, engine, Base
from backend.app.models import GlobalStore, GlobalProduct
from sqlalchemy import text
import random

# Start fresh
try:
    db = SessionLocal()
    db.execute(text("DROP TABLE IF EXISTS global_products"))
    db.execute(text("DROP TABLE IF EXISTS global_stores"))
    db.commit()
    print("🗑️ Dropped old tables.")
except Exception as e:
    print(f"⚠️ Drop warning: {e}")

# Initialize Tables
Base.metadata.create_all(bind=engine)

# Cleanup
try:
    db.execute(text("DELETE FROM global_products"))
    db.execute(text("DELETE FROM global_stores"))
    db.commit()
    print("🧹 Database cleaned.")
except Exception as e:
    print(f"⚠️ Clean warning: {e}")
    db.rollback()

# Constants
NICHES = ['Fashion', 'Health/Beauty', 'Electronics', 'Home/Garden', 'Pets', 'Fitness']
COUNTRIES = ['US', 'UK', 'CA', 'AU', 'BR', 'DE', 'FR']
IMAGES = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200', # Watch
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200', # Headphone
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200', # Shoe
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200', # Serum
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200', # Brace
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=200', # Polaroid
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=200', # Lotion
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=200', # Sunglasses
]

stores = []

print("🏗️ Generating 50 Stores...")
for i in range(50):
    niche = random.choice(NICHES)
    store = GlobalStore(
        name=f"{niche} Haven {i}",
        url=f"www.{niche.lower().replace('/', '')}{i}.com",
        logo_url=f"https://ui-avatars.com/api/?name={niche[0]}+{i}&background=random&color=fff",
        niche=niche,
        country=random.choice(COUNTRIES),
        monthly_revenue=random.uniform(1000, 500000),
        orders_est=random.randint(50, 5000),
        product_count=random.randint(10, 2000),
        active_ads=random.randint(0, 500),
        traffic=random.randint(1000, 100000),
        traffic_growth=round(random.uniform(-20, 150), 2),
        main_traffic_source=random.choice(['Facebook Ads', 'Google Ads', 'Direct', 'TikTok Ads', 'SEO']),
        pixels=random.choice(['FB,TikTok', 'FB', 'Google', 'None'])
    )
    db.add(store)
    stores.append(store)

db.commit()

print("📦 Generating 300 Products...")
for i in range(300):
    store = random.choice(stores)
    price = round(random.uniform(15.0, 120.0), 2)
    ads = random.randint(0, store.active_ads)
    
    prod = GlobalProduct(
        store_id=store.id,
        title=f"Viral {store.niche} Product {i}",
        handle=f"viral-{store.niche.lower()}-{i}",
        image_url=random.choice(IMAGES),
        price=price,
        revenue_est=price * random.randint(10, 500), # Simple calc
        ads_count=ads,
        traffic_growth=round(random.uniform(-10, 150), 2),
        is_winner=ads > 100 and random.random() > 0.7,
        is_new=store.id > 40
    )
    db.add(prod)

db.commit()
db.close()
print("✅ Seeding Successful!")
