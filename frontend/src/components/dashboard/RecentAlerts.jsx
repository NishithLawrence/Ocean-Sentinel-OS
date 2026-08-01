import { Link } from 'react-router-dom'
import { BellRing, ArrowUpRight } from 'lucide-react'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'
import EmptyState from '../common/EmptyState.jsx'

const severityVariant = (severity) =>
  ({ Critical: 'danger', High: 'warning', Medium: 'info', Low: 'success' }[severity] ?? 'info')

export default function RecentAlerts({ alerts = [] }) {
  const recent = [...alerts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4)

  return (
    <Card
      title="Recent alerts"
      eyebrow="Environmental signal stream"
      action={
        <Link to="/alerts" className="flex items-center gap-1 font-mono text-xs text-cyan-200 hover:text-white">
          All alerts <ArrowUpRight size={13} />
        </Link>
      }
    >
      {recent.length === 0 ? (
        <EmptyState title="Waters are quiet" description="New environmental assessment signals will populate here automatically." />
      ) : (
        <div className="space-y-3">
          {recent.map((alert) => (
            <article
              key={alert.id}
              className="group flex gap-3 rounded-2xl border border-cyan-100/10 bg-white/3 p-4 transition-all duration-200 hover:border-cyan-300/25 hover:bg-white/6 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200 transition-colors group-hover:bg-cyan-300/20 group-hover:text-cyan-100">
                <BellRing size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{alert.reef_name}</p>
                    {alert.severity === 'Critical' && (
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-rose-400" />
                      </span>
                    )}
                  </div>
                  <Badge variant={severityVariant(alert.severity)}>{alert.severity}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{alert.message}</p>
                <p className="mt-2 font-mono text-[11px] text-slate-500">{new Date(alert.created_at).toLocaleString()}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  )
}

