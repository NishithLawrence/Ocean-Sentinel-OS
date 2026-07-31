from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Alert(Base):
    __tablename__ = 'alerts'

    id: Mapped[int] = mapped_column(primary_key=True)
    reef_id: Mapped[int] = mapped_column(ForeignKey('reefs.id'), nullable=False)
    alert_type: Mapped[str] = mapped_column(String(100), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    reef: Mapped['Reef'] = relationship(back_populates='alerts')
