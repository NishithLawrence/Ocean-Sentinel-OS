from fastapi import APIRouter
from app.routers._skeleton import not_implemented
router = APIRouter(prefix='/teams', tags=['Teams'])
@router.get('')
def list_teams(): not_implemented()
@router.get('/recommend')
def recommend_team(reef_id: int): not_implemented()
