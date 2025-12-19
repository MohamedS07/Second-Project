from sqlalchemy import Column, Integer, String, Boolean, Enum
from ..core.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    FARMER = "farmer"
    DONOR = "donor"
    NGO = "ngo"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # Storing role as string for simplicity
    is_active = Column(Boolean, default=True)
