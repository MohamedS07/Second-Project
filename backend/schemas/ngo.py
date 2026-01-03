from pydantic import BaseModel
from typing import Optional

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
    
    access_token: Optional[str] = None
    token_type: Optional[str] = None

    class Config:
        from_attributes = True
