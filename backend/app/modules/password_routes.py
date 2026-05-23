from fastapi import APIRouter
from pydantic import BaseModel

from app.utils.password_engine import analyze_password

router = APIRouter(
    prefix="/api/password",
    tags=["Password Intelligence"]
)

class PasswordRequest(BaseModel):
    password: str

@router.post("/analyze")
def password_analysis(request: PasswordRequest):

    result = analyze_password(request.password)

    return result