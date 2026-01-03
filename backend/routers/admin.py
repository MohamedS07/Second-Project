from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend import models, schemas, database, auth
from typing import List

router = APIRouter()

def check_admin(user: models.User):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return True

@router.put("/validate/farmer/{farmer_id}")
def approve_farmer(farmer_id: int, approved: bool, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    check_admin(current_user)
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    farmer.is_approved = approved
    db.commit()
    return {"message": f"Farmer {'approved' if approved else 'rejected'}"}

@router.put("/validate/ngo/{ngo_id}")
def approve_ngo(ngo_id: int, approved: bool, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    check_admin(current_user)
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    ngo.is_approved = approved
    db.commit()
    return {"message": f"NGO {'approved' if approved else 'rejected'}"}

@router.get("/stats")
def get_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    check_admin(current_user)
    farmer_count = db.query(models.Farmer).count()
    donor_count = db.query(models.Donor).count()
    ngo_count = db.query(models.NGO).count()
    
    # Calculate people helped (farmers with amount_raised > 0)
    people_helped_count = db.query(models.Farmer).filter(models.Farmer.amount_raised > 0).count()
    
    return {
        "farmers": farmer_count,
        "people_helped": people_helped_count
    }
