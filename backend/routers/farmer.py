import shutil
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend import models, schemas, database, auth

router = APIRouter()

UPLOAD_DIR = "uploads"
try:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
except OSError:
    
    UPLOAD_DIR = "/tmp/uploads"
    os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_file(file: UploadFile, user_id: int, file_type: str):
    if not file:
        return None
    
    filename = f"{user_id}_{file_type}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return file_path

@router.post("/apply", response_model=schemas.FarmerResponse)
def apply_as_farmer(
    name: str = Form(...),
    village: str = Form(...),
    district: str = Form(...),
    address: str = Form(...),
    phone: str = Form(...),
    loan_amount: str = Form(...),
    last_date: str = Form(...), 
    bank_account_no: str = Form(...),
    bank_ifsc: str = Form(...),
    apply_type: str = Form(...),
    ngo_name_ref: Optional[str] = Form(None),
    
    photo: UploadFile = File(None),
    aadhar_photo: UploadFile = File(...),
    pan_photo: UploadFile = File(...),
    loan_detail_photo: UploadFile = File(...),
    
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    
    if current_user.farmer_profile:
        raise HTTPException(status_code=400, detail="You have already applied as a Farmer.")
    
    
    photo_path = save_file(photo, current_user.id, "photo") if photo else None
    aadhar_path = save_file(aadhar_photo, current_user.id, "aadhar")
    pan_path = save_file(pan_photo, current_user.id, "pan")
    loan_path = save_file(loan_detail_photo, current_user.id, "loan")
    
    new_farmer = models.Farmer(
        user_id=current_user.id,
        name=name,
        village=village,
        district=district,
        address=address,
        phone=phone,
        loan_amount=loan_amount,
        last_date=last_date, 
        bank_account_no=bank_account_no,
        bank_ifsc=bank_ifsc,
        apply_type=apply_type,
        ngo_name_ref=ngo_name_ref,
        
        photo_path=photo_path,
        aadhar_photo_path=aadhar_path,
        pan_photo_path=pan_path,
        loan_detail_photo_path=loan_path
    )
    
    current_user.role = "farmer"
    db.add(new_farmer)
    db.add(current_user)
    db.commit()
    db.refresh(new_farmer)
    
    
    access_token = auth.create_access_token(data={"sub": current_user.email})
    new_farmer.access_token = access_token
    new_farmer.token_type = "bearer"
    
    return new_farmer

@router.get("/list", response_model=List[schemas.FarmerResponse])
def get_farmers(skip: int = 0, limit: int = 100, approved_only: bool = False, db: Session = Depends(database.get_db)):
    query = db.query(models.Farmer)
    
    if approved_only:
        query = query.filter(models.Farmer.is_approved == True)
        
    
    farmers = query.order_by(models.Farmer.last_date.asc()).offset(skip).limit(limit).all()
    return farmers

@router.get("/me", response_model=schemas.FarmerResponse)
def get_my_farmer_profile(current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.farmer_profile:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
    return current_user.farmer_profile

@router.delete("/{farmer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_farmer(farmer_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    
    
    farmer_to_delete = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer_to_delete:
        raise HTTPException(status_code=404, detail="Farmer not found")
        
    if current_user.role != "admin" and farmer_to_delete.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this profile")
        
    db.delete(farmer_to_delete)
    db.commit()
    return None

@router.get("/{farmer_id}", response_model=schemas.FarmerResponse)
def get_farmer_by_id(farmer_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer

@router.put("/{farmer_id}/approve", response_model=schemas.FarmerResponse)
def approve_farmer(farmer_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    farmer.is_approved = True
    db.commit()
    db.refresh(farmer)
    return farmer
