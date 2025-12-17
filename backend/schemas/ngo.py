from pydantic import BaseModel
from typing import Optional

class NGOBase(BaseModel):
    ngo_name: str
    reg_number: str
    district: str
    contact_person: str
    contact_number: str

class NGOCreate(NGOBase):
    pass

class NGO(NGOBase):
    id: int
    user_id: int
    proof_document_url: Optional[str] = None
    is_approved: bool

    class Config:
        from_attributes = True
