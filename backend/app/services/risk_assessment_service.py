"""Service that evaluates deterministic reef risk and records its alert."""
from sqlalchemy.orm import Session

from app.ai.risk_engine import assess_reef
from app.repositories import risk_assessment_repository


class AssessmentReefNotFoundError(Exception):
    """Raised when an assessment is requested for an unknown reef."""


def create_assessment(db: Session, reef_id: int) -> dict[str, object]:
    reef = risk_assessment_repository.get_reef(db, reef_id)
    if reef is None:
        raise AssessmentReefNotFoundError
    assessment = assess_reef(reef)
    message = (
        f"Risk score {assessment['risk_score']}/100 ({assessment['overall_risk']}) for {assessment['reef_name']}. "
        f"Bleaching risk: {assessment['bleaching_risk']}; pollution risk: {assessment['pollution_risk']}; "
        f"conservation priority: {assessment['conservation_priority']}. "
        f"Recommendations: {' '.join(assessment['recommendations'])}"
    )
    risk_assessment_repository.create_assessment_alert(db, reef.id, assessment['overall_risk'], message)
    return assessment
