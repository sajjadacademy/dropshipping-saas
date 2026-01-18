from app.database import engine, Base
from app.models import User, TrackedStore, SalesData
from sqlalchemy import inspect

def check_db_status():
    print("Checking database connection...")
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully.")
        
        # Inspect tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables found: {tables}")
        
        expected_tables = ["users", "tracked_stores", "sales_data"]
        missing_tables = [t for t in expected_tables if t not in tables]
        
        if not missing_tables:
            print("SUCCESS: All expected tables are present.")
        else:
            print(f"FAILURE: Missing tables: {missing_tables}")
            exit(1)
            
    except Exception as e:
        print(f"FAILURE: Database error: {e}")
        exit(1)

if __name__ == "__main__":
    check_db_status()
