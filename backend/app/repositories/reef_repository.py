"""Database access operations for reef records only."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.reef import Reef


def list_reefs(db: Session) -> list[Reef]:
    return list(db.scalars(select(Reef).order_by(Reef.reef_name)))


def get_reef_by_id(db: Session, reef_id: int) -> Reef | None:
    return db.get(Reef, reef_id)


def create_reef(db: Session, values: dict[str, object]) -> Reef:
    reef = Reef(**values)
    db.add(reef)
    db.commit()
    db.refresh(reef)
    return reef


def update_reef(db: Session, reef: Reef, values: dict[str, object]) -> Reef:
    for field, value in values.items():
        setattr(reef, field, value)
    db.commit()
    db.refresh(reef)
    return reef


def delete_reef(db: Session, reef: Reef) -> None:
    db.delete(reef)
    db.commit()
