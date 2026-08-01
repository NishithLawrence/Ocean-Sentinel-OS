import { Link } from 'react-router-dom'
import { ArrowUpRight, Waves } from 'lucide-react'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'
import EmptyState from '../common/EmptyState.jsx'

function healthVariant(health) {
  if (health >= 70) return 'success'
  if (health >= 40) return 'warning'
  return 'danger'
}

export default function LiveReefMonitoring({ reefs = [] }) {
  const monitored = [...reefs]
    .sort((a, b) => (a.coral_health ?? 100) - (b.coral_health ?? 100))
    .slice(0, 5)

  return (
    <Card
      title="Live reef monitoring"
      eyebrow={`${reefs.length} tracked sites`}
      action={
        <Link to="/reefs" className="flex items-center gap-1 text-xs text-cyan-200 hover:text-white">
          All reefs <ArrowUpRight size={13} />
        </Link>
      }
    >
      {monitored.length === 0 ? (
        <EmptyState title="No reefs monitored" description="Reef health data will appear once sites are registered." />
      ) : (
        <div className="space-y-3">
          {monitored.map((reef) => (
            <Link
              key={reef.id}
              to={`/reef/${reef.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-100/10 bg-white/3 p-4 transition hover:border-cyan-200/25 hover:bg-white/5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
                  <Waves size={16} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{reef.reef_name}</p>
                  <p className="text-xs text-slate-500">{reef.country}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {reef.bleaching_alert && <Badge variant="warning">Bleaching</Badge>}
                <Badge variant={healthVariant(reef.coral_health)}>{reef.coral_health}%</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}
