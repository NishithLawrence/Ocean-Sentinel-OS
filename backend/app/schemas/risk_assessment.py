"""Response contract for deterministic reef risk assessments."""
from pydantic import BaseModel


class RiskAssessmentRead(BaseModel):
    reef_name: str
    overall_risk: str
    risk_score: int
    bleaching_risk: str
    pollution_risk: str
    conservation_priority: str
    recommendations: list[str]
