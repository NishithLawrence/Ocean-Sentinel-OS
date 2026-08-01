export function computeRiskScore(averageHealth, alerts = []) {
  const healthFactor = Number.isFinite(averageHealth) ? Math.max(0, 100 - averageHealth) * 0.6 : 30
  const critical = alerts.filter((a) => a.severity === 'Critical').length
  const high = alerts.filter((a) => a.severity === 'High').length
  const alertFactor = critical * 18 + high * 8
  return Math.min(100, Math.round(healthFactor + alertFactor))
}

export function healthStatus(score) {
  if (score >= 75) return 'Stable'
  if (score >= 50) return 'Monitoring'
  return 'Stressed'
}

export function buildHealthChart(coralHealthDistribution = []) {
  if (coralHealthDistribution.length === 0) {
    return [
      { label: '0-20', value: 0 },
      { label: '21-40', value: 0 },
      { label: '41-60', value: 0 },
      { label: '61-80', value: 0 },
      { label: '81-100', value: 0 },
    ]
  }
  return coralHealthDistribution.map((item) => ({ label: item.range, value: item.count }))
}

export function buildRecommendations({ alerts = [], reefs = [], dashboard = null }) {
  const items = []
  const critical = alerts.filter((a) => a.severity === 'Critical')
  const bleaching = reefs.filter((r) => r.bleaching_alert)

  if (critical.length > 0) {
    items.push(`Review ${critical.length} critical alert${critical.length !== 1 ? 's' : ''} and assign response teams immediately.`)
  }
  if (bleaching.length > 0) {
    items.push(`Deploy thermal stress surveys to ${bleaching.length} reef${bleaching.length !== 1 ? 's' : ''} with active bleaching signals.`)
  }
  if (dashboard?.active_missions === 0 && dashboard?.total_missions > 0) {
    items.push('No missions currently in progress — schedule field operations for pending conservation work.')
  }
  if (dashboard?.available_teams > 0 && dashboard?.active_missions > 0) {
    items.push(`${dashboard.available_teams} response team${dashboard.available_teams !== 1 ? 's' : ''} available for deployment.`)
  }
  const lowHealth = reefs.filter((r) => (r.coral_health ?? 100) < 40)
  if (lowHealth.length > 0) {
    items.push(`Prioritize restoration planning for ${lowHealth.length} reef${lowHealth.length !== 1 ? 's' : ''} below 40% health.`)
  }
  if (items.length === 0 && dashboard?.average_coral_health >= 70) {
    items.push('Ocean health indices are stable — maintain routine monitoring cadence across all sectors.')
  }

  return items.slice(0, 4)
}
