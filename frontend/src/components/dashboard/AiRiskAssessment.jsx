import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import { Bot, Cpu } from 'lucide-react'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'

function riskMeta(score) {
  if (score < 35) return { label: 'Low risk', variant: 'success', message: 'No immediate intervention required.' }
  if (score < 60) return { label: 'Moderate risk', variant: 'warning', message: 'Monitor flagged reefs and review scheduled missions.' }
  if (score < 80) return { label: 'Elevated risk', variant: 'warning', message: 'Prioritize response teams for high-severity signals.' }
  return { label: 'Critical risk', variant: 'danger', message: 'Immediate operational review recommended.' }
}

function AnimatedScore({ score }) {
  const numericVal = typeof score === 'number' ? score : parseFloat(score)
  const isNumber = !isNaN(numericVal) && isFinite(numericVal)
  const [displayVal, setDisplayVal] = useState(isNumber ? 0 : score)

  useEffect(() => {
    if (!isNumber) {
      setDisplayVal(score)
      return
    }
    const controls = animate(0, numericVal, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayVal(Math.round(latest))
      },
    })
    return () => controls.stop()
  }, [numericVal, isNumber, score])

  return <span className="font-mono text-4xl font-bold tracking-tight text-white">{displayVal}</span>
}

export default function AiRiskAssessment({ score, criticalAlerts = 0 }) {
  const meta = riskMeta(score)
  const ringColor =
    score < 35
      ? 'border-cyan-300/25 shadow-[0_0_40px_rgba(34,211,238,0.15)]'
      : score < 60
        ? 'border-amber-300/30 shadow-[0_0_40px_rgba(252,211,77,0.15)]'
        : 'border-rose-300/30 shadow-[0_0_40px_rgba(253,164,175,0.15)]'
  const progressBg =
    score < 35
      ? 'from-cyan-400 to-emerald-400'
      : score < 60
        ? 'from-amber-400 to-orange-400'
        : 'from-rose-500 to-red-500'

  return (
    <Card
      title="AI Risk Assessment"
      eyebrow="Explainable engine"
      action={
        <div className="flex items-center gap-2">
          <Cpu size={14} className="animate-pulse text-cyan-300" />
          <Badge variant={meta.variant}>{meta.label}</Badge>
        </div>
      }
    >
      <div className="flex flex-col justify-center">
        <div className={`mx-auto grid size-36 place-items-center rounded-full border-[10px] ${ringColor} transition-all duration-500`}>
          <div className="text-center">
            <Bot size={24} className="mx-auto mb-1 text-cyan-200" />
            <AnimatedScore score={score} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-200">{meta.label}</p>
          </div>
        </div>

        {/* Visual risk bar */}
        <div className="mt-5 space-y-1.5 px-4">
          <div className="flex justify-between font-mono text-[11px] text-slate-400">
            <span>RISK INDEX</span>
            <span className="font-bold text-white">{score} / 100</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full border border-cyan-100/10 bg-slate-900/80 p-0.5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${progressBg} transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">{meta.message}</p>
        {criticalAlerts > 0 && (
          <p className="mx-auto mt-3 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 font-mono text-[11px] text-rose-300">
            ⚠ {criticalAlerts} critical signal{criticalAlerts !== 1 ? 's' : ''} active
          </p>
        )}
      </div>
    </Card>
  )
}

