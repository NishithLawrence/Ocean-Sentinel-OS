from datetime import date
from pydantic import BaseModel, ConfigDict


class MissionCreate(BaseModel):
    name: str
    reef_id: int
    team_id: int
    mission_date: date
    resources: str | None = None
    notes: str | None = None


class MissionRead(BaseModel):
    id: int
    mission_name: str
    status: str
    model_config = ConfigDict(from_attributes=True)
