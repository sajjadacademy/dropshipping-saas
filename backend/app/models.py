from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    is_premium = Column(Boolean, default=False)
    api_key = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    tracked_stores = relationship("TrackedStore", back_populates="owner")

class TrackedStore(Base):
    __tablename__ = "tracked_stores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String, index=True)
    status = Column(String, default="active") # active, paused, error
    last_checked = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="tracked_stores")
    sales_data = relationship("SalesData", back_populates="store")

class SalesData(Base):
    __tablename__ = "sales_data"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("tracked_stores.id"))
    product_title = Column(String)
    product_id = Column(String) # Shopify Product ID
    variant_id = Column(String, nullable=True)
    price = Column(Float)
    quantity_sold = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

    store = relationship("TrackedStore", back_populates="sales_data")

# --- Phase 7 Models: Global Spy Database ---

class GlobalStore(Base):
    __tablename__ = "global_stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    url = Column(String, unique=True, index=True)
    logo_url = Column(String, nullable=True)
    niche = Column(String, index=True) # e.g., 'Fashion', 'Tech'
    country = Column(String, index=True) # e.g., 'US', 'FR'
    currency = Column(String, default="USD")
    
    # Metrics
    monthly_revenue = Column(Float, default=0.0)
    orders_est = Column(Integer, default=0) # orders per month
    product_count = Column(Integer, default=0)
    traffic = Column(Integer, default=0) # Number of visits
    traffic_growth = Column(Float, default=0.0) # percent
    active_ads = Column(Integer, default=0) # live ads
    main_traffic_source = Column(String, default="Direct") # e.g. Facebook, Google, Direct
    pixels = Column(String, nullable=True) # JSON or comma-separated list of pixels
    creation_date = Column(DateTime, default=datetime.utcnow)

    products = relationship("GlobalProduct", back_populates="store")

class GlobalProduct(Base):
    __tablename__ = "global_products"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("global_stores.id"))
    title = Column(String, index=True)
    handle = Column(String) # url handle
    image_url = Column(String)
    price = Column(Float)
    
    # Filters
    revenue_est = Column(Float, default=0.0)
    ads_count = Column(Integer, default=0)
    traffic_growth = Column(Float, default=0.0) # percentage
    is_winner = Column(Boolean, default=False) # "Smart Preset: Winner"
    is_new = Column(Boolean, default=False) # "Smart Preset: New"
    
    created_at = Column(DateTime, default=datetime.utcnow)

    store = relationship("GlobalStore", back_populates="products")
