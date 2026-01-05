import base64
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend import models, schemas, database, auth
from typing import Optional, List

router = APIRouter()

# Base64 helper
def file_to_base64(file: UploadFile) -> str:
    if not file:
        return None
    file_content = file.file.read()
    base64_encoded = base64.b64encode(file_content).decode('utf-8')
    mime_type = file.content_type if file.content_type else "image/jpeg"
    return f"data:{mime_type};base64,{base64_encoded}"

@router.post("/register", response_model=schemas.NGOResponse)
def register_ngo(
    name: str = Form(...),
    reg_number: str = Form(...),
    district: str = Form(...),
    contact_person: str = Form(...),
    contact_number: str = Form(...),
    email: Optional[str] = Form(None),
    proof_document: UploadFile = File(None),
    
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.ngo_profile:
        raise HTTPException(status_code=400, detail="You already have an NGO profile")
    
    
    if db.query(models.NGO).filter(models.NGO.reg_number == reg_number).first():
         raise HTTPException(status_code=400, detail="NGO Registration number already exists")

    # proof_path = save_file(proof_document, current_user.id, "ngo_proof") if proof_document else None
    proof_b64 = file_to_base64(proof_document)

    new_ngo = models.NGO(
        user_id=current_user.id,
        name=name,
        reg_number=reg_number,
        district=district,
        contact_person=contact_person,
        contact_number=contact_number,
        email=email,
        proof_document_path=proof_b64
    )
    current_user.role = "ngo"
    db.add(new_ngo)
    db.add(current_user)
    db.commit()
    db.refresh(new_ngo)
    
    access_token = auth.create_access_token(data={"sub": current_user.email})
    new_ngo.access_token = access_token
    new_ngo.token_type = "bearer"
    
    return new_ngo

@router.get("/me", response_model=schemas.NGOResponse)
def get_my_ngo_profile(current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.ngo_profile:
        raise HTTPException(status_code=404, detail="NGO profile not found")
    return current_user.ngo_profile

@router.get("/farmers", response_model=List[schemas.FarmerResponse])
def get_my_farmers(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.ngo_profile:
        raise HTTPException(status_code=403, detail="Not an NGO")
    
    
    ngo_name = current_user.ngo_profile.name
    
    farmers = db.query(models.Farmer).filter(models.Farmer.ngo_name_ref == ngo_name).all()
    return farmers
