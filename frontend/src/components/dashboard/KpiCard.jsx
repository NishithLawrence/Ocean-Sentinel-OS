import { useEffect, useState } from 'react'
import { motion, animate } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../common/Card.jsx'

function Sparkline({ data = [30, 45, 40, 60, 55, 70, 75] }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 80
  const height = 22

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg className="h-5 w-20 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

function AnimatedValue({ value }) {
  const numericVal = typeof value === 'number' ? value : parseFloat(value)
  const isNumber = !isNaN(numericVal) && isFinite(numericVal)
  const [displayVal, setDisplayVal] = useState(isNumber ? 0 : value)

  useEffect(() => {
    if (!isNumber) {
      setDisplayVal(value)
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
  }, [numericVal, isNumber, value])

  return <span className="font-mono text-3xl font-extrabold tracking-tight text-white">{displayVal}</span>
}

export default function KpiCard({
  label = 'Metric',
  value = '—',
  trend = '+2.4%',
  trendDirection = 'up',
  statusChip = 'NOMINAL',
  sparklineData = [35, 42, 50, 48, 62, 70],
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="group relative overflow-hidden transition-all duration-300 border border-cyan-400/20 hover:border-cyan-300/40 hover:shadow-[0_12px_35px_rgba(34,211,238,0.18)]">
        {/* Dynamic Hover Glow Backlight */}
        <div className="absolute -right-8 -top-8 size-28 rounded-full bg-cyan-400/20 blur-2xl transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 opacity-40 pointer-events-none" />

        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-cyan-300">
            {statusChip}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <AnimatedValue value={value} />
            <div className="mt-1 flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
              {trendDirection === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{trend}</span>
            </div>
          </div>
          <Sparkline data={sparklineData} />
        </div>

        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 group-hover:w-28" />
      </Card>
    </motion.div>
  )
}


