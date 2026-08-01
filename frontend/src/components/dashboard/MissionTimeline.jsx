import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'
import EmptyState from '../common/EmptyState.jsx'

const statusVariant = (status) => {
  const map = { IN_PROGRESS: 'success', PLANNED: 'info', COMPLETED: 'success', CANCELLED: 'danger' }
  return map[status] ?? 'info'
}

export default function MissionTimeline({ missions = [] }) {
  const timeline = [...missions]
    .filter((m) => m.scheduled_date)
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
    .slice(0, 6)

  return (
    <Card title="Mission timeline" eyebrow="Scheduled operations">
      {timeline.length === 0 ? (
        <EmptyState title="No scheduled missions" description="Mission dates will populate this timeline." />
      ) : (
        <ol className="relative space-y-0 border-l border-cyan-100/15 pl-6">
          {timeline.map((mission, index) => (
            <li key={mission.id} className="relative pb-6 last:pb-0">
              <span className="absolute -left-[7px] top-1.5 size-3 rounded-full border-2 border-cyan-300/40 bg-[#041426]" />
              {index === 0 && (
                <span className="absolute -left-[7px] top-1.5 size-3 animate-ping rounded-full bg-cyan-300/30" />
              )}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-white">{mission.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(mission.scheduled_date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <Badge variant={statusVariant(mission.status)}>{mission.status.replaceAll('_', ' ')}</Badge>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}
