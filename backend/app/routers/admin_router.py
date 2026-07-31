from fastapi import APIRouter
from app.routers._skeleton import not_implemented
router = APIRouter(prefix='/admin', tags=['Administration'])
@router.get('/users')
def list_users(): not_implemented()
@router.post('/users')
def create_user(): not_implemented()
@router.put('/users/{user_id}')
def update_user(user_id: int): not_implemented()
@router.delete('/users/{user_id}')
def delete_user(user_id: int): not_implemented()
@router.get('/teams')
def list_teams(): not_implemented()

@router.post('/teams')
def create_team(): not_implemented()

@router.put('/teams')
def update_team(): not_implemented()

@router.delete('/teams')
def delete_team(): not_implemented()

@router.get('/datasets')
def list_datasets(): not_implemented()

@router.post('/datasets')
def create_dataset(): not_implemented()

@router.delete('/datasets')
def delete_dataset(): not_implemented()
