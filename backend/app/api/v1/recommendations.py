from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Any, Optional
from app.schemas.response import StandardResponse
from app.schemas.property import PropertyOut
from app.db.database import get_db
from app.services import recommendation_service

router = APIRouter()

@router.get("/", response_model=StandardResponse)
def get_recommendations(
    location: Optional[str] = None,
    budget: Optional[float] = None,
    property_type: Optional[str] = None,
    limit: int = 5,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get property recommendations based on budget, location, and type.
    """
    try:
        results = recommendation_service.get_recommendations(
            db=db, location=location, budget=budget, property_type=property_type, limit=limit
        )
        data = [PropertyOut.model_validate(p).model_dump() for p in results]
        
        return StandardResponse(
            success=True,
            message="Recommendations retrieved successfully",
            data=data
        )
    except Exception as e:
        return StandardResponse(
            success=False,
            message="Failed to get recommendations",
            errors=[str(e)]
        )
