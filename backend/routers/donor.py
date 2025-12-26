from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth

router = APIRouter()

@router.post("/register", response_model=schemas.DonorResponse)
def register_donor(donor: schemas.DonorCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.donor_profile:
        raise HTTPException(status_code=400, detail="You already have a Donor profile")
    
    new_donor = models.Donor(
        user_id=current_user.id,
        **donor.dict()
    )
    current_user.role = "donor"
    db.add(new_donor)
    db.add(current_user)
    db.commit()
    db.refresh(new_donor)
    return new_donor

@router.get("/me", response_model=schemas.DonorResponse)
def get_my_donor_profile(current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.donor_profile:
        raise HTTPException(status_code=404, detail="Donor profile not found")
    return current_user.donor_profile
