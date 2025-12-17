from pydantic import BaseModel
from datetime import date
from typing import Optional

class FarmerBase(BaseModel):
    name: str
    village: str
    district: str
    address: str
    loan_amount: str
    last_date: date
    bank_account_no: str
    bank_ifsc: str
    apply_type: str
    ngo_name: Optional[str] = None

class FarmerCreate(FarmerBase):
    pass

class Farmer(FarmerBase):
    id: int
    user_id: int
    photo_url: Optional[str] = None
    aadhar_photo_url: Optional[str] = None
    pan_photo_url: Optional[str] = None
    loan_detail_photo_url: Optional[str] = None
    verification_status: str
    is_approved: bool

    class Config:
        from_attributes = True
