"""Database access operations for mission records only."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.mission import Mission


def list_missions(db: Session) -> list[Mission]:
    return list(db.scalars(select(Mission).order_by(Mission.mission_date.desc(), Mission.id.desc())))


def get_mission_by_id(db: Session, mission_id: int) -> Mission | None:
    return db.get(Mission, mission_id)


def create_mission(db: Session, values: dict[str, object]) -> Mission:
    mission = Mission(**values)
    db.add(mission)
    db.commit()
    db.refresh(mission)
    return mission


def update_mission(db: Session, mission: Mission, values: dict[str, object]) -> Mission:
    for field, value in values.items():
        setattr(mission, field, value)
    db.commit()
    db.refresh(mission)
    return mission


def delete_mission(db: Session, mission: Mission) -> None:
    db.delete(mission)
    db.commit()
