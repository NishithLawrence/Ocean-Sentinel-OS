"""JWT-protected report metadata, generation, download, and deletion API."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.report import ReportGenerate, ReportRead
from app.services import report_service

router = APIRouter(prefix='/reports', tags=['Reports'])
DatabaseSession = Annotated[Session, Depends(get_db)]
AuthenticatedUser = Annotated[User, Depends(get_current_user)]


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Report not found.')


@router.get('', response_model=list[ReportRead])
def list_reports(db: DatabaseSession, _: AuthenticatedUser):
    return report_service.list_reports(db)


@router.post('/generate', response_model=ReportRead, status_code=status.HTTP_201_CREATED)
def generate_report(payload: ReportGenerate, db: DatabaseSession, current_user: AuthenticatedUser):
    try:
        return report_service.generate_report(db, payload.mission_id, current_user.id)
    except report_service.ReportMissionNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Mission not found.') from error
    except report_service.ReportContextIncompleteError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail='Mission must reference an existing reef and team to generate a report.') from error


@router.get('/{report_id}', response_class=FileResponse)
def download_report(report_id: int, db: DatabaseSession, _: AuthenticatedUser):
    try:
        report, file_path = report_service.get_report_file(db, report_id)
    except report_service.ReportNotFoundError as error:
        raise _not_found() from error
    return FileResponse(path=file_path, media_type='application/pdf', filename=f'ocean-sentinel-report-{report.id}.pdf')


@router.delete('/{report_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_report(report_id: int, db: DatabaseSession, _: AuthenticatedUser) -> Response:
    try:
        report_service.delete_report(db, report_id)
    except report_service.ReportNotFoundError as error:
        raise _not_found() from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)
