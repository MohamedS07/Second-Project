from pydantic import BaseModel
from typing import Optional

class DonorBase(BaseModel):
    name: str 
    state: str
    apply_type: str
    organization_name: Optional[str] = None

class DonorCreate(DonorBase):
    pass

class Donor(DonorBase):
    id: int
    user_id: int
    name: Optional[str] = None

    class Config:
        from_attributes = True
