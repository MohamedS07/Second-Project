from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Donor(Base):
    __tablename__ = "donors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    name = Column(String, index=True)
    state = Column(String)
    phone = Column(String)
    email = Column(String, index=True) 
    apply_type = Column(String)
    organization_name = Column(String, nullable=True)
    
    user = relationship("User", back_populates="donor_profile")
