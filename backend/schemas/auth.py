from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    has_profile: bool
    profile_type: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None
