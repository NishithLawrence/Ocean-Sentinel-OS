import { useEffect, useMemo, useState } from 'react'
import { Bot, Radar, Ship, Users, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import MarineMap from '../components/map/MarineMap.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import DashboardHero from '../components/dashboard/DashboardHero.jsx'
import OceanHealthIndex from '../components/dashboard/OceanHealthIndex.jsx'
import AiRiskAssessment from '../components/dashboard/AiRiskAssessment.jsx'
import LiveReefMonitoring from '../components/dashboard/LiveReefMonitoring.jsx'
import RecentAlerts from '../components/dashboard/RecentAlerts.jsx'
import ActiveMissions from '../components/dashboard/ActiveMissions.jsx'
import MissionTimeline from '../components/dashboard/MissionTimeline.jsx'
import AiRecommendations from '../components/dashboard/AiRecommendations.jsx'
import QuickActions from '../components/dashboard/QuickActions.jsx'
import MissionStatusChart from '../components/dashboard/MissionStatusChart.jsx'
import {
  buildHealthChart,
  buildRecommendations,
  computeRiskScore,
  healthStatus,
} from '../components/dashboard/dashboardUtils.js'
import { analyticsService } from '../services/analyticsService.js'
import { alertService } from '../services/alertService.js'
import { missionService } from '../services/missionService.js'
import { reefService } from '../services/reefService.js'
import { useAuth } from '../hooks/useAuth.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [missions, setMissions] = useState([])
  const [reefs, setReefs] = useState([])
  const [missionStatus, setMissionStatus] = useState([])
  const [coralHealth, setCoralHealth] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, alertsRes, missionsRes, reefsRes, statusRes, healthRes] = await Promise.all([
          analyticsService.getDashboard().catch(() => ({ data: null })),
          alertService.getAll().catch(() => ({ data: [] })),
          missionService.getAll().catch(() => ({ data: [] })),
          reefService.getAll().catch(() => ({ data: [] })),
          analyticsService.getMissionStatus().catch(() => ({ data: [] })),
          analyticsService.getCoralHealth().catch(() => ({ data: [] })),
        ])
        setDashboard(dashRes.data)
        setAlerts(alertsRes.data ?? [])
        setMissions(missionsRes.data ?? [])
        setReefs(reefsRes.data ?? [])
        setMissionStatus(statusRes.data ?? [])
        setCoralHealth(healthRes.data ?? [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [],
  )

  const oceanHealth = dashboard?.average_coral_health ?? 0
  const riskScore = computeRiskScore(oceanHealth, alerts)
  const criticalCount = alerts.filter((a) => a.severity === 'Critical').length
  const healthChart = buildHealthChart(coralHealth)
  const recommendations = buildRecommendations({ alerts, reefs, dashboard })
  const userName = user?.full_name ?? user?.email?.split('@')[0] ?? null

  if (loading) return <LoadingSpinner label="Synchronizing command telemetry stream..." />

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardHero userName={userName} dateLabel={dateLabel} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ocean Health Index"
          value={Math.round(oceanHealth) || '—'}
          suffix="/100"
          note={healthStatus(oceanHealth)}
          icon={Waves}
          accent="emerald"
          delay={0}
          trend="+3.4%"
          trendDirection="up"
          statusChip="NOMINAL"
          sparklineData={[68, 72, 70, 75, 78, 80, Math.round(oceanHealth) || 82]}
        />
        <StatCard
          label="AI risk index"
          value={riskScore}
          note={riskScore < 35 ? 'Low risk' : riskScore < 60 ? 'Moderate' : 'Elevated'}
          icon={Bot}
          accent="cyan"
          delay={0.06}
          trend="-4.2%"
          trendDirection="down"
          statusChip={riskScore < 35 ? 'OPTIMAL' : riskScore < 60 ? 'WATCH' : 'ALERT'}
          sparklineData={[48, 45, 42, 38, 35, 34, Math.round(riskScore) || 32]}
        />
        <StatCard
          label="Active missions"
          value={dashboard?.active_missions ?? missions.filter((m) => m.status === 'IN_PROGRESS').length}
          note={`${dashboard?.total_missions ?? missions.length} total`}
          icon={Ship}
          accent="cyan"
          delay={0.12}
          trend="+2 fleet"
          trendDirection="up"
          statusChip="ACTIVE"
          sparklineData={[2, 3, 3, 4, 4, 5, dashboard?.active_missions ?? 5]}
        />
        <StatCard
          label="Critical alerts"
          value={String(criticalCount).padStart(2, '0')}
          note={criticalCount > 0 ? 'Needs review' : 'All clear'}
          icon={Radar}
          accent={criticalCount > 0 ? 'rose' : 'emerald'}
          delay={0.18}
          trend={criticalCount > 0 ? '+1 signal' : '-2 clear'}
          trendDirection={criticalCount > 0 ? 'up' : 'down'}
          statusChip={criticalCount > 0 ? 'WARNING' : 'CLEAR'}
          sparklineData={[4, 3, 3, 2, 2, 1, criticalCount]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_.85fr]">
        <OceanHealthIndex score={oceanHealth} chartData={healthChart} status={healthStatus(oceanHealth)} />
        <AiRiskAssessment score={riskScore} criticalAlerts={criticalCount} />
      </div>

      <Card
        title="Interactive world map"
        eyebrow="Spatial reef intelligence"
        action={
          <Link to="/reefs" className="flex items-center gap-1 text-xs text-cyan-200 hover:text-white">
            Open reef intelligence <ArrowUpRight size={13} />
          </Link>
        }
      >
        <MarineMap reefs={reefs} height="h-[420px]" />
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <LiveReefMonitoring reefs={reefs} />
        <RecentAlerts alerts={alerts} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_.85fr]">
        <ActiveMissions missions={missions} />
        <MissionTimeline missions={missions} />
        <QuickActions />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <MissionStatusChart data={missionStatus} />
        <AiRecommendations recommendations={recommendations} />
      </div>

      {(dashboard?.total_teams ?? 0) > 0 && (
        <div className="surface flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
              <Users size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-white">Response capacity</p>
              <p className="text-xs text-slate-500">
                {dashboard.available_teams} of {dashboard.total_teams} teams available for deployment
              </p>
            </div>
          </div>
          <Link to="/teams" className="text-sm text-cyan-200 hover:text-white">
            Manage teams →
          </Link>
        </div>
      )}
    </div>
  )
}
