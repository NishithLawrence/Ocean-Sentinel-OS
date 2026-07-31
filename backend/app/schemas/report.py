from pydantic import BaseModel


class ReportCreate(BaseModel):
    mission_id: int
