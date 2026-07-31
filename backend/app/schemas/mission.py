"""Pydantic contracts for mission management; no AI recommendation fields are exposed."""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class MissionCreate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=5000)
    reef_id: int = Field(gt=0)
    assigned_team: int = Field(gt=0)
    priority: str = Field(min_length=1, max_length=50)
    status: str = Field(min_length=1, max_length=50)
    scheduled_date: date
    completed_date: date | None = None

    @model_validator(mode='after')
    def validate_completion_date(self):
        if self.completed_date is not None and self.completed_date < self.scheduled_date:
            raise ValueError('Completed date cannot be before scheduled date.')
        return self


class MissionUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, min_length=1, max_length=5000)
    reef_id: int | None = Field(default=None, gt=0)
    assigned_team: int | None = Field(default=None, gt=0)
    priority: str | None = Field(default=None, min_length=1, max_length=50)
    status: str | None = Field(default=None, min_length=1, max_length=50)
    scheduled_date: date | None = None
    completed_date: date | None = None

    @model_validator(mode='after')
    def require_update_value(self):
        if not self.model_fields_set:
            raise ValueError('At least one mission field must be supplied.')
        if self.completed_date is not None and self.scheduled_date is not None and self.completed_date < self.scheduled_date:
            raise ValueError('Completed date cannot be before scheduled date.')
        return self


class MissionRead(BaseModel):
    id: int
    title: str
    description: str
    reef_id: int
    assigned_team: int
    priority: str
    status: str
    scheduled_date: date
    completed_date: date | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
