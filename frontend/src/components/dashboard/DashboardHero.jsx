import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Activity,
  Clock,
  Compass,
  Plus,
  Radio,
  Satellite,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Zap,
} from 'lucide-react'
import Button from '../common/Button.jsx'

function RadarSweep() {
  return (
    <div className="pointer-events-none absolute right-0 top-1/2 -z-0 size-[420px] -translate-y-1/2 translate-x-1/4 opacity-20 sm:opacity-25">
      {/* Concentric Circles */}
      <div className="absolute inset-0 rounded-full border border-cyan-400/30" />
      <div className="absolute inset-8 rounded-full border border-cyan-400/20" />
      <div className="absolute inset-20 rounded-full border border-cyan-400/20" />
      <div className="absolute inset-32 rounded-full border border-cyan-400/15" />
      <div className="absolute inset-[45%] rounded-full border border-cyan-300/40 bg-cyan-400/10" />

      {/* Axis Lines */}
      <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-400/20" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-400/20" />

      {/* Rotating Sweep Ray */}
      <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full">
        <div
          className="h-1/2 w-1/2 origin-bottom-right rounded-tl-full"
          style={{
            background: 'conic-gradient(from 270deg at 100% 100%, rgba(34, 211, 238, 0.45) 0deg, transparent 60deg)',
          }}
        />
      </div>

      {/* Target Blips */}
      <div className="absolute top-[28%] left-[62%] size-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
      <div className="absolute top-[28%] left-[62%] size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />

      <div className="absolute bottom-[32%] left-[25%] size-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9]" />
      <div className="absolute top-[68%] right-[30%] size-1.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
    </div>
  )
}

export default function DashboardHero({ userName, dateLabel }) {
  const [utcClock, setUtcClock] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getUTCHours()).padStart(2, '0')
      const minutes = String(now.getUTCMinutes()).padStart(2, '0')
      const seconds = String(now.getUTCSeconds()).padStart(2, '0')
      setUtcClock(`${hours}:${minutes}:${seconds} UTC`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="surface relative overflow-hidden rounded-[2rem] p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-cyan-400/20"
    >
      {/* Background ambient lighting & radar */}
      <div className="absolute -right-20 -top-20 size-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 size-80 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none" />
      <RadarSweep />

      {/* Header Telemetry Bar */}
      <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/15 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-bold tracking-wider">SYS_ONLINE</span>
          </div>

          <div className="hidden items-center gap-2 font-mono text-xs text-slate-400 sm:flex">
            <Activity size={13} className="text-cyan-300" />
            <span>AI CORE v2.4 OPERATIONAL</span>
          </div>

          <div className="hidden items-center gap-2 font-mono text-xs text-slate-400 md:flex border-l border-cyan-100/10 pl-3">
            <Radio size={13} className="text-emerald-400 animate-pulse" />
            <span>PAC-SECTOR-09 // ONLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <Sparkles size={13} className="text-cyan-300" />
          <span>{dateLabel}</span>
        </div>
      </div>

      {/* Main Grid: Mission Control Header (Left) + Live Intelligence Panel (Right) */}
      <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Mission Control Hero Header */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow">Ocean Sentinel OS // Command Matrix</span>
              <span className="rounded bg-cyan-400/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-300 border border-cyan-400/30">
                FLAGSHIP v1.5
              </span>
            </div>
            <h1 className="page-title mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              AI Marine Command Center
            </h1>
            <p className="page-subtitle mt-2 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {userName
                ? `Welcome back, Commander ${userName}. Real-time intelligence stream active across global marine sectors, autonomous response fleets, and environmental risk vectors.`
                : 'Real-time intelligence stream active across global marine sectors, response fleets, and environmental risk vectors.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link to="/alerts">
              <Button variant="secondary" className="px-4 py-2.5 text-xs font-mono border-cyan-400/30 bg-slate-900/60 hover:bg-cyan-500/10 hover:border-cyan-300/50">
                <Zap size={14} className="text-amber-300" />
                Review signals
              </Button>
            </Link>
            <Link to="/missions">
              <Button className="px-4 py-2.5 text-xs font-mono shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <Plus size={15} />
                Deploy mission
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Compact Live Intelligence Panel */}
        <div className="lg:col-span-6 xl:col-span-5">
          <div className="rounded-2xl border border-cyan-400/25 bg-slate-950/70 p-4 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="mb-3 flex items-center justify-between border-b border-cyan-100/10 pb-2">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-cyan-400 animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-wider text-cyan-200 uppercase">
                  Live Intelligence Stream
                </span>
              </div>
              <span className="rounded bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-400/20">
                STREAM 100%
              </span>
            </div>

            {/* 6 Intelligence Items Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. UTC Clock */}
              <div className="rounded-xl border border-cyan-100/10 bg-slate-900/60 p-2.5 transition-colors hover:border-cyan-400/30">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Clock size={12} className="text-cyan-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">UTC Clock</span>
                </div>
                <p className="font-mono text-sm font-bold text-cyan-200 tracking-tight">
                  {utcClock || '19:08:24 UTC'}
                </p>
              </div>

              {/* 2. Ocean Weather */}
              <div className="rounded-xl border border-cyan-100/10 bg-slate-900/60 p-2.5 transition-colors hover:border-cyan-400/30">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Thermometer size={12} className="text-emerald-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">Ocean Weather</span>
                </div>
                <p className="font-mono text-xs font-semibold text-slate-200 truncate" title="24.2°C • 12kt ESE • Wave 1.2m">
                  24.2°C • 12kt ESE • 1.2m
                </p>
              </div>

              {/* 3. AI Status */}
              <div className="rounded-xl border border-cyan-100/10 bg-slate-900/60 p-2.5 transition-colors hover:border-cyan-400/30">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Activity size={12} className="text-cyan-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">AI Status</span>
                </div>
                <p className="font-mono text-xs font-semibold text-emerald-400 truncate">
                  OPTIMAL (99.4%)
                </p>
              </div>

              {/* 4. Live Satellite */}
              <div className="rounded-xl border border-cyan-100/10 bg-slate-900/60 p-2.5 transition-colors hover:border-cyan-400/30">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Satellite size={12} className="text-cyan-300" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">Live Satellite</span>
                </div>
                <p className="font-mono text-xs font-semibold text-slate-200 truncate" title="SENTINEL-3B (Pass: T-12m)">
                  SENTINEL-3B • Active
                </p>
              </div>

              {/* 5. Active Regions */}
              <div className="rounded-xl border border-cyan-100/10 bg-slate-900/60 p-2.5 transition-colors hover:border-cyan-400/30">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Compass size={12} className="text-cyan-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">Active Regions</span>
                </div>
                <p className="font-mono text-xs font-semibold text-cyan-200 truncate">
                  4 Sectors Monitored
                </p>
              </div>

              {/* 6. Threat Level */}
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-2.5 transition-colors hover:border-amber-400/40">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <ShieldCheck size={12} className="text-amber-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">Threat Level</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
                  </span>
                  <span>DEFCON 4 / LOW-MOD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
