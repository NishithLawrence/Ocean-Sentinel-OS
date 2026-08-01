"""JWT-protected CRUD API for reef records; AI assessment remains a skeleton."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.reef import ReefCreate, ReefRead, ReefUpdate
from app.schemas.risk_assessment import RiskAssessmentRead
from app.services import reef_service, risk_assessment_service

router = APIRouter(prefix='/reefs', tags=['Reefs'])
DatabaseSession = Annotated[Session, Depends(get_db)]
AuthenticatedUser = Annotated[User, Depends(get_current_user)]


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Reef not found.')


@router.get('', response_model=list[ReefRead])
def list_reefs(db: DatabaseSession, _: AuthenticatedUser):
    return reef_service.list_reefs(db)


@router.post('', response_model=ReefRead, status_code=status.HTTP_201_CREATED)
def create_reef(payload: ReefCreate, db: DatabaseSession, _: AuthenticatedUser):
    return reef_service.create_reef(db, payload)


@router.get('/{reef_id}', response_model=ReefRead)
def get_reef(reef_id: int, db: DatabaseSession, _: AuthenticatedUser):
    try:
        return reef_service.get_reef(db, reef_id)
    except reef_service.ReefNotFoundError as error:
        raise _not_found() from error


@router.put('/{reef_id}', response_model=ReefRead)
def update_reef(reef_id: int, payload: ReefUpdate, db: DatabaseSession, _: AuthenticatedUser):
    try:
        return reef_service.update_reef(db, reef_id, payload)
    except reef_service.ReefNotFoundError as error:
        raise _not_found() from error


@router.delete('/{reef_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_reef(reef_id: int, db: DatabaseSession, _: AuthenticatedUser) -> Response:
    try:
        reef_service.delete_reef(db, reef_id)
    except reef_service.ReefNotFoundError as error:
        raise _not_found() from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get('/{reef_id}/assessment', response_model=RiskAssessmentRead)
def get_assessment(reef_id: int, db: DatabaseSession, _: AuthenticatedUser):
    try:
        return risk_assessment_service.create_assessment(db, reef_id)
    except risk_assessment_service.AssessmentReefNotFoundError as error:
        raise _not_found() from error
