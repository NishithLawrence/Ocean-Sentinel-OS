import { useEffect, useState } from 'react'
import { motion, animate } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const accents = {
  cyan: {
    bg: 'bg-cyan-400/10 border border-cyan-400/25 text-cyan-200',
    glow: 'bg-cyan-400/20',
    dot: 'bg-cyan-400',
    stroke: '#22d3ee',
    chip: 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300',
  },
  emerald: {
    bg: 'bg-emerald-400/10 border border-emerald-400/25 text-emerald-200',
    glow: 'bg-emerald-400/20',
    dot: 'bg-emerald-400',
    stroke: '#34d399',
    chip: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300',
  },
  rose: {
    bg: 'bg-rose-400/10 border border-rose-400/25 text-rose-200',
    glow: 'bg-rose-400/20',
    dot: 'bg-rose-400',
    stroke: '#fb7185',
    chip: 'bg-rose-400/10 border-rose-400/30 text-rose-300',
  },
  amber: {
    bg: 'bg-amber-400/10 border border-amber-400/25 text-amber-200',
    glow: 'bg-amber-400/20',
    dot: 'bg-amber-400',
    stroke: '#fbbf24',
    chip: 'bg-amber-400/10 border-amber-400/30 text-amber-300',
  },
}

function Sparkline({ data = [40, 55, 48, 65, 58, 75, 82], accent = 'cyan' }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 96
  const height = 26

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 6) - 3
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const strokeColor = accents[accent]?.stroke ?? '#22d3ee'
  const gradId = `spark-${accent}`

  return (
    <div className="flex flex-col items-end">
      <svg className="h-7 w-24 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#${gradId})`} />
        <motion.polyline
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  )
}

function AnimatedValue({ value, suffix = '' }) {
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

  return (
    <span className="font-mono text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
      {displayVal}
      {suffix && <span className="ml-1 text-xs font-semibold text-slate-400 font-mono">{suffix}</span>}
    </span>
  )
}

export default function StatCard({
  label,
  value,
  note,
  icon: Icon,
  accent = 'cyan',
  suffix = '',
  delay = 0,
  trend = '+3.2%',
  trendDirection = 'up',
  sparklineData = [45, 52, 49, 62, 58, 70, 78],
  statusChip = 'OPTIMAL',
}) {
  const style = accents[accent] ?? accents.cyan

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="surface group relative overflow-hidden rounded-3xl p-5 border border-cyan-400/15 transition-all duration-300 hover:border-cyan-300/40 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_45px_rgba(34,211,238,0.18)]"
    >
      {/* Dynamic Hover Glow Backlight */}
      <div className={`absolute -right-10 -top-10 size-36 rounded-full ${style.glow} blur-2xl opacity-30 transition-all duration-500 group-hover:opacity-80 group-hover:scale-125 pointer-events-none`} />

      {/* Top Row: Icon + Status Chip */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={`grid size-10 place-items-center rounded-2xl ${style.bg} shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
            {Icon && <Icon size={19} />}
          </span>
          <div className="flex items-center gap-1.5 rounded-full border border-cyan-100/10 bg-white/4 px-2 py-0.5 text-[10px] font-mono text-slate-300">
            <span className="relative flex size-1.5">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${style.dot} opacity-75`} />
              <span className={`relative inline-flex size-1.5 rounded-full ${style.dot}`} />
            </span>
            <span>LIVE</span>
          </div>
        </div>

        {/* Status Chip */}
        <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${style.chip}`}>
          {statusChip}
        </span>
      </div>

      {/* Metric Label */}
      <p className="relative z-10 mt-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
        {label}
      </p>

      {/* Value Row + Animated Trend & Sparkline */}
      <div className="relative z-10 mt-1 flex items-end justify-between gap-2">
        <div>
          <AnimatedValue value={value} suffix={suffix} />

          {/* Animated Trend Indicator */}
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`flex items-center gap-0.5 font-mono text-xs font-bold ${
              trendDirection === 'up' ? 'text-emerald-400' : 'text-cyan-400'
            }`}>
              {trendDirection === 'up' ? (
                <TrendingUp size={13} />
              ) : (
                <TrendingDown size={13} />
              )}
              {trend}
            </span>
            {note && <span className="text-[11px] text-slate-400 font-mono">· {note}</span>}
          </div>
        </div>

        {/* Tiny Sparkline */}
        <Sparkline data={sparklineData} accent={accent} />
      </div>
    </motion.div>
  )
}


