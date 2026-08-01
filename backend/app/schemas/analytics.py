"""Read-only response contracts for operational analytics."""
from pydantic import BaseModel


class DashboardAnalytics(BaseModel):
    total_reefs: int
    total_missions: int
    total_teams: int
    active_missions: int
    available_teams: int
    average_coral_health: float


class StatusCount(BaseModel):
    status: str
    count: int


class CoralHealthCount(BaseModel):
    range: str
    count: int


class SpecializationCount(BaseModel):
    specialization: str
    count: int


class CountryCount(BaseModel):
    country: str
    count: int
