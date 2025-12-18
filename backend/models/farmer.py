from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from ..core.database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    name = Column(String)
    village = Column(String)
    district = Column(String)
    address = Column(String)
    loan_amount = Column(String)
    last_date = Column(Date)
    bank_account_no = Column(String)
    bank_ifsc = Column(String)
    
    
    photo_url = Column(String)
    aadhar_photo_url = Column(String)
    pan_photo_url = Column(String)
    loan_detail_photo_url = Column(String)
    
    apply_type = Column(String) 
    ngo_name = Column(String, nullable=True) 
    
    is_approved = Column(Boolean, default=False)
    verification_status = Column(String, default="Pending") 

    user = relationship("User", back_populates="farmer_profile")
