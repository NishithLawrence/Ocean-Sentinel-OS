"""Mission CRUD service; team recommendations and AI behavior are intentionally excluded."""
from sqlalchemy.orm import Session

from app.models.mission import Mission
from app.repositories import mission_repository
from app.schemas.mission import MissionCreate, MissionUpdate


class MissionNotFoundError(Exception):
    """Raised when a requested mission does not exist."""


def _model_values(payload: MissionCreate | MissionUpdate, *, include_unset: bool) -> dict[str, object]:
    field_map = {'title': 'mission_name', 'description': 'notes', 'assigned_team': 'team_id', 'scheduled_date': 'mission_date'}
    values = payload.model_dump(exclude_unset=include_unset)
    return {field_map.get(field, field): value for field, value in values.items()}


def list_missions(db: Session) -> list[Mission]:
    return mission_repository.list_missions(db)


def get_mission(db: Session, mission_id: int) -> Mission:
    mission = mission_repository.get_mission_by_id(db, mission_id)
    if mission is None:
        raise MissionNotFoundError
    return mission


def create_mission(db: Session, payload: MissionCreate, created_by: int) -> Mission:
    values = _model_values(payload, include_unset=False)
    values['created_by'] = created_by
    return mission_repository.create_mission(db, values)


def update_mission(db: Session, mission_id: int, payload: MissionUpdate) -> Mission:
    mission = get_mission(db, mission_id)
    values = _model_values(payload, include_unset=True)
    scheduled_date = values.get('mission_date', mission.mission_date)
    completed_date = values.get('completed_date', mission.completed_date)
    if completed_date is not None and completed_date < scheduled_date:
        raise ValueError('Completed date cannot be before scheduled date.')
    return mission_repository.update_mission(db, mission, values)


def delete_mission(db: Session, mission_id: int) -> None:
    mission_repository.delete_mission(db, get_mission(db, mission_id))
