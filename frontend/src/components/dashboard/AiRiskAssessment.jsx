import { Bot } from 'lucide-react'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'

function riskMeta(score) {
  if (score < 35) return { label: 'Low risk', variant: 'success', message: 'No immediate intervention required.' }
  if (score < 60) return { label: 'Moderate risk', variant: 'warning', message: 'Monitor flagged reefs and review scheduled missions.' }
  if (score < 80) return { label: 'Elevated risk', variant: 'warning', message: 'Prioritize response teams for high-severity signals.' }
  return { label: 'Critical risk', variant: 'danger', message: 'Immediate operational review recommended.' }
}

export default function AiRiskAssessment({ score, criticalAlerts = 0 }) {
  const meta = riskMeta(score)
  const ringColor = score < 35 ? 'border-cyan-300/20' : score < 60 ? 'border-amber-300/25' : 'border-rose-300/25'

  return (
    <Card title="AI Risk Assessment" eyebrow="Explainable engine" action={<Badge variant={meta.variant}>{meta.label}</Badge>}>
      <div className="flex h-60 flex-col justify-center">
        <div className={`mx-auto grid size-36 place-items-center rounded-full border-[10px] ${ringColor} shadow-[0_0_45px_rgba(34,211,238,.12)]`}>
          <Bot size={28} className="mb-1 text-cyan-200" />
          <div className="text-center">
            <p className="text-4xl font-semibold text-white">{score}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-200">{meta.label}</p>
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-slate-400">{meta.message}</p>
        {criticalAlerts > 0 && (
          <p className="mt-2 text-center text-xs text-rose-200">{criticalAlerts} critical signal{criticalAlerts !== 1 ? 's' : ''} active</p>
        )}
      </div>
    </Card>
  )
}
