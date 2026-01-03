from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routers import farmer, donor, ngo, auth, admin, payment
from . import database, models
import os


# database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Uzhavan Connect Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from pathlib import Path

# ... (imports)

# ... (app setup)

# Ensure uploads directory exists relative to backend
# Ensure uploads directory exists relative to backend
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"

try:
    UPLOAD_DIR.mkdir(exist_ok=True)
except OSError:
    # Fallback to /tmp for read-only environments (like Vercel)
    UPLOAD_DIR = Path("/tmp/uploads")
    UPLOAD_DIR.mkdir(exist_ok=True)

app.mount("/static/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(farmer.router, prefix="/api/farmers", tags=["Farmers"])
app.include_router(donor.router, prefix="/api/donors", tags=["Donors"])
app.include_router(ngo.router, prefix="/api/ngos", tags=["NGOs"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(payment.router, prefix="/api/payments", tags=["Payments"])

@app.get("/")
def read_root():
    return {"message": "Uzhavan Connect Backend Running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running and accessible"}
