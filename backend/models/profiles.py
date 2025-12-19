from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
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
    phone = Column(String)
    loan_amount = Column(String) # Keeping as string as per HTML form potential input
    last_date = Column(Date)
    bank_account_no = Column(String)
    bank_ifsc = Column(String)
    photo_url = Column(String, nullable=True)
    aadhar_photo_url = Column(String, nullable=True)
    pan_photo_url = Column(String, nullable=True)
    loan_detail_photo_url = Column(String, nullable=True)
    apply_type = Column(String) # Self or NGO
    ngo_name_ref = Column(String, nullable=True) # If applied by NGO
    verification_status = Column(String, default="Pending") # Pending, Approved, Rejected
    is_approved = Column(Boolean, default=False)

    user = relationship("User", backref="farmer_profile")

class Donor(Base):
    __tablename__ = "donors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    state = Column(String)
    email = Column(String)
    phone = Column(String)
    apply_type = Column(String) # Occupation OR Self
    organization_name = Column(String, nullable=True)

    user = relationship("User", backref="donor_profile")

class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    reg_number = Column(String)
    district = Column(String)
    contact_person = Column(String)
    contact_number = Column(String)
    email = Column(String)
    proof_document_url = Column(String, nullable=True)
    is_approved = Column(Boolean, default=False)

    user = relationship("User", backref="ngo_profile")
