from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas, database, auth
from datetime import date

router = APIRouter()

@router.post("/process", response_model=schemas.PaymentResponse)
def process_payment(payment: schemas.PaymentCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    
    if not current_user.donor_profile:
        raise HTTPException(status_code=403, detail="Only donors can make payments")
    
    donor_id = current_user.donor_profile.id
    
    
    farmer = db.query(models.Farmer).filter(models.Farmer.id == payment.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
        
    
    new_payment = models.Payment(
        donor_id=donor_id,
        farmer_id=payment.farmer_id,
        amount=payment.amount,
        payment_method=payment.payment_method,
        transaction_date=date.today()
    )
    
    
    farmer.amount_raised += payment.amount
    
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    
    return new_payment
