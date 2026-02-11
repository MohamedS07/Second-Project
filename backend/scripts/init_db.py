import sys
import os


sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend import database, models

print("Initializing Database...")
try:
    print("Creating tables from models...")
   
    database.Base.metadata.create_all(bind=database.engine)
    print("Database has been initialized successfully.")
except Exception as e:
    print(f"Error initializing database: {e}")
