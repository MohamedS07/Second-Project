from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    name = Column(String, index=True)
    village = Column(String)
    district = Column(String)
    address = Column(String)
    phone = Column(String, index=True)
    loan_amount = Column(String)
    last_date = Column(Date)
    bank_account_no = Column(String)
    bank_ifsc = Column(String)
    apply_type = Column(String)
    ngo_name_ref = Column(String, nullable=True)
    
    
    photo_path = Column(Text, nullable=True)
    aadhar_photo_path = Column(Text, nullable=True)
    pan_photo_path = Column(Text, nullable=True)
    loan_detail_photo_path = Column(Text, nullable=True)

    is_approved = Column(Boolean, default=False)
    is_declined = Column(Boolean, default=False)
    amount_raised = Column(Integer, default=0) 
    
    user = relationship("User", back_populates="farmer_profile")
    payments = relationship("Payment", back_populates="farmer")
