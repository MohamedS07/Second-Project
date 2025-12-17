from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...core import database
from ... import models, schemas
from .. import deps
import uuid

router = APIRouter()

@router.post("/", response_model=schemas.Payment)
def create_payment(
    payment: schemas.PaymentCreate,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Verify User is a Donor
    donor = db.query(models.Donor).filter(models.Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(status_code=400, detail="Only registered donors can make payments")

    # Verify Farmer exists
    farmer = db.query(models.Farmer).filter(models.Farmer.id == payment.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    # Create Payment
    transaction_id = str(uuid.uuid4()) # Mock Transaction ID
    
    new_payment = models.Payment(
        donor_id=donor.id,
        farmer_id=payment.farmer_id,
        amount=payment.amount,
        payment_method=payment.payment_method,
        transaction_id=transaction_id,
        status="Success"
    )
    
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment
