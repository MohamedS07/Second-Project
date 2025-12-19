from pydantic import BaseModel
from typing import Optional
from datetime import date

# Farmer Schema
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

class Farmer(FarmerBase):
    id: int
    user_id: int
    verification_status: str
    is_approved: bool
    photo_url: Optional[str]
    aadhar_photo_url: Optional[str]
    pan_photo_url: Optional[str]
    loan_detail_photo_url: Optional[str]

    class Config:
        from_attributes = True

# Donor Schema
class DonorBase(BaseModel):
    name: str
    state: str
    # email is in User model, but we might collect it here too or map it
    phone: str
    apply_type: str
    organization_name: Optional[str] = None

class DonorCreate(DonorBase):
    pass

class Donor(DonorBase):
    id: int
    user_id: int
    email: Optional[str] # In case we want to reflect it

    class Config:
        from_attributes = True

# NGO Schema
class NGOBase(BaseModel):
    name: str
    reg_number: str
    district: str
    contact_person: str
    contact_number: str
    # email in User
    
class NGOCreate(NGOBase):
    pass

class NGO(NGOBase):
    id: int
    user_id: int
    is_approved: bool
    proof_document_url: Optional[str]

    class Config:
        orm_mode = True
