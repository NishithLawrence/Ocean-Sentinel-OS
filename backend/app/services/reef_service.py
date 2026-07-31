"""Reef management service; AI assessment behavior remains unimplemented."""
from sqlalchemy.orm import Session

from app.models.reef import Reef
from app.repositories import reef_repository
from app.schemas.reef import ReefCreate, ReefUpdate


class ReefNotFoundError(Exception):
    """Raised when a requested reef does not exist."""


def list_reefs(db: Session) -> list[Reef]:
    return reef_repository.list_reefs(db)


def get_reef(db: Session, reef_id: int) -> Reef:
    reef = reef_repository.get_reef_by_id(db, reef_id)
    if reef is None:
        raise ReefNotFoundError
    return reef


def create_reef(db: Session, payload: ReefCreate) -> Reef:
    return reef_repository.create_reef(db, payload.model_dump())


def update_reef(db: Session, reef_id: int, payload: ReefUpdate) -> Reef:
    reef = get_reef(db, reef_id)
    return reef_repository.update_reef(db, reef, payload.model_dump(exclude_unset=True))


def delete_reef(db: Session, reef_id: int) -> None:
    reef_repository.delete_reef(db, get_reef(db, reef_id))
