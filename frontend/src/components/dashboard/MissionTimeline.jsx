import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'
import EmptyState from '../common/EmptyState.jsx'

const statusVariant = (status) => {
  const normalized = (status || '').toUpperCase().replaceAll(' ', '_')
  const map = {
    IN_PROGRESS: 'success',
    PLANNED: 'info',
    COMPLETED: 'success',
    SCHEDULED: 'info',
    CANCELLED: 'danger',
  }
  return map[normalized] ?? 'info'
}

export default function MissionTimeline({ missions = [] }) {
  const timeline = [...missions]
    .filter((m) => m.scheduled_date || m.mission_date)
    .sort((a, b) => new Date(a.scheduled_date || a.mission_date) - new Date(b.scheduled_date || b.mission_date))
    .slice(0, 6)

  return (
    <Card title="Mission Timeline" eyebrow="Scheduled Operations">
      {timeline.length === 0 ? (
        <EmptyState title="No scheduled missions" description="Mission dates will populate this timeline automatically." />
      ) : (
        <div className="relative pl-8 sm:pl-10 py-2">
          {/* Vertical connecting timeline line sitting behind markers */}
          <div className="absolute left-11 sm:left-13 top-4 bottom-6 w-0.5 bg-gradient-to-b from-cyan-400/40 via-cyan-400/20 to-transparent -translate-x-1/2 pointer-events-none" />

          <ol className="space-y-6">
            {timeline.map((mission, index) => {
              const displayDate = mission.scheduled_date || mission.mission_date
              const statusText = (mission.status || 'Planned').replaceAll('_', ' ')

              return (
                <li key={mission.id} className="relative flex items-start gap-4 sm:gap-5">
                  {/* Timeline Marker Column */}
                  <div className="relative flex items-center justify-center shrink-0 size-6 mt-0.5 z-10">
                    <span className="size-3 rounded-full border-2 border-cyan-400 bg-[#061325] shadow-[0_0_10px_rgba(56,189,248,0.6)]" />
                    {index === 0 && (
                      <span className="absolute size-3 animate-ping rounded-full bg-cyan-400/50" />
                    )}
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 rounded-xl border border-cyan-400/10 bg-slate-900/50 p-3.5 backdrop-blur-md transition-all hover:border-cyan-400/25 hover:bg-slate-900/70">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-100 truncate tracking-tight">{mission.title || mission.mission_name}</p>
                      <p className="mt-1 font-mono text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-cyan-400/60 inline-block" />
                        {displayDate
                          ? new Date(displayDate).toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'TBD'}
                      </p>
                    </div>

                    <div className="shrink-0 pt-1 sm:pt-0">
                      <Badge variant={statusVariant(mission.status)}>
                        {statusText}
                      </Badge>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </Card>
  )
}
