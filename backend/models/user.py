from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    hashed_password = Column(String)
    role = Column(String) 
    is_active = Column(Boolean, default=True)

    farmer_profile = relationship("Farmer", back_populates="user", uselist=False)
    donor_profile = relationship("Donor", back_populates="user", uselist=False)
    ngo_profile = relationship("NGO", back_populates="user", uselist=False)
