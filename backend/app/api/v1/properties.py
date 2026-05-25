from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Any
from app.db.database import get_db
from app.schemas.response import StandardResponse

router = APIRouter()

@router.get("/", response_model=StandardResponse)
def read_properties(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve properties.
    """
    return StandardResponse(
        success=True,
        message="Properties retrieved successfully",
        data=[]
    )
