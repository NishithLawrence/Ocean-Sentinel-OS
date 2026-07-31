from pydantic import BaseModel, ConfigDict


class TeamRead(BaseModel):
    id: int
    team_name: str
    region: str
    availability: bool
    model_config = ConfigDict(from_attributes=True)
