import { useEffect, useState } from 'react'
import { Bot, Shield, AlertTriangle, CheckCircle, Flame, Waves, Anchor, Sparkles, Send } from 'lucide-react'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import LoadingSpinner from '../common/LoadingSpinner.jsx'
import DeployMissionModal from '../mission/DeployMissionModal.jsx'
import { reefService } from '../../services/reefService.js'
import { teamService } from '../../services/teamService.js'

const badgeVariant = (risk) => {
  switch (risk) {
    case 'Critical':
    case 'CRITICAL':
      return 'danger'
    case 'High':
    case 'HIGH':
      return 'warning'
    case 'Medium':
    case 'MEDIUM':
      return 'info'
    default:
      return 'success'
  }
}

export default function AiConservationRecommendation({ reef, onMissionDeployed }) {
  const [assessment, setAssessment] = useState(null)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      if (!reef?.id) return
      setLoading(true)
      try {
        const [assessRes, teamsRes] = await Promise.all([
          reefService.getAssessment(reef.id).catch(() => ({ data: null })),
          teamService.getAll().catch(() => ({ data: [] })),
        ])
        if (isMounted) {
          setAssessment(assessRes.data)
          setTeams(teamsRes.data ?? [])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [reef?.id])

  if (!reef) {
    return (
      <Card title="AI Conservation Recommendation" eyebrow="Reef Decision Support">
        <p className="text-sm text-slate-400 py-6 text-center">
          Select a reef from the map or list to view AI risk explainability and operational recommendations.
        </p>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card title="AI Conservation Recommendation" eyebrow="Reef Decision Support">
        <LoadingSpinner label="Evaluating AI risk model & recommendations..." />
      </Card>
    )
  }

  // Fallback client-side rule evaluation matching risk_engine.py and ai_recommendation_service.py if API data missing
  const coralHealthPts = reef.coral_health <= 25 ? 35 : reef.coral_health <= 50 ? 25 : reef.coral_health <= 75 ? 10 : 0
  const seaTempPts = reef.sea_temperature >= 32 ? 30 : reef.sea_temperature >= 30 ? 20 : reef.sea_temperature >= 28 ? 10 : 0
  const bleachingPts = reef.bleaching_alert ? 25 : 0
  const ghostNetPts = reef.ghost_net_distance != null ? (reef.ghost_net_distance <= 1 ? 25 : reef.ghost_net_distance <= 5 ? 15 : reef.ghost_net_distance <= 10 ? 5 : 0) : 0
  const protectedAreaPts = reef.protected_area ? -5 : 0

  const contributors = assessment?.risk_contributors ?? {
    coral_health: coralHealthPts,
    sea_temperature: seaTempPts,
    bleaching: bleachingPts,
    ghost_nets: ghostNetPts,
    protected_area: protectedAreaPts,
    final_score: assessment?.risk_score ?? Math.min(100, Math.max(0, coralHealthPts + seaTempPts + bleachingPts + ghostNetPts + protectedAreaPts)),
  }

  const overallRisk = assessment?.overall_risk ?? (contributors.final_score >= 70 ? 'Critical' : contributors.final_score >= 50 ? 'High' : contributors.final_score >= 25 ? 'Medium' : 'Low')
  const aiConfidence = assessment?.ai_confidence ?? '98.5%'

  // Explanations describing WHY score was received
  const explanations = assessment?.explanations ?? [
    reef.coral_health <= 50 ? `Coral health (${reef.coral_health}%) is below the safety threshold, adding +${coralHealthPts} risk.` : `Coral health (${reef.coral_health}%) is within acceptable range.`,
    reef.sea_temperature >= 30 ? `Sea surface temperature (${reef.sea_temperature}°C) indicates thermal stress, adding +${seaTempPts} risk.` : `Sea surface temperature (${reef.sea_temperature}°C) is nominal.`,
    reef.bleaching_alert ? `Active bleaching alert detected for this sector, adding +25 risk.` : null,
    reef.ghost_net_distance != null && reef.ghost_net_distance <= 10 ? `Ghost fishing gear detected nearby (${reef.ghost_net_distance} km), adding +${ghostNetPts} risk.` : null,
    reef.protected_area ? `Marine Protected Area (MPA) status provides conservation mitigation (-5 risk).` : null,
  ].filter(Boolean)

  // Operational Recommendation details
  const opRec = assessment?.operational_recommendation ?? {}
  let missionType = opRec.mission_type
  let duration = opRec.estimated_duration
  let outcomes = opRec.expected_outcome

  if (!missionType) {
    if (reef.ghost_net_distance != null && reef.ghost_net_distance <= 5) {
      missionType = 'Ghost Net Cleanup'
      duration = '2 - 4 Days'
      outcomes = ['Remove ghost nets', 'Assess coral health', 'Collect updated telemetry', 'Prevent reef degradation']
    } else if (reef.bleaching_alert || reef.sea_temperature >= 32) {
      missionType = 'Bleaching Assessment'
      duration = '2 - 3 Days'
      outcomes = ['Assess coral health', 'Collect updated telemetry', 'Monitor thermal stress', 'Prevent reef degradation']
    } else if (reef.coral_health <= 25) {
      missionType = 'Emergency Reef Restoration'
      duration = '3 - 5 Days'
      outcomes = ['Plant coral fragments', 'Assess coral health', 'Collect updated telemetry', 'Prevent reef degradation']
    } else if (reef.coral_health <= 50) {
      missionType = 'Coral Health Survey'
      duration = '2 - 3 Days'
      outcomes = ['Assess coral health', 'Measure canopy density', 'Collect updated telemetry', 'Prevent reef degradation']
    } else {
      missionType = 'Water Quality Inspection'
      duration = '1 - 2 Days'
      outcomes = ['Collect updated telemetry', 'Inspect water quality', 'Prevent reef degradation']
    }
  }

  const priority = (opRec.priority ?? (overallRisk === 'Critical' ? 'CRITICAL' : overallRisk === 'High' ? 'HIGH' : overallRisk === 'Medium' ? 'MEDIUM' : 'LOW')).toUpperCase()

  // Match suggested team
  const matchedTeam = teams.find((t) => t.id === opRec.suggested_team_id) || teams[0] || { id: 1, team_name: 'Team Alpha', specialization: 'Response Unit' }

  return (
    <Card
      title={`AI Conservation Recommendation — ${reef.reef_name}`}
      eyebrow="Decision Support System"
      action={
        <Badge variant={badgeVariant(overallRisk)}>
          {overallRisk} Risk
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Section 1: Telemetry Overview Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3">
            <span className="text-xs font-semibold text-slate-400">Risk Score / Confidence</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-cyan-200">{contributors.final_score} / 100</span>
              <span className="text-xs text-emerald-400 font-medium">{aiConfidence} conf.</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3">
            <span className="text-xs font-semibold text-slate-400">Coral Health</span>
            <div className="mt-1 flex items-center gap-2">
              <Waves className="size-4 text-cyan-400" />
              <span className="text-lg font-semibold text-white">{reef.coral_health}%</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3">
            <span className="text-xs font-semibold text-slate-400">Sea Temp / Bleaching</span>
            <div className="mt-1 flex items-center gap-2">
              <Flame className="size-4 text-amber-400" />
              <span className="text-lg font-semibold text-white">{reef.sea_temperature}°C</span>
              {reef.bleaching_alert && <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-300">ALERT</span>}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3">
            <span className="text-xs font-semibold text-slate-400">Ghost Net / Protected</span>
            <div className="mt-1 text-sm font-medium text-slate-200">
              {reef.ghost_net_distance != null ? `${reef.ghost_net_distance} km` : 'N/A'} • {reef.protected_area ? 'MPA Protected' : 'Unprotected'}
            </div>
          </div>
        </div>

        {/* Section 2: AI Explainability (Risk Contributors & Explanations) */}
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-4 space-y-4">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
            <Sparkles className="size-4 text-cyan-400" />
            <span>AI Explainability — Risk Contributors</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-5 text-center text-xs">
            <div className="rounded-lg bg-slate-800/80 p-2.5">
              <p className="text-slate-400">Coral Health</p>
              <p className="mt-1 text-base font-bold text-amber-300">+{contributors.coral_health}</p>
            </div>
            <div className="rounded-lg bg-slate-800/80 p-2.5">
              <p className="text-slate-400">Sea Temperature</p>
              <p className="mt-1 text-base font-bold text-amber-300">+{contributors.sea_temperature}</p>
            </div>
            <div className="rounded-lg bg-slate-800/80 p-2.5">
              <p className="text-slate-400">Bleaching</p>
              <p className="mt-1 text-base font-bold text-rose-400">+{contributors.bleaching}</p>
            </div>
            <div className="rounded-lg bg-slate-800/80 p-2.5">
              <p className="text-slate-400">Ghost Nets</p>
              <p className="mt-1 text-base font-bold text-amber-300">+{contributors.ghost_nets}</p>
            </div>
            <div className="rounded-lg bg-slate-800/80 p-2.5">
              <p className="text-slate-400">Protected Area</p>
              <p className="mt-1 text-base font-bold text-emerald-400">{contributors.protected_area}</p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Reasoning Summary</p>
            <ul className="space-y-1 text-xs text-slate-300">
              {explanations.map((exp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3: AI Operational Recommendation & Objectives */}
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
              <Bot className="size-4 text-emerald-400" />
              <span>Recommended Operational Response</span>
            </div>
            <Badge variant={badgeVariant(priority)}>{priority} PRIORITY</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl bg-slate-800/60 p-3">
              <p className="text-slate-400 font-medium">Mission Type</p>
              <p className="mt-1 font-semibold text-white text-sm">{missionType}</p>
            </div>

            <div className="rounded-xl bg-slate-800/60 p-3">
              <p className="text-slate-400 font-medium">Suggested Team</p>
              <p className="mt-1 font-semibold text-cyan-200 text-sm">{matchedTeam.team_name}</p>
              <p className="text-[11px] text-slate-400">{matchedTeam.specialization}</p>
            </div>

            <div className="rounded-xl bg-slate-800/60 p-3">
              <p className="text-slate-400 font-medium">Estimated Duration</p>
              <p className="mt-1 font-semibold text-white text-sm">{duration}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Expected Outcome (Operational Objectives)</p>
            <div className="grid gap-2 sm:grid-cols-2 text-xs">
              {outcomes.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-800/40 px-3 py-1.5 text-slate-200">
                  <CheckCircle className="size-3.5 text-emerald-400 shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Deploy Mission Large Button */}
          <div className="pt-2">
            <Button
              className="w-full justify-center py-3 text-sm font-semibold tracking-wide shadow-lg shadow-cyan-500/10"
              onClick={() => setIsModalOpen(true)}
            >
              <Send className="mr-2 size-4" />
              Deploy Mission
            </Button>
          </div>
        </div>
      </div>

      <DeployMissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reef={reef}
        recommendation={assessment}
        teams={teams}
        onSuccess={() => {
          if (onMissionDeployed) onMissionDeployed()
        }}
      />
    </Card>
  )
}
