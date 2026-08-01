import { motion } from 'framer-motion'

export default function LoadingSpinner({ label = 'Synchronizing telemetry stream...' }) {
  return (
    <div className="surface flex min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-3xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="relative flex items-center justify-center">
        {/* Outer subtle radar ring */}
        <span className="absolute size-14 animate-ping rounded-full bg-cyan-400/10" />
        <span className="absolute size-10 rounded-full border border-cyan-400/25 bg-cyan-400/5 backdrop-blur-sm" />
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="size-10 rounded-full border-2 border-cyan-400/15 border-t-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        />
        <span className="absolute size-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
      </div>
      <div>
        <p className="font-mono text-xs font-semibold tracking-wider text-cyan-200 uppercase">{label}</p>
        <p className="mt-1 text-[11px] text-slate-500">Ocean Sentinel OS · AI Marine Intelligence Core</p>
      </div>
    </div>
  )
}

