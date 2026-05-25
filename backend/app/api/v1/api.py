from fastapi import APIRouter
from app.api.v1 import auth, properties, predict, recommendations

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(predict.router, prefix="/predict", tags=["predict"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
