from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import sys
import traceback

# Ensure backend folder is in path for Vercel imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = FastAPI(title="Uzhavan Connect Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_error = None
setup_traceback = None

try:
    from backend.routers import farmer, donor, ngo, auth, admin, payment
    from backend import database, models
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


    # Mount with /api prefix (for local and explicit paths)
    app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
    app.include_router(farmer.router, prefix="/api/farmers", tags=["Farmers"])
    app.include_router(donor.router, prefix="/api/donors", tags=["Donors"])
    app.include_router(ngo.router, prefix="/api/ngos", tags=["NGOs"])
    app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
    app.include_router(payment.router, prefix="/api/payments", tags=["Payments"])

    # Mount without /api prefix (fallback for Vercel if root_path strips /api)
    app.include_router(auth.router, prefix="/auth", tags=["Auth"])
    app.include_router(farmer.router, prefix="/farmers", tags=["Farmers"])
    app.include_router(donor.router, prefix="/donors", tags=["Donors"])
    app.include_router(ngo.router, prefix="/ngos", tags=["NGOs"])
    app.include_router(admin.router, prefix="/admin", tags=["Admin"])
    app.include_router(payment.router, prefix="/payments", tags=["Payments"])

except Exception as e:
    setup_error = str(e)
    setup_traceback = traceback.format_exc()
    print(f"Setup Error: {setup_error}") # Print to logs as well

@app.get("/")
@app.get("/api/")
def read_root():
    if setup_error:
        return {"status": "error", "message": "Backend failed to start correctly", "detail": setup_error, "traceback": setup_traceback}
    return {"message": "Uzhavan Connect Backend Running"}

@app.get("/api/health")
@app.get("/health")
def health_check():
    if setup_error:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Backend startup failed", "detail": setup_error, "traceback": setup_traceback}
        )
    return {"status": "ok", "message": "Backend is running and accessible"}

@app.get("/api/debug")
def debug_check():
    if setup_error:
        return {"status": "error", "message": "Backend startup failed", "detail": setup_error}
    return {"status": "debug", "message": "Debug works"}
