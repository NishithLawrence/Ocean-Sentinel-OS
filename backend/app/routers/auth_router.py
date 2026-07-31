from fastapi import APIRouter
from app.routers._skeleton import not_implemented
from app.schemas.auth import LoginRequest
router = APIRouter(prefix='/auth', tags=['Authentication'])
@router.post('/login')
def login(_: LoginRequest): not_implemented()
@router.post('/logout')
def logout(): not_implemented()
