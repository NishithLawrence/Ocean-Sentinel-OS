"""JWT-protected, read-only endpoints for generated reef assessment alerts."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.alert import AlertRead
from app.services import alert_service

router = APIRouter(prefix='/alerts', tags=['Alerts'])
DatabaseSession = Annotated[Session, Depends(get_db)]
AuthenticatedUser = Annotated[User, Depends(get_current_user)]


@router.get('', response_model=list[AlertRead])
def list_alerts(db: DatabaseSession, _: AuthenticatedUser):
    return alert_service.list_alerts(db)


@router.get('/{alert_id}', response_model=AlertRead)
def get_alert(alert_id: int, db: DatabaseSession, _: AuthenticatedUser):
    try:
        return alert_service.get_alert(db, alert_id)
    except alert_service.AlertNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Alert not found.') from error
