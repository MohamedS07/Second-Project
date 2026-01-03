import sys
import os

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import database, models
from sqlalchemy import MetaData

print("Resetting Database...")
try:
    
    metadata = MetaData()
    metadata.reflect(bind=database.engine)
    
    print(f"Dropping all reflected tables: {list(metadata.tables.keys())}")
    metadata.drop_all(bind=database.engine)
    
    
    print("Creating tables from models...")
    from backend.database import Base
    Base.metadata.create_all(bind=database.engine)
    
    print("Database has been reset successfully.")
except Exception as e:
    print(f"Error resetting database: {e}")
