import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'

const tooltipStyle = {
  background: '#041426',
  border: '1px solid rgba(148,210,255,.2)',
  borderRadius: 14,
  color: '#e6f4ff',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
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

export default function OceanHealthIndex({ score, chartData, status = 'Stable' }) {
  const variant = score >= 70 ? 'success' : score >= 40 ? 'warning' : 'danger'
  const displayScore = Number.isFinite(score) ? Math.round(score) : '—'

  return (
    <Card
      title="Ocean Health Index"
      eyebrow="Live environment signal"
      action={
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <Badge variant={variant}>{status}</Badge>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[140px_1fr] lg:items-center">
        <div className="mx-auto grid size-32 place-items-center rounded-full border-[10px] border-emerald-300/20 shadow-[0_0_45px_rgba(52,211,153,.15)] transition-all duration-500 hover:border-emerald-300/35 hover:shadow-[0_0_55px_rgba(52,211,153,.25)]">
          <div className="text-center">
            <AnimatedScore score={displayScore} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">/ 100</p>
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="oceanHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity=".45" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
              </defs>
              <Tooltip contentStyle={tooltipStyle} />
              <XAxis dataKey="label" stroke="#638099" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis hide domain={[0, 'auto']} />
              <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2.5} fill="url(#oceanHealth)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}

