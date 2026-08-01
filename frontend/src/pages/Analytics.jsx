import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AnalyticsChart from '../components/analytics/AnalyticsChart.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import { analyticsService } from '../services/analyticsService.js'

const initialData = { dashboard: null, missionStatus: [], coralHealth: [], teamSpecialization: [], reefsByCountry: [] }
const messageFor = (error) => typeof error.response?.data?.detail === 'string' ? error.response.data.detail : 'Unable to load analytics.'

export default function Analytics() {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [dashboard, missionStatus, coralHealth, teamSpecialization, reefsByCountry] = await Promise.all([
          analyticsService.getDashboard(), analyticsService.getMissionStatus(), analyticsService.getCoralHealth(), analyticsService.getTeamSpecialization(), analyticsService.getReefsByCountry(),
        ])
        setData({ dashboard: dashboard.data, missionStatus: missionStatus.data, coralHealth: coralHealth.data, teamSpecialization: teamSpecialization.data, reefsByCountry: reefsByCountry.data })
      } catch (error) { toast.error(messageFor(error)) } finally { setLoading(false) }
    }
    loadAnalytics()
  }, [])

  if (loading) return <LoadingSpinner label="Loading analytics" />
  if (!data.dashboard) return <EmptyState title="Analytics unavailable" description="Try reloading once the API is available." />
  const empty = data.dashboard.total_reefs === 0 && data.dashboard.total_missions === 0 && data.dashboard.total_teams === 0
  const metrics = [['Total reefs', data.dashboard.total_reefs], ['Total missions', data.dashboard.total_missions], ['Total teams', data.dashboard.total_teams], ['Active missions', data.dashboard.active_missions], ['Available teams', data.dashboard.available_teams], ['Average coral health', `${data.dashboard.average_coral_health}%`]]
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Analytics</h1><p className="mt-1 text-slate-600">Operational marine conservation metrics.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{metrics.map(([label, value]) => <KpiCard key={label} label={label} value={value} />)}</div>{empty && <EmptyState title="No analytics data yet" description="Create reefs, missions, and teams to populate this dashboard." />}<div className="grid gap-6 xl:grid-cols-2"><AnalyticsChart title="Mission status" data={data.missionStatus} labelKey="status" /><AnalyticsChart title="Coral health distribution" data={data.coralHealth} labelKey="range" /><AnalyticsChart title="Team specialization" data={data.teamSpecialization} labelKey="specialization" /><AnalyticsChart title="Reefs by country" data={data.reefsByCountry} labelKey="country" /></div></div>
}
