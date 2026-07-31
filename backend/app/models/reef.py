from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Reef(Base):
    __tablename__ = 'reefs'

    id: Mapped[int] = mapped_column(primary_key=True)
    reef_name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    coral_health: Mapped[float] = mapped_column(Float, nullable=False)
    sea_temperature: Mapped[float] = mapped_column(Float, nullable=False)
    bleaching_alert: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    protected_area: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    ghost_net_distance: Mapped[float | None] = mapped_column(Float, nullable=True)
    ai_priority_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    priority_level: Mapped[str | None] = mapped_column(String(50), index=True, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    missions: Mapped[list['Mission']] = relationship(back_populates='reef')
    alerts: Mapped[list['Alert']] = relationship(back_populates='reef')
