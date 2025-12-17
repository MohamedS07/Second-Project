import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Uzhavan Connect API"
    PROJECT_VERSION: str = "1.0.0"
    
    # DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:AcademyRootPassword@localhost/uzhavan_db")
    # Forcing the worked password from previous step
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:AcademyRootPassword@localhost/uzhavan_db")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    UPLOAD_DIR: str = os.path.join(os.getcwd(), "uploads")

settings = Settings()
