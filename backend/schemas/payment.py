from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaymentBase(BaseModel):
    farmer_id: int
    amount: float
    payment_method: str

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: int
    donor_id: int
    transaction_id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
