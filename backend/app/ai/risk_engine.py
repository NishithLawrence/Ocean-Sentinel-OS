"""Deterministic, explainable reef-risk rules with no external AI dependencies."""


def _risk_level(score: int) -> str:
    if score >= 70:
        return 'Critical'
    if score >= 50:
        return 'High'
    if score >= 25:
        return 'Medium'
    return 'Low'


def assess_reef(reef) -> dict[str, object]:
    """Assess recorded reef conditions using fixed, explainable thresholds."""
    risk_score = 0
    bleaching_score = 0
    recommendations: list[str] = []

    if reef.coral_health <= 25:
        risk_score += 35
        bleaching_score += 35
        recommendations.append('Prioritize an on-site coral health inspection and restoration planning.')
    elif reef.coral_health <= 50:
        risk_score += 25
        bleaching_score += 20
        recommendations.append('Increase coral health monitoring and schedule a conservation review.')
    elif reef.coral_health <= 75:
        risk_score += 10
        bleaching_score += 5

    if reef.sea_temperature >= 32:
        risk_score += 30
        bleaching_score += 40
        recommendations.append('Issue an urgent thermal-stress monitoring alert.')
    elif reef.sea_temperature >= 30:
        risk_score += 20
        bleaching_score += 25
        recommendations.append('Monitor sea temperature closely for bleaching conditions.')
    elif reef.sea_temperature >= 28:
        risk_score += 10
        bleaching_score += 10

    if reef.bleaching_alert:
        risk_score += 25
        bleaching_score += 25
        recommendations.append('Validate the bleaching alert with a field assessment.')

    pollution_score = 0
    if reef.ghost_net_distance is not None:
        if reef.ghost_net_distance <= 1:
            risk_score += 25
            pollution_score = 90
            recommendations.append('Deploy a ghost-net removal mission immediately.')
        elif reef.ghost_net_distance <= 5:
            risk_score += 15
            pollution_score = 65
            recommendations.append('Plan a nearby ghost-net inspection and cleanup mission.')
        elif reef.ghost_net_distance <= 10:
            risk_score += 5
            pollution_score = 35
            recommendations.append('Monitor the reported ghost-net location.')

    risk_score = min(risk_score, 100)
    bleaching_score = min(bleaching_score, 100)
    if not recommendations:
        recommendations.append('Continue routine reef monitoring and scheduled condition surveys.')
    return {
        'reef_name': reef.reef_name,
        'overall_risk': _risk_level(risk_score),
        'risk_score': risk_score,
        'bleaching_risk': _risk_level(bleaching_score),
        'pollution_risk': _risk_level(pollution_score),
        'conservation_priority': _risk_level(risk_score),
        'recommendations': recommendations,
    }
