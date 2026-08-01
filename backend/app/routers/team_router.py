"""JWT-protected CRUD API for team records; recommendations remain unimplemented."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.routers._skeleton import not_implemented
from app.schemas.team import TeamCreate, TeamRead, TeamUpdate
from app.services import team_service

router = APIRouter(prefix='/teams', tags=['Teams'])
DatabaseSession = Annotated[Session, Depends(get_db)]
AuthenticatedUser = Annotated[User, Depends(get_current_user)]


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Team not found.')


@router.get('', response_model=list[TeamRead])
def list_teams(db: DatabaseSession, _: AuthenticatedUser):
    return team_service.list_teams(db)


@router.post('', response_model=TeamRead, status_code=status.HTTP_201_CREATED)
def create_team(payload: TeamCreate, db: DatabaseSession, _: AuthenticatedUser):
    try:
        return team_service.create_team(db, payload)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Team name is already registered.') from error


@router.get('/recommend')
def recommend_team(reef_id: int, _: AuthenticatedUser):
    not_implemented()


@router.get('/{team_id}', response_model=TeamRead)
def get_team(team_id: int, db: DatabaseSession, _: AuthenticatedUser):
    try:
        return team_service.get_team(db, team_id)
    except team_service.TeamNotFoundError as error:
        raise _not_found() from error


@router.put('/{team_id}', response_model=TeamRead)
def update_team(team_id: int, payload: TeamUpdate, db: DatabaseSession, _: AuthenticatedUser):
    try:
        return team_service.update_team(db, team_id, payload)
    except team_service.TeamNotFoundError as error:
        raise _not_found() from error
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Team name is already registered.') from error


@router.delete('/{team_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: int, db: DatabaseSession, _: AuthenticatedUser) -> Response:
    try:
        team_service.delete_team(db, team_id)
    except team_service.TeamNotFoundError as error:
        raise _not_found() from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)
