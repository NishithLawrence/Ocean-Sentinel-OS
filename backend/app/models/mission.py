from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Mission(Base):
    __tablename__ = 'missions'

    id: Mapped[int] = mapped_column(primary_key=True)
    mission_name: Mapped[str] = mapped_column(String(255), nullable=False)
    reef_id: Mapped[int] = mapped_column(ForeignKey('reefs.id'), nullable=False)
    team_id: Mapped[int] = mapped_column(ForeignKey('teams.id'), nullable=False)
    created_by: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    mission_date: Mapped[date] = mapped_column(Date, index=True, nullable=False)
    completed_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    priority: Mapped[str] = mapped_column(String(50), nullable=False)
    resources: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    reef: Mapped['Reef'] = relationship(back_populates='missions')
    team: Mapped['Team'] = relationship(back_populates='missions')
    creator: Mapped['User'] = relationship(back_populates='missions_created')
    report: Mapped['Report | None'] = relationship(back_populates='mission', uselist=False)

    @property
    def title(self) -> str:
        return self.mission_name

    @property
    def description(self) -> str:
        return self.notes or ''

    @property
    def assigned_team(self) -> int:
        return self.team_id

    @property
    def scheduled_date(self) -> date:
        return self.mission_date
