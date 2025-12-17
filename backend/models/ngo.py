from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    ngo_name = Column(String)
    reg_number = Column(String)
    district = Column(String)
    contact_person = Column(String)
    contact_number = Column(String)
    proof_document_url = Column(String)
    
    is_approved = Column(Boolean, default=False)

    user = relationship("User", back_populates="ngo_profile")
