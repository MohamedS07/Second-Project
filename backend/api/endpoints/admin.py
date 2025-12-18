from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core import database
from ... import models, schemas
from .. import deps

router = APIRouter()

def get_current_admin(current_user: models.User = Depends(deps.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/pending/farmers", response_model=list[schemas.Farmer])
def get_pending_farmers(db: Session = Depends(database.get_db), _: models.User = Depends(get_current_admin)):
    return db.query(models.Farmer).filter(models.Farmer.verification_status == "Pending").all()

@router.get("/pending/ngos", response_model=list[schemas.NGO])
def get_pending_ngos(db: Session = Depends(database.get_db), _: models.User = Depends(get_current_admin)):
    return db.query(models.NGO).filter(models.NGO.is_approved == False).all()

@router.post("/approve/farmer/{farmer_id}")
def approve_farmer(farmer_id: int, db: Session = Depends(database.get_db), _: models.User = Depends(get_current_admin)):
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    farmer.verification_status = "Approved"
    farmer.is_approved = True
    db.commit()
    return {"message": "Farmer approved"}

@router.post("/approve/ngo/{ngo_id}")
def approve_ngo(ngo_id: int, db: Session = Depends(database.get_db), _: models.User = Depends(get_current_admin)):
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    ngo.is_approved = True
    db.commit()
    return {"message": "NGO approved"}
