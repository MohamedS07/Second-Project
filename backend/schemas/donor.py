from pydantic import BaseModel
from typing import Optional

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
