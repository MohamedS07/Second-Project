import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

# Default to local postgres if not specified
# Try to connect to 'postgres' db to create new db
DATABASE_URL = os.getenv("DATABASE_ROOT_URL", "postgresql://postgres:AcademyRootPassword@localhost/postgres")
NEW_DB_NAME = "uzhavan_db"

def create_database():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if exists
        cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{NEW_DB_NAME}'")
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Creating database {NEW_DB_NAME}...")
            cursor.execute(f"CREATE DATABASE {NEW_DB_NAME}")
            print(f"Database {NEW_DB_NAME} created successfully.")
        else:
            print(f"Database {NEW_DB_NAME} already exists.")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")
        print("Please ensure your PostgreSQL is running and credentials in backend/database.py (or .env) are correct.")

if __name__ == "__main__":
    create_database()
