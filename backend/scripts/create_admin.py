import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend import database, models, auth
from sqlalchemy.orm import Session

def create_admin_user():
    db = database.SessionLocal()
    try:
        email = input("Enter Admin Email: ")
        password = input("Enter Admin Password: ")
        name = input("Enter Admin Name: ")
        
        
        existing_user = db.query(models.User).filter(models.User.email == email).first()
        if existing_user:
            print("User already exists. Updating role and password...")
            existing_user.role = "admin"
            existing_user.hashed_password = auth.get_password_hash(password)
            db.commit()
            print("Admin credentials updated successfully.")
            return

        
        hashed_password = auth.get_password_hash(password)
        new_admin = models.User(
            email=email,
            name=name,
            hashed_password=hashed_password,
            role="admin",
            phone="0000000000" 
        )
        db.add(new_admin)
        db.commit()
        print(f"Admin user '{email}' created successfully.")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
