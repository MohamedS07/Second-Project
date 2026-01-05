from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base

class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    name = Column(String, index=True)
    reg_number = Column(String, unique=True, index=True)
    district = Column(String)
    contact_person = Column(String)
    contact_number = Column(String)
    email = Column(String, nullable=True)
    proof_document_path = Column(Text, nullable=True)
    
    is_approved = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="ngo_profile")
