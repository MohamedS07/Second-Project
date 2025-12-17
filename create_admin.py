from backend.core.database import SessionLocal
from backend.models import User
from backend.core.security import get_password_hash
import sys

def create_admin(email, password, name="Admin User"):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} found. Promoting to Admin...")
            user.role = "admin"
            db.commit()
            print("Success! User is now an Admin.")
        else:
            print(f"User {email} not found. Creating new Admin...")
            hashed_password = get_password_hash(password)
            new_user = User(
                email=email,
                hashed_password=hashed_password,
                name=name,
                phone="0000000000",
                role="admin",
                is_active=True
            )
            db.add(new_user)
            db.commit()
            print(f"Success! Admin user {email} created.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <email> <password> [name]")
        # Default for ease of use if run without args
        print("Running with default: admin@uzhavan.com / admin123")
        create_admin("admin@uzhavan.com", "admin123", "Super Admin")
    else:
        create_admin(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "Admin")
