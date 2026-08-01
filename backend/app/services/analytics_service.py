"""Read-only analytics service; no predictions or AI calculations are performed."""
from sqlalchemy.orm import Session

from app.repositories import analytics_repository


def dashboard_metrics(db: Session):
    return analytics_repository.dashboard_metrics(db)


def mission_status_counts(db: Session):
    return analytics_repository.mission_status_counts(db)


def coral_health_distribution(db: Session):
    return analytics_repository.coral_health_distribution(db)


def team_specialization_counts(db: Session):
    return analytics_repository.team_specialization_counts(db)


def reef_country_counts(db: Session):
    return analytics_repository.reef_country_counts(db)
