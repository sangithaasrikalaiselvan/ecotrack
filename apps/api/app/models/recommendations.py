# app/models/recommendations.py
import uuid
from sqlalchemy import String, text, DateTime, ForeignKey, Text, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from . import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        server_default=text("gen_random_uuid()")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    category: Mapped[str] = mapped_column(String(50), nullable=True)
    action: Mapped[str] = mapped_column(Text, nullable=False)
    estimated_saving_kg: Mapped[float] = mapped_column(Numeric(6, 2), nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    created_at: Mapped[str] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )

    def __repr__(self) -> str:
        return f"<Recommendation user_id={self.user_id} category={self.category}>"
