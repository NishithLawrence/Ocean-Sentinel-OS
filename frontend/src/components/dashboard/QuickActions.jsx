import { Link } from 'react-router-dom'
import { ArrowUpRight, BarChart3, BellRing, FileText, Map, Plus, Users } from 'lucide-react'
import Card from '../common/Card.jsx'

const actions = [
  { to: '/missions', label: 'Create mission', category: 'ACTION // DISPATCH', icon: Plus, variant: 'primary' },
  { to: '/reefs', label: 'Reef intelligence', category: 'SPATIAL // MAP', icon: Map, variant: 'secondary' },
  { to: '/alerts', label: 'Review alerts', category: 'TELEMETRY // SIGNALS', icon: BellRing, variant: 'secondary' },
  { to: '/reports', label: 'Generate report', category: 'INTELLIGENCE // DOCS', icon: FileText, variant: 'secondary' },
  { to: '/teams', label: 'Response teams', category: 'TACTICAL // FLEET', icon: Users, variant: 'secondary' },
  { to: '/analytics', label: 'Analytics', category: 'PREDICTIVE // DATA', icon: BarChart3, variant: 'secondary' },
]

export default function QuickActions() {
  return (
    <Card title="Quick actions" eyebrow="Command shortcuts">
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map(({ to, label, category, icon: Icon, variant }) => (
          <Link
            key={to + label}
            to={to}
            className="group relative flex overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-cyan-400/25 via-emerald-400/15 to-cyan-500/20 hover:from-cyan-300/60 hover:via-emerald-300/50 hover:to-cyan-400/70 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(34,211,238,0.22)]"
          >
            <div
              className={`flex w-full items-center justify-between gap-3 rounded-[15px] p-3.5 backdrop-blur-md transition-colors ${
                variant === 'primary'
                  ? 'bg-slate-900/90 group-hover:bg-slate-900/70'
                  : 'bg-slate-950/80 group-hover:bg-slate-900/80 border border-cyan-100/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 group-hover:scale-105 group-hover:bg-cyan-400/20 transition-all">
                  <Icon size={17} />
                </span>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {label}
                  </p>
                  <p className="font-mono text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                    {category}
                  </p>
                </div>
              </div>

              {/* Animated Arrow */}
              <ArrowUpRight
                size={16}
                className="text-cyan-400 opacity-60 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}


