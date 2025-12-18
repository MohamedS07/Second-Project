from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id"))
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    
    amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False) 
    transaction_id = Column(String, unique=True, index=True) 
    status = Column(String, default="Success")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    donor = relationship("Donor")
    farmer = relationship("Farmer")
