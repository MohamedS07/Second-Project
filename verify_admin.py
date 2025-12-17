from backend.core.database import SessionLocal
from backend.models import User
from backend.core.security import verify_password
import sys

def verify_admin(email, password):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print("User not found!")
            return
        
        print(f"User found: {user.email}, Role: {user.role}")
        if verify_password(password, user.hashed_password):
            print("Password matches!")
        else:
            print("Password INCORRECT.")
            
    finally:
        db.close()

if __name__ == "__main__":
    verify_admin("admin@uzhavan.com", "admin123")
