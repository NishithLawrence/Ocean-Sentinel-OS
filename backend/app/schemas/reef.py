from pydantic import BaseModel, ConfigDict


class ReefRead(BaseModel):
    id: int
    reef_name: str
    country: str
    priority_level: str | None = None
    model_config = ConfigDict(from_attributes=True)
