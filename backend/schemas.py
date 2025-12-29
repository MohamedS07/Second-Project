from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    has_profile: bool
    profile_type: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None


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
    user_id: int
    photo_path: Optional[str]
    aadhar_photo_path: Optional[str]
    pan_photo_path: Optional[str]
    loan_detail_photo_path: Optional[str]
    loan_detail_photo_path: Optional[str]
    is_approved: bool
    amount_raised: int = 0
    
    access_token: Optional[str] = None
    token_type: Optional[str] = None

    class Config:
        from_attributes = True


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
    
    access_token: Optional[str] = None
    token_type: Optional[str] = None

    class Config:
        from_attributes = True


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
