from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routers import farmer, donor, ngo, auth, admin, payment
from . import database, models
import os

# Create Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Uzhavan Connect Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files for Uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(farmer.router, prefix="/api/farmers", tags=["Farmers"])
app.include_router(donor.router, prefix="/api/donors", tags=["Donors"])
app.include_router(ngo.router, prefix="/api/ngos", tags=["NGOs"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(payment.router, prefix="/api/payments", tags=["Payments"])

@app.get("/")
def read_root():
    return {"message": "Uzhavan Connect Backend Running"}
