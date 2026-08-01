"""Read-only service for generated reef assessment alerts."""
from sqlalchemy.orm import Session

from app.repositories import alert_repository


class AlertNotFoundError(Exception):
    """Raised when an alert is not found."""


def _read_model(alert) -> dict[str, object]:
    return {'id': alert.id, 'reef_id': alert.reef_id, 'reef_name': alert.reef.reef_name, 'alert_type': alert.alert_type, 'severity': alert.severity, 'message': alert.message, 'created_at': alert.created_at}


def list_alerts(db: Session) -> list[dict[str, object]]:
    return [_read_model(alert) for alert in alert_repository.list_alerts(db)]


def get_alert(db: Session, alert_id: int) -> dict[str, object]:
    alert = alert_repository.get_alert_by_id(db, alert_id)
    if alert is None:
        raise AlertNotFoundError
    return _read_model(alert)
