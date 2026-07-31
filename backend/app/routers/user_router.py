from typing import Annotated

from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserRead

router = APIRouter(prefix='/users', tags=['Users'])


@router.get('/me')
def read_current_user(current_user: Annotated[User, Depends(get_current_user)]) -> UserRead:
    return UserRead.model_validate(current_user)
