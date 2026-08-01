"""Read-only SQLAlchemy aggregation queries for the analytics dashboard."""
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.models.mission import Mission
from app.models.reef import Reef
from app.models.team import Team


def dashboard_metrics(db: Session) -> dict[str, int | float]:
    total_reefs = db.scalar(select(func.count(Reef.id))) or 0
    total_missions = db.scalar(select(func.count(Mission.id))) or 0
    total_teams = db.scalar(select(func.count(Team.id))) or 0
    active_missions = db.scalar(select(func.count(Mission.id)).where(func.lower(Mission.status).in_(['planned', 'in progress', 'in_progress']))) or 0
    available_teams = db.scalar(select(func.count(Team.id)).where(func.lower(Team.status).in_(['available', 'active']))) or 0
    average_coral_health = db.scalar(select(func.avg(Reef.coral_health))) or 0.0
    return {'total_reefs': total_reefs, 'total_missions': total_missions, 'total_teams': total_teams, 'active_missions': active_missions, 'available_teams': available_teams, 'average_coral_health': round(float(average_coral_health), 2)}


def mission_status_counts(db: Session) -> list[dict[str, int | str]]:
    rows = db.execute(select(Mission.status, func.count(Mission.id)).group_by(Mission.status).order_by(Mission.status)).all()
    return [{'status': status, 'count': count} for status, count in rows]


def coral_health_distribution(db: Session) -> list[dict[str, int | str]]:
    health_range = case(
        (Reef.coral_health <= 25, '0-25'),
        (Reef.coral_health <= 50, '26-50'),
        (Reef.coral_health <= 75, '51-75'),
        else_='76-100',
    )
    rows = db.execute(select(health_range.label('range'), func.count(Reef.id)).group_by(health_range).order_by(health_range)).all()
    counts = {range_name: count for range_name, count in rows}
    return [{'range': range_name, 'count': counts.get(range_name, 0)} for range_name in ['0-25', '26-50', '51-75', '76-100']]


def team_specialization_counts(db: Session) -> list[dict[str, int | str]]:
    rows = db.execute(select(Team.specialization, func.count(Team.id)).group_by(Team.specialization).order_by(Team.specialization)).all()
    return [{'specialization': specialization, 'count': count} for specialization, count in rows]


def reef_country_counts(db: Session) -> list[dict[str, int | str]]:
    rows = db.execute(select(Reef.country, func.count(Reef.id)).group_by(Reef.country).order_by(Reef.country)).all()
    return [{'country': country, 'count': count} for country, count in rows]
