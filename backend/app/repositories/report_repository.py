"""Database access operations for report metadata only."""
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.mission import Mission
from app.models.report import Report


def list_reports(db: Session) -> list[Report]:
    statement = select(Report).options(joinedload(Report.mission)).order_by(Report.generated_at.desc())
    return list(db.scalars(statement))


def get_report_by_id(db: Session, report_id: int) -> Report | None:
    return db.scalar(select(Report).options(joinedload(Report.mission)).where(Report.id == report_id))


def get_report_by_mission_id(db: Session, mission_id: int) -> Report | None:
    return db.scalar(select(Report).where(Report.mission_id == mission_id))


def get_mission_context(db: Session, mission_id: int) -> Mission | None:
    return db.scalar(select(Mission).options(joinedload(Mission.reef), joinedload(Mission.team)).where(Mission.id == mission_id))


def create_report_metadata(db: Session, mission_id: int, generated_by: int) -> Report:
    report = Report(mission_id=mission_id, generated_by=generated_by, pdf_path='')
    db.add(report)
    db.flush()
    return report


def save_report_metadata(db: Session, report: Report, pdf_path: str, generated_by: int) -> Report:
    report.pdf_path = pdf_path
    report.generated_by = generated_by
    report.generated_at = datetime.now(UTC)
    db.commit()
    db.refresh(report)
    return report


def delete_report_metadata(db: Session, report: Report) -> None:
    db.delete(report)
    db.commit()
