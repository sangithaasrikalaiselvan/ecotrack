# app/models/carbon.py
import uuid
from sqlalchemy import Numeric, SmallInteger, text, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from . import Base

class CarbonRecord(Base):
    __tablename__ = "carbon_records"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        server_default=text("gen_random_uuid()")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    transport_kg: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    electricity_kg: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    food_kg: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    waste_kg: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    total_kg: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    green_score: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    record_metadata: Mapped[dict] = mapped_column("metadata", JSONB, nullable=True)
    created_at: Mapped[str] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )

    __table_args__ = (
        Index("ix_carbon_records_user_created_desc", "user_id", created_at.desc()),
    )

    def __repr__(self) -> str:
        return f"<CarbonRecord user_id={self.user_id} total_kg={self.total_kg}>"
