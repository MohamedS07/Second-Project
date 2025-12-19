from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ..core import deps, database
from ..models import Farmer, Donor, NGO, User
from ..schemas import profiles as schemas
import shutil

router = APIRouter()

# Note: In a real app, file uploads should go to a specific dir or cloud.
# We will mock file URLs for simplicity or save simple files.
# Since the HTML forms define file inputs, we should handle them or receive URLs if processed by frontend (but HTML implies standard form submit).
# For this tasks's simplicity/robustness, we might assume JSON bodies first for data, or handle Form data. 
# The HTML forms have `enctype="multipart/form-data"`.
# For simplicty to the USER request "Connect backend", I will create endpoints that accept JSON for data.
# The Frontend JS will need to handle file upload or we just accept text fields if that satisfies the "Connect" requirement without building a full file storage system.
# HOWEVER, the schemas use Pydantic models. Using FastAPI `Form` is better for multipart.
# Let's stick to JSON for the data for now, or use `Form` depends.
# To keep it standard and matching schemas, I'll use JSON. The frontend JS I write will convert form to JSON (skipping actual file binary upload for now unless essential).
# User prompted "Remove backend... I only need backend... for Register Page etc".
# I'll stick to clear JSON endpoints.

@router.post("/farmer", response_model=schemas.Farmer)
def register_farmer(
    profile: schemas.FarmerCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    if current_user.role != "farmer":
        raise HTTPException(status_code=403, detail="Not a farmer account")
    
    # Check if profile exists
    existing = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")

    db_profile = Farmer(**profile.dict(), user_id=current_user.id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.post("/donor", response_model=schemas.Donor)
def register_donor(
    profile: schemas.DonorCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    if current_user.role != "donor":
        raise HTTPException(status_code=403, detail="Not a donor account")

    existing = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")

    db_profile = Donor(**profile.dict(), user_id=current_user.id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.post("/ngo", response_model=schemas.NGO)
def register_ngo(
    profile: schemas.NGOCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    if current_user.role != "ngo":
        raise HTTPException(status_code=403, detail="Not an NGO account")

    existing = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")

    db_profile = NGO(**profile.dict(), user_id=current_user.id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile
