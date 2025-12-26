from backend import database, models
from sqlalchemy import MetaData

print("Resetting Database...")
try:
    # Reflect current DB state to drop even unknown tables if they exist and we want a clean slate
    metadata = MetaData()
    metadata.reflect(bind=database.engine)
    
    print(f"Dropping all reflected tables: {list(metadata.tables.keys())}")
    metadata.drop_all(bind=database.engine)
    
    # Also ensure models' tables are recreated
    print("Creating tables from models...")
    models.Base.metadata.create_all(bind=database.engine)
    
    print("Database has been reset successfully.")
except Exception as e:
    print(f"Error resetting database: {e}")
