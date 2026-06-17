# app/models/achievement.py
import uuid
from sqlalchemy import String, text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from . import Base

class Achievement(Base):
    __tablename__ = "achievements"

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
    badge_slug: Mapped[str] = mapped_column(String(50), nullable=False)
    earned_at: Mapped[str] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )

    __table_args__ = (
        UniqueConstraint("user_id", "badge_slug", name="uq_user_badge"),
    )

    def __repr__(self) -> str:
        return f"<Achievement user_id={self.user_id} badge={self.badge_slug}>"
