"""JWT-protected, read-only operational analytics endpoints."""
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.routers._skeleton import not_implemented
from app.schemas.analytics import CoralHealthCount, CountryCount, DashboardAnalytics, SpecializationCount, StatusCount
from app.services import analytics_service

router = APIRouter(prefix='/analytics', tags=['Analytics'])
DatabaseSession = Annotated[Session, Depends(get_db)]
AuthenticatedUser = Annotated[User, Depends(get_current_user)]


@router.get('/dashboard', response_model=DashboardAnalytics)
def dashboard_analytics(db: DatabaseSession, _: AuthenticatedUser):
    return analytics_service.dashboard_metrics(db)


@router.get('/mission-status', response_model=list[StatusCount])
def mission_status(db: DatabaseSession, _: AuthenticatedUser):
    return analytics_service.mission_status_counts(db)


@router.get('/coral-health', response_model=list[CoralHealthCount])
def coral_health(db: DatabaseSession, _: AuthenticatedUser):
    return analytics_service.coral_health_distribution(db)


@router.get('/team-specialization', response_model=list[SpecializationCount])
def team_specialization(db: DatabaseSession, _: AuthenticatedUser):
    return analytics_service.team_specialization_counts(db)


@router.get('/reefs-by-country', response_model=list[CountryCount])
def reefs_by_country(db: DatabaseSession, _: AuthenticatedUser):
    return analytics_service.reef_country_counts(db)


@router.get('/missions')
def mission_trends(_: AuthenticatedUser):
    not_implemented()


@router.get('/risks')
def risk_distribution(_: AuthenticatedUser):
    not_implemented()
