from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .api.endpoints import auth, farmers, donors, ngos, admin, payments
from .core.config import settings
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(farmers.router, prefix="/farmers", tags=["Farmers"])
app.include_router(donors.router, prefix="/donors", tags=["Donors"])
app.include_router(ngos.router, prefix="/ngos", tags=["NGOs"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])

frontend_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def mount_static(url, path, name):
    full_path = os.path.join(frontend_path, path)
    if os.path.exists(full_path):
        app.mount(url, StaticFiles(directory=full_path), name=name)
    else:
        print(f"Warning: Static directory not found: {full_path}")

mount_static("/styles", "styles", "styles")
mount_static("/js", "js", "js")
mount_static("/pages", "pages", "pages")
mount_static("/assests", "assests", "assests")

if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
else:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

from fastapi.responses import FileResponse
@app.get("/")
async def read_index():
    index_path = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Backend API is running. Frontend index.html not found."}

@app.get("/index.html")
async def read_index_explicit():
    index_path = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "index.html not found"}

@app.get("/style.css")
async def read_style_css():
    style_path = os.path.join(frontend_path, "style.css")
    if os.path.exists(style_path):
        return FileResponse(style_path)
    return {"message": "style.css not found"}
