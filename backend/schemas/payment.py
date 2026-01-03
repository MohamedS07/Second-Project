from pydantic import BaseModel
from datetime import date

class PaymentCreate(BaseModel):
    farmer_id: int
    amount: int
    payment_method: str

class PaymentResponse(BaseModel):
    id: int
    amount: int
    transaction_date: date
    farmer_id: int
    
    class Config:
        from_attributes = True
