from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os

# Use environment variable for production, fallback to local for development
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres.qsrnhruqwhkfgdxenvxi:UzhavanConnect@aws-1-ap-south-1.pooler.supabase.com:6543/postgres")

# Supabase (Postgres) connection optimization
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=20,
    max_overflow=0,
    # Transaction poolers (port 6543) often require autocommit-like behavior or specific isolation levels
    # We will try standard configuration first but ensure connections are recycled
    pool_recycle=300
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


