from app.models.base import Base
from app.models.user import User
from app.models.property import Property
from app.models.activity import UserActivity

# Expose models for Alembic to detect metadata
__all__ = ["Base", "User", "Property", "UserActivity"]
