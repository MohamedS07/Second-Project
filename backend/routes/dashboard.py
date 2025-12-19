from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core import deps
from ..models import Farmer, Donor, NGO, User
from ..schemas import profiles as schemas

router = APIRouter()

@router.get("/farmer/me", response_model=schemas.Farmer)
def read_farmer_me(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    profile = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/donor/me", response_model=schemas.Donor)
def read_donor_me(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    profile = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/ngo/me", response_model=schemas.NGO)
def read_ngo_me(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    profile = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
