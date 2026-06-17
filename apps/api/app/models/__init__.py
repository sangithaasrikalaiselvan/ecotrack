# app/models/__init__.py
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

from .user import User
from .carbon import CarbonRecord
from .achievement import Achievement
from .coach import CoachMessage
from .recommendations import Recommendation
