from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

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
