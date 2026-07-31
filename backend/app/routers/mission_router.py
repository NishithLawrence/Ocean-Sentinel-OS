"""JWT-protected CRUD API for mission records only."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.mission import MissionCreate, MissionRead, MissionUpdate
from app.services import mission_service

router = APIRouter(prefix='/missions', tags=['Missions'])
DatabaseSession = Annotated[Session, Depends(get_db)]
AuthenticatedUser = Annotated[User, Depends(get_current_user)]


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Mission not found.')


@router.get('', response_model=list[MissionRead])
def list_missions(db: DatabaseSession, _: AuthenticatedUser):
    return mission_service.list_missions(db)


@router.post('', response_model=MissionRead, status_code=status.HTTP_201_CREATED)
def create_mission(payload: MissionCreate, db: DatabaseSession, current_user: AuthenticatedUser):
    return mission_service.create_mission(db, payload, current_user.id)


@router.get('/{mission_id}', response_model=MissionRead)
def get_mission(mission_id: int, db: DatabaseSession, _: AuthenticatedUser):
    try:
        return mission_service.get_mission(db, mission_id)
    except mission_service.MissionNotFoundError as error:
        raise _not_found() from error


@router.put('/{mission_id}', response_model=MissionRead)
def update_mission(mission_id: int, payload: MissionUpdate, db: DatabaseSession, _: AuthenticatedUser):
    try:
        return mission_service.update_mission(db, mission_id, payload)
    except mission_service.MissionNotFoundError as error:
        raise _not_found() from error
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(error)) from error


@router.delete('/{mission_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_mission(mission_id: int, db: DatabaseSession, _: AuthenticatedUser) -> Response:
    try:
        mission_service.delete_mission(db, mission_id)
    except mission_service.MissionNotFoundError as error:
        raise _not_found() from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)
