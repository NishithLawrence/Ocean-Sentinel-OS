"""Persistence operations used by deterministic reef risk assessment."""
from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.reef import Reef


def get_reef(db: Session, reef_id: int) -> Reef | None:
    return db.get(Reef, reef_id)


def create_assessment_alert(db: Session, reef_id: int, severity: str, message: str) -> Alert:
    alert = Alert(reef_id=reef_id, alert_type='REEF_RISK_ASSESSMENT', severity=severity, message=message)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert
