"""Read-only database access for stored assessment alerts."""
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.alert import Alert


def list_alerts(db: Session) -> list[Alert]:
    return list(db.scalars(select(Alert).options(joinedload(Alert.reef)).order_by(Alert.created_at.desc())))


def get_alert_by_id(db: Session, alert_id: int) -> Alert | None:
    return db.scalar(select(Alert).options(joinedload(Alert.reef)).where(Alert.id == alert_id))
