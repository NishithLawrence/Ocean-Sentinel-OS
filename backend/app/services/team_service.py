"""Team CRUD service; AI-based team recommendation is intentionally excluded."""
from sqlalchemy.orm import Session

from app.models.team import Team
from app.repositories import team_repository
from app.schemas.team import TeamCreate, TeamUpdate


class TeamNotFoundError(Exception):
    """Raised when a requested team does not exist."""


def _values(payload: TeamCreate | TeamUpdate, *, exclude_unset: bool) -> dict[str, object]:
    values = payload.model_dump(exclude_unset=exclude_unset)
    if 'contact_email' in values:
        values['contact_email'] = str(values['contact_email']).lower()
    if 'status' in values:
        values['availability'] = values['status'] == 'Available'
    return values


def list_teams(db: Session) -> list[Team]:
    return team_repository.list_teams(db)


def get_team(db: Session, team_id: int) -> Team:
    team = team_repository.get_team_by_id(db, team_id)
    if team is None:
        raise TeamNotFoundError
    return team


def create_team(db: Session, payload: TeamCreate) -> Team:
    return team_repository.create_team(db, _values(payload, exclude_unset=False))


def update_team(db: Session, team_id: int, payload: TeamUpdate) -> Team:
    return team_repository.update_team(db, get_team(db, team_id), _values(payload, exclude_unset=True))


def delete_team(db: Session, team_id: int) -> None:
    team_repository.delete_team(db, get_team(db, team_id))
