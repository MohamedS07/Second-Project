from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    has_profile: bool
    profile_type: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: str
    name: str
    phone: str
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Farmer Schemas
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
    pass # Files are handled separately in the router

class FarmerResponse(FarmerBase):
    id: int
    user_id: int
    photo_path: Optional[str]
    aadhar_photo_path: Optional[str]
    pan_photo_path: Optional[str]
    loan_detail_photo_path: Optional[str]
    loan_detail_photo_path: Optional[str]
    is_approved: bool
    amount_raised: int = 0

    class Config:
        from_attributes = True

# Donor Schemas
class DonorBase(BaseModel):
    name: str
    state: str
    phone: str
    email: str
    apply_type: str
    organization_name: Optional[str] = None

class DonorCreate(DonorBase):
    pass

class DonorResponse(DonorBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# NGO Schemas
class NGOBase(BaseModel):
    name: str
    reg_number: str
    district: str
    contact_person: str
    contact_number: str
    email: Optional[str] = None

class NGOCreate(NGOBase):
    pass

class NGOResponse(NGOBase):
    id: int
    user_id: int
    is_approved: bool

    class Config:
        from_attributes = True
    class Config:
        from_attributes = True

# Payment Schemas
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
