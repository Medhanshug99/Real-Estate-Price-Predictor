from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Real Estate Price Prediction API"
    API_V1_STR: str = "/api/v1"

    # Database
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "real_estate"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/real_estate"

    # JWT Auth
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        # Check project root first, then parent of backend/
        env_file = (".env", "../.env")
        case_sensitive = True

settings = Settings()
