from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from ...core import database, config
from ... import models, schemas
from .. import deps
from typing import Optional
import shutil
import os
from datetime import date

router = APIRouter()

@router.post("/", response_model=schemas.Farmer)
def create_farmer(
    name: str = Form(...),
    village: str = Form(...),
    district: str = Form(...),
    address: str = Form(...),
    phone: str = Form(...), 
    loan_amount: str = Form(...),
    last_date: date = Form(...),
    bank_account_no: str = Form(...),
    bank_ifsc: str = Form(...),
    apply_type: str = Form(...),
    ngo_name: Optional[str] = Form(None),
    
    photo: Optional[UploadFile] = File(None),
    aadhar_photo: UploadFile = File(...),
    pan_photo: UploadFile = File(...),
    loan_detail_photo: UploadFile = File(...),
    
    current_user: models.User = Depends(deps.get_current_user), 
    db: Session = Depends(database.get_db)
):
    # Only check for existing profile if applying as Self (Farmer)
    if apply_type == "Self":
        existing = db.query(models.Farmer).filter(models.Farmer.user_id == current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Farmer profile already exists for this user")

    os.makedirs(config.settings.UPLOAD_DIR, exist_ok=True)

    def save_file(file: UploadFile, prefix: str):
        if not file: return None
        filename = f"{prefix}_{current_user.id}_{file.filename}"
        file_path = os.path.join(config.settings.UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return f"/uploads/{filename}"

    photo_path = save_file(photo, "photo") if photo else None
    aadhar_path = save_file(aadhar_photo, "aadhar")
    pan_path = save_file(pan_photo, "pan")
    loan_path = save_file(loan_detail_photo, "loan")

    new_farmer = models.Farmer(
        user_id=current_user.id,
        name=name,
        village=village,
        district=district,
        address=address,
        loan_amount=loan_amount,
        last_date=last_date,
        bank_account_no=bank_account_no,
        bank_ifsc=bank_ifsc,
        apply_type=apply_type,
        ngo_name=ngo_name,
        photo_url=photo_path,
        aadhar_photo_url=aadhar_path,
        pan_photo_url=pan_path,
        loan_detail_photo_url=loan_path,
        verification_status="Pending",
        is_approved=False
    )
    
    current_user.role = "Farmer" # Update User Role
    db.add(current_user)
    
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)
    return new_farmer

@router.get("/", response_model=list[schemas.Farmer])
def get_farmers(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.Farmer).filter(models.Farmer.is_approved == True).offset(skip).limit(limit).all()

@router.get("/dashboard", response_model=schemas.Farmer)
def get_dashboard(current_user: models.User = Depends(deps.get_current_user), db: Session = Depends(database.get_db)):
    farmer = db.query(models.Farmer).filter(models.Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
    return farmer

@router.get("/{farmer_id}", response_model=schemas.Farmer)
def get_farmer(farmer_id: int, db: Session = Depends(database.get_db)):
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer
