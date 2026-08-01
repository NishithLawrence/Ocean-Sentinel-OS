import { Link } from 'react-router-dom'
import { ArrowUpRight, Ship } from 'lucide-react'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'
import EmptyState from '../common/EmptyState.jsx'

const statusVariant = (status) => {
  const map = {
    IN_PROGRESS: 'success',
    PLANNED: 'info',
    COMPLETED: 'success',
    CANCELLED: 'danger',
  }
  return map[status] ?? 'info'
}

const statusLabel = (status) =>
  ({ IN_PROGRESS: 'In progress', PLANNED: 'Scheduled', COMPLETED: 'Completed', CANCELLED: 'Cancelled' }[status] ?? status)

const priorityVariant = (priority) =>
  ({ CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'success' }[priority] ?? 'info')

export default function ActiveMissions({ missions = [] }) {
  const active = missions
    .filter((m) => m.status === 'IN_PROGRESS' || m.status === 'PLANNED')
    .slice(0, 5)

  return (
    <Card
      title="Active missions"
      eyebrow="Operational deployment"
      action={
        <Link to="/missions" className="flex items-center gap-1 font-mono text-xs text-cyan-200 hover:text-white">
          Mission planner <ArrowUpRight size={13} />
        </Link>
      }
    >
      {active.length === 0 ? (
        <EmptyState title="No active missions" description="Deploy a new mission from the planner to begin operations." />
      ) : (
        <div className="space-y-3">
          {active.map((mission) => (
            <div
              key={mission.id}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-cyan-100/10 bg-white/3 p-4 transition-all duration-200 hover:border-cyan-300/25 hover:bg-white/6 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200 transition-colors group-hover:bg-cyan-300/20 group-hover:text-cyan-100">
                  <Ship size={16} />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-white">{mission.title}</p>
                    {mission.status === 'IN_PROGRESS' && (
                      <span className="relative flex size-1.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-slate-500">{mission.scheduled_date}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 font-mono text-xs">
                <Badge variant={statusVariant(mission.status)}>{statusLabel(mission.status)}</Badge>
                <Badge variant={priorityVariant(mission.priority)}>{mission.priority}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

