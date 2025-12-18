from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from ...core import database, config
from ... import models, schemas
from .. import deps
import shutil
import os

router = APIRouter()

@router.post("/", response_model=schemas.NGO)
def create_ngo(
    ngo_name: str = Form(...),
    reg_number: str = Form(...),
    district: str = Form(...),
    contact_person: str = Form(...),
    contact_number: str = Form(...),
    proof_document: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(database.get_db)
):
    existing = db.query(models.NGO).filter(models.NGO.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="NGO profile already exists")

    os.makedirs(config.settings.UPLOAD_DIR, exist_ok=True)
    
    filename = f"ngo_proof_{current_user.id}_{proof_document.filename}"
    file_path = os.path.join(config.settings.UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(proof_document.file, buffer)
    
    proof_url = f"/uploads/{filename}"

    new_ngo = models.NGO(
        user_id=current_user.id,
        ngo_name=ngo_name,
        reg_number=reg_number,
        district=district,
        contact_person=contact_person,
        contact_number=contact_number,
        proof_document_url=proof_url,
        is_approved=False
    )
    
    current_user.role = "NGO" 
    db.add(current_user)
    
    db.add(new_ngo)
    db.commit()
    db.refresh(new_ngo)
    return new_ngo

@router.get("/dashboard", response_model=schemas.NGO)
def get_dashboard(current_user: models.User = Depends(deps.get_current_user), db: Session = Depends(database.get_db)):
    ngo = db.query(models.NGO).filter(models.NGO.user_id == current_user.id).first()
    if not ngo:
         raise HTTPException(status_code=404, detail="NGO profile not found")
    return ngo
