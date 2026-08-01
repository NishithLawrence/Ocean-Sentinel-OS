"""Pydantic contracts for team management; recommendation behavior is excluded."""
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

TeamStatus = Literal['Available', 'On Mission', 'Maintenance', 'Inactive']


class TeamCreate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    team_name: str = Field(min_length=1, max_length=255)
    leader_name: str = Field(min_length=1, max_length=255)
    specialization: str = Field(min_length=1, max_length=255)
    member_count: int = Field(ge=0)
    status: TeamStatus
    contact_email: EmailStr
    contact_phone: str = Field(min_length=5, max_length=30, pattern=r'^[0-9+() -]+$')


class TeamUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    team_name: str | None = Field(default=None, min_length=1, max_length=255)
    leader_name: str | None = Field(default=None, min_length=1, max_length=255)
    specialization: str | None = Field(default=None, min_length=1, max_length=255)
    member_count: int | None = Field(default=None, ge=0)
    status: TeamStatus | None = None
    contact_email: EmailStr | None = None
    contact_phone: str | None = Field(default=None, min_length=5, max_length=30, pattern=r'^[0-9+() -]+$')

    @model_validator(mode='after')
    def require_update_value(self):
        if not self.model_fields_set:
            raise ValueError('At least one team field must be supplied.')
        return self


class TeamRead(BaseModel):
    id: int
    team_name: str
    leader_name: str
    specialization: str
    member_count: int
    status: TeamStatus
    contact_email: EmailStr
    contact_phone: str

    model_config = ConfigDict(from_attributes=True)
