# app/models/user.py
import uuid
from sqlalchemy import String, Boolean, text, DateTime, CHAR
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from . import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    country_code: Mapped[str] = mapped_column(CHAR(2), server_default='IN')
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default=text("true"))
    created_at: Mapped[str] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: __import__('datetime').datetime.now(__import__('datetime').timezone.utc),
        server_default=text("now()")
    )
    updated_at: Mapped[str] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: __import__('datetime').datetime.now(__import__('datetime').timezone.utc),
        onupdate=lambda: __import__('datetime').datetime.now(__import__('datetime').timezone.utc),
        server_default=text("now()")
    )

    def __repr__(self) -> str:
        return f"<User {self.email}>"
