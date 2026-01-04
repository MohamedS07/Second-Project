from pydantic import BaseModel
from typing import Optional
from datetime import date

class FarmerBase(BaseModel):
    name: str
    village: str
    district: str
    address: str
    phone: str
    loan_amount: str
    last_date: date
    bank_account_no: str
    bank_ifsc: str
    apply_type: str
    ngo_name_ref: Optional[str] = None

class FarmerCreate(FarmerBase):
    pass 

class FarmerResponse(FarmerBase):
    id: int
    user_id: Optional[int] = None
    photo_path: Optional[str]
    aadhar_photo_path: Optional[str]
    pan_photo_path: Optional[str]
    loan_detail_photo_path: Optional[str]
    is_approved: bool
    amount_raised: int = 0
    
    access_token: Optional[str] = None
    token_type: Optional[str] = None

    class Config:
        from_attributes = True
