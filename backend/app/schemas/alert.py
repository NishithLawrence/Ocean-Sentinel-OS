"""Read-only alert response contract."""
from datetime import datetime

from pydantic import BaseModel


class AlertRead(BaseModel):
    id: int
    reef_id: int
    reef_name: str
    alert_type: str
    severity: str
    message: str
    created_at: datetime
