from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String)
    phone = Column(String)
    role = Column(String, default="user") # user, farmer, donor, ngo, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    farmer_profile = relationship("Farmer", back_populates="user", uselist=False)
    donor_profile = relationship("Donor", back_populates="user", uselist=False)
    ngo_profile = relationship("NGO", back_populates="user", uselist=False)
