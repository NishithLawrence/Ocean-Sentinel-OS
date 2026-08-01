import { Waves } from 'lucide-react'

export default function EmptyState({
  title = 'No active telemetry',
  description = 'Data streams and signals will populate automatically.',
  action,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-cyan-300/20 bg-gradient-to-b from-cyan-500/5 to-transparent p-8 text-center backdrop-blur-sm">
      <div className="relative mx-auto mb-3 flex size-12 items-center justify-center">
        <span className="absolute size-12 animate-pulse rounded-2xl bg-cyan-400/10" />
        <span className="grid size-11 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
          <Waves size={20} />
        </span>
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-white">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-400">{description}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

