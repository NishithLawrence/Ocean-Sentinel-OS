"""FastAPI bearer-token dependency for protected endpoints."""
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.auth.jwt import decode_access_token
from app.database import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/v1/auth/token')
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail='Authentication required.',
    headers={'WWW-Authenticate': 'Bearer'},
)


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    try:
        payload = decode_access_token(token)
        user_id = payload.get('user_id')
        if not isinstance(user_id, int):
            raise credentials_exception
    except ValueError as error:
        raise credentials_exception from error

    user = db.get(User, user_id)
    if user is None:
        raise credentials_exception
    return user
