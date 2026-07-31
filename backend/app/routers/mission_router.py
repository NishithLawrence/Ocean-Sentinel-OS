from fastapi import APIRouter
from app.routers._skeleton import not_implemented
from app.schemas.mission import MissionCreate
router = APIRouter(prefix='/missions', tags=['Missions'])
@router.post('')
def create_mission(_: MissionCreate): not_implemented()
@router.get('')
def list_missions(): not_implemented()
@router.put('/{mission_id}')
def update_mission(mission_id: int): not_implemented()
@router.delete('/{mission_id}')
def delete_mission(mission_id: int): not_implemented()
