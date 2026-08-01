"""Request and response contracts for generated PDF reports."""
from datetime import datetime

from pydantic import BaseModel, Field


class ReportGenerate(BaseModel):
    mission_id: int = Field(gt=0)


class ReportRead(BaseModel):
    id: int
    mission_id: int
    mission_title: str
    generated_at: datetime
    download_url: str
