from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.jwt import create_access_token
from app.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserRead
from app.services.auth_service import authenticate_user, register_user

router = APIRouter(prefix='/auth', tags=['Authentication'])


@router.post('/register', response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Annotated[Session, Depends(get_db)]):
    try:
        return register_user(db, payload)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Email or employee ID is already registered.') from error


@router.post('/login')
def login(payload: LoginRequest, db: Annotated[Session, Depends(get_db)]) -> TokenResponse:
    user = authenticate_user(db, str(payload.email), payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect email or password.', headers={'WWW-Authenticate': 'Bearer'})
    access_token = create_access_token({'user_id': user.id, 'role': user.role, 'email': user.email})
    return TokenResponse(access_token=access_token, user=UserRead.model_validate(user))


@router.post('/token', response_model=TokenResponse)
def oauth2_login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    """OAuth2 password grant endpoint used by Swagger's Authorize dialog."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect email or password.',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    access_token = create_access_token({'user_id': user.id, 'role': user.role, 'email': user.email})
    return TokenResponse(access_token=access_token, user=UserRead.model_validate(user))


@router.post('/logout')
def logout():
    return None
