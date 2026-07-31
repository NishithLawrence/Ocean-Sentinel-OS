from fastapi import APIRouter
from app.routers._skeleton import not_implemented
from app.schemas.report import ReportCreate
router = APIRouter(prefix='/reports', tags=['Reports'])
@router.post('')
def generate_report(_: ReportCreate): not_implemented()
@router.get('/{report_id}')
def download_report(report_id: int): not_implemented()
