from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.user import User

from app.modules.auth_routes import router as auth_router
from app.modules.password_routes import router as password_router
from app.modules.vulnerability_routes import router as vulnerability_router
from app.modules.phishing_routes import router as phishing_router

from app.utils.auth_middleware import verify_token, admin_only


# Create database tables
Base.metadata.create_all(bind=engine)


# FastAPI app
app = FastAPI(
    title="SentinelForge",
    description="AI-Powered Cybersecurity & Threat Analysis Platform",
    version="1.0.0"
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(auth_router)
app.include_router(password_router)
app.include_router(vulnerability_router)
app.include_router(phishing_router)


# Home Route
@app.get("/")
def home():
    return {
        "project": "SentinelForge",
        "status": "Running",
        "modules": [
            "Secure Authentication",
            "Password Intelligence",
            "Vulnerability Scanner",
            "AI Phishing Detection"
        ]
    }


# Protected Dashboard Route
@app.get("/api/dashboard")
def protected_dashboard(payload: dict = Depends(verify_token)):
    return {
        "message": "Protected Dashboard Access Granted",
        "user": payload
    }


# Admin Route
@app.get("/api/admin")
def admin_dashboard(payload: dict = Depends(admin_only)):
    return {
        "message": "Welcome Admin",
        "admin_data": payload
    }