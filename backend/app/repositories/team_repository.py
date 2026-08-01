"""Database access operations for team records only."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.team import Team


def list_teams(db: Session) -> list[Team]:
    return list(db.scalars(select(Team).order_by(Team.team_name)))


def get_team_by_id(db: Session, team_id: int) -> Team | None:
    return db.get(Team, team_id)


def create_team(db: Session, values: dict[str, object]) -> Team:
    team = Team(**values)
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


def update_team(db: Session, team: Team, values: dict[str, object]) -> Team:
    for field, value in values.items():
        setattr(team, field, value)
    db.commit()
    db.refresh(team)
    return team


def delete_team(db: Session, team: Team) -> None:
    db.delete(team)
    db.commit()
