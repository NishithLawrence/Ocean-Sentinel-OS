"""Pydantic contracts for reef management; AI assessment fields are intentionally excluded."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ReefCreate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    reef_name: str = Field(min_length=1, max_length=255)
    country: str = Field(min_length=1, max_length=100)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    coral_health: float = Field(ge=0, le=100)
    sea_temperature: float = Field(gt=0)
    bleaching_alert: bool = False
    protected_area: bool = False
    ghost_net_distance: float | None = Field(default=None, ge=0)


class ReefUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    reef_name: str | None = Field(default=None, min_length=1, max_length=255)
    country: str | None = Field(default=None, min_length=1, max_length=100)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    coral_health: float | None = Field(default=None, ge=0, le=100)
    sea_temperature: float | None = Field(default=None, gt=0)
    bleaching_alert: bool | None = None
    protected_area: bool | None = None
    ghost_net_distance: float | None = Field(default=None, ge=0)

    @model_validator(mode='after')
    def require_update_value(self):
        if not self.model_fields_set:
            raise ValueError('At least one reef field must be supplied.')
        return self


class ReefRead(BaseModel):
    id: int
    reef_name: str
    country: str
    latitude: float
    longitude: float
    coral_health: float
    sea_temperature: float
    bleaching_alert: bool
    protected_area: bool
    ghost_net_distance: float | None
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
