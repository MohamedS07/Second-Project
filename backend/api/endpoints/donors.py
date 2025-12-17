from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core import database
from ... import models, schemas
from .. import deps

router = APIRouter()

@router.post("/", response_model=schemas.Donor)
def create_donor(
    donor: schemas.DonorCreate,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(database.get_db)
):
    existing = db.query(models.Donor).filter(models.Donor.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Donor profile already exists")
    
    new_donor = models.Donor(
        user_id=current_user.id,
        name=donor.name,
        state=donor.state,
        apply_type=donor.apply_type,
        organization_name=donor.organization_name
    )
    
    current_user.role = "Donor" # Update User Role
    db.add(current_user)

    db.add(new_donor)
    db.commit()
    db.refresh(new_donor)
    return new_donor

@router.get("/dashboard", response_model=schemas.Donor)
def get_donor_dashboard(current_user: models.User = Depends(deps.get_current_user), db: Session = Depends(database.get_db)):
    donor = db.query(models.Donor).filter(models.Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor profile not found")
    # Attach name from the User account to the response
    donor.name = current_user.name
    return donor
