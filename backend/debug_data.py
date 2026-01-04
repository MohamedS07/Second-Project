import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import database, models
from sqlalchemy.orm import Session

db = database.SessionLocal()

try:
    print("--- NGOs ---")
    ngos = db.query(models.NGO).all()
    for ngo in ngos:
        print(f"NGO ID: {ngo.id}, Name: '{ngo.name}', User ID: {ngo.user_id}")

    print("\n--- Farmers ---")
    farmers = db.query(models.Farmer).all()
    for farmer in farmers:
        print(f"Farmer ID: {farmer.id}, Name: '{farmer.name}', NGO Ref: '{farmer.ngo_name_ref}', User ID: {farmer.user_id}")

finally:
    db.close()
