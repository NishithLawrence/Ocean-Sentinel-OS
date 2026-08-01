"""Report metadata and deterministic PDF generation service."""
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.report import Report
from app.reports.report_generator import generate_mission_report
from app.repositories import report_repository

REPORT_DIRECTORY = Path(__file__).resolve().parent.parent / 'static' / 'reports'


class ReportNotFoundError(Exception):
    """Raised when a report record is not found."""


class ReportMissionNotFoundError(Exception):
    """Raised when a report is requested for an unknown mission."""


class ReportContextIncompleteError(Exception):
    """Raised when a mission cannot supply the reef and team details a report requires."""


def _report_path(report_id: int) -> Path:
    return REPORT_DIRECTORY / f'report_{report_id}.pdf'


def _read_model(report: Report) -> dict[str, object]:
    return {'id': report.id, 'mission_id': report.mission_id, 'mission_title': report.mission.title, 'generated_at': report.generated_at, 'download_url': f'/api/v1/reports/{report.id}'}


def list_reports(db: Session) -> list[dict[str, object]]:
    return [_read_model(report) for report in report_repository.list_reports(db)]


def generate_report(db: Session, mission_id: int, generated_by: int) -> dict[str, object]:
    mission = report_repository.get_mission_context(db, mission_id)
    if mission is None:
        raise ReportMissionNotFoundError
    if mission.reef is None or mission.team is None:
        raise ReportContextIncompleteError
    report = report_repository.get_report_by_mission_id(db, mission_id)
    if report is None:
        report = report_repository.create_report_metadata(db, mission_id, generated_by)
    output_path = _report_path(report.id)
    try:
        generate_mission_report(output_path, mission)
        report = report_repository.save_report_metadata(db, report, str(output_path), generated_by)
    except Exception:
        db.rollback()
        raise
    return _read_model(report)


def get_report_file(db: Session, report_id: int) -> tuple[Report, Path]:
    report = report_repository.get_report_by_id(db, report_id)
    if report is None:
        raise ReportNotFoundError
    path = Path(report.pdf_path)
    if not path.is_file() or REPORT_DIRECTORY not in path.resolve().parents:
        raise ReportNotFoundError
    return report, path


def delete_report(db: Session, report_id: int) -> None:
    report = report_repository.get_report_by_id(db, report_id)
    if report is None:
        raise ReportNotFoundError
    pdf_path = Path(report.pdf_path)
    report_repository.delete_report_metadata(db, report)
    if pdf_path.is_file() and REPORT_DIRECTORY in pdf_path.resolve().parents:
        pdf_path.unlink()
