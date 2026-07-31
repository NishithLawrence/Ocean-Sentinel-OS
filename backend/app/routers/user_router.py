from fastapi import APIRouter
from app.routers._skeleton import not_implemented
router = APIRouter(prefix='/users', tags=['Users'])
@router.get('/me')
def get_current_user(): not_implemented()
