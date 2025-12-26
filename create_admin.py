from backend import database, models, auth
from sqlalchemy.orm import Session

def create_admin_user():
    db = database.SessionLocal()
    try:
        email = input("Enter Admin Email: ")
        password = input("Enter Admin Password: ")
        name = input("Enter Admin Name: ")
        
        # Check if user exists
        existing_user = db.query(models.User).filter(models.User.email == email).first()
        if existing_user:
            print("User already exists. Updating role to 'admin'...")
            existing_user.role = "admin"
            db.commit()
            print("User role updated to admin.")
            return

        # Create new admin
        hashed_password = auth.get_password_hash(password)
        new_admin = models.User(
            email=email,
            name=name,
            hashed_password=hashed_password,
            role="admin",
            phone="0000000000" # Dummy phone
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
