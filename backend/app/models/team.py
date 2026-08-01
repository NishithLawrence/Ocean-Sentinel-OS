from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Team(Base):
    __tablename__ = 'teams'

    id: Mapped[int] = mapped_column(primary_key=True)
    team_name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    leader_name: Mapped[str] = mapped_column(String(255), nullable=False)
    specialization: Mapped[str] = mapped_column(String(255), nullable=False)
    member_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(30), nullable=False)
    region: Mapped[str] = mapped_column(String(255), index=True, default='Unassigned', nullable=False)
    availability: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    status: Mapped[str] = mapped_column(String(100), nullable=False)

    missions: Mapped[list['Mission']] = relationship(back_populates='team')
