from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

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
    
    
    photo_path = Column(String, nullable=True)
    aadhar_photo_path = Column(String, nullable=True)
    pan_photo_path = Column(String, nullable=True)
    loan_detail_photo_path = Column(String, nullable=True)

    is_approved = Column(Boolean, default=False)
    amount_raised = Column(Integer, default=0) 
    
    user = relationship("User", back_populates="farmer_profile")
    payments = relationship("Payment", back_populates="farmer")

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
    proof_document_path = Column(String, nullable=True)
    
    is_approved = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="ngo_profile")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id"))
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    amount = Column(Integer)
    payment_method = Column(String) 
    transaction_date = Column(Date)

    farmer = relationship("Farmer", back_populates="payments")
    donor = relationship("Donor")
