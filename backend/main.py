from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .routes import auth, registration, dashboard

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Uzhavan Connect API")

# CORS
origins = [
    "http://localhost",
    "http://127.0.0.1:5500", # Live Server default
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development ease
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, tags=["Auth"])
app.include_router(registration.router, prefix="/api/register", tags=["Registration"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Uzhavan Connect API"}
