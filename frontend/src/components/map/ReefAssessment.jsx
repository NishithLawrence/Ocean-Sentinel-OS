import { useEffect, useState } from 'react'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'
import EmptyState from '../common/EmptyState.jsx'
import LoadingSpinner from '../common/LoadingSpinner.jsx'
import { reefService } from '../../services/reefService.js'

const badgeFor = (risk) => ({ Critical: 'danger', High: 'warning', Medium: 'info', Low: 'success' }[risk] ?? 'info')

export default function ReefAssessment({ reefId }) {
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadAssessment = async () => {
      setLoading(true)
      try { setAssessment((await reefService.getAssessment(reefId)).data) } catch { setAssessment(null) } finally { setLoading(false) }
    }
    loadAssessment()
  }, [reefId])
  if (loading) return <Card title="Reef assessment"><LoadingSpinner label="Calculating deterministic risk" /></Card>
  if (!assessment) return <Card title="Reef assessment"><EmptyState title="No assessment available" description="An assessment cannot be displayed for this reef right now." /></Card>
  return <Card title="Reef assessment"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-slate-500">Risk score</p><p className="text-3xl font-bold text-ocean-700">{assessment.risk_score}/100</p></div><Badge variant={badgeFor(assessment.overall_risk)}>{assessment.overall_risk} risk</Badge></div><dl className="mt-5 grid gap-4 sm:grid-cols-3">{[['Bleaching risk', assessment.bleaching_risk], ['Pollution risk', assessment.pollution_risk], ['Conservation priority', assessment.conservation_priority]].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1"><Badge variant={badgeFor(value)}>{value}</Badge></dd></div>)}</dl><div className="mt-5"><h3 className="font-semibold">Recommendations</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{assessment.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}</ul></div></Card>
}
