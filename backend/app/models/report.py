from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Report(Base):
    __tablename__ = 'reports'

    id: Mapped[int] = mapped_column(primary_key=True)
    mission_id: Mapped[int] = mapped_column(ForeignKey('missions.id'), unique=True, nullable=False)
    generated_by: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    pdf_path: Mapped[str] = mapped_column(String(500), nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    mission: Mapped['Mission'] = relationship(back_populates='report')
    generator: Mapped['User'] = relationship(back_populates='reports_generated')
