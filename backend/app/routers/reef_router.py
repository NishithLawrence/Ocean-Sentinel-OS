from fastapi import APIRouter
from app.routers._skeleton import not_implemented
router = APIRouter(prefix='/reefs', tags=['Reefs'])
@router.get('')
def list_reefs(): not_implemented()
@router.get('/{reef_id}')
def get_reef(reef_id: int): not_implemented()
@router.get('/{reef_id}/assessment')
def get_assessment(reef_id: int): not_implemented()
