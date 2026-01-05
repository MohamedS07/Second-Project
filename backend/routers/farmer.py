import base64
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend import database, models, schemas, auth

router = APIRouter()

# Base64 helper
def file_to_base64(file: UploadFile) -> str:
    if not file:
        return None
    file_content = file.file.read()
    base64_encoded = base64.b64encode(file_content).decode('utf-8')
    # Use Content-Type from the uploaded file, default to jpeg if missing
    mime_type = file.content_type if file.content_type else "image/jpeg"
    return f"data:{mime_type};base64,{base64_encoded}"

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
    
    # If applying as Self, check if they already have a profile
    if apply_type != "NGO" and current_user.farmer_profile:
        raise HTTPException(status_code=400, detail="You have already applied as a Farmer.")
    
    
    # Mandatory check (FastAPI handles it but explicit check is good practice)
    if not aadhar_photo or not pan_photo or not loan_detail_photo:
         raise HTTPException(status_code=400, detail="Aadhar, PAN, and Loan documents are mandatory.")

    # Convert to Base64
    photo_b64 = file_to_base64(photo) if photo else None
    aadhar_b64 = file_to_base64(aadhar_photo)
    pan_b64 = file_to_base64(pan_photo)
    loan_b64 = file_to_base64(loan_detail_photo)
    
    # For NGO applications, we don't link the farmer profile to the NGO's user_id
    # This avoids the One-to-One constraint and allows multiple farmers per NGO
    farmer_user_id = current_user.id if apply_type != "NGO" else None

    # Auto-populate NGO name if applying as NGO
    if apply_type == "NGO" and current_user.ngo_profile:
        ngo_name_ref = current_user.ngo_profile.name

    new_farmer = models.Farmer(
        user_id=farmer_user_id,
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
        
        photo_path=photo_b64,
        aadhar_photo_path=aadhar_b64,
        pan_photo_path=pan_b64,
        loan_detail_photo_path=loan_b64
    )
    
    db.add(new_farmer)

    # Only update role if applying for self
    if apply_type != "NGO":
        current_user.role = "farmer"
        db.add(current_user)
        # Create token for self-registered farmer
        access_token = auth.create_access_token(data={"sub": current_user.email})
        new_farmer.access_token = access_token
        new_farmer.token_type = "bearer"

    db.commit()
    db.refresh(new_farmer)
    
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
