from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv

load_dotenv()



SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres.qsrnhruqwhkfgdxenvxi:UzhavanConnect@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require")


engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=20,
    max_overflow=0,
    pool_recycle=300,
    pool_pre_ping=False,
    connect_args={
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5
    }
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


