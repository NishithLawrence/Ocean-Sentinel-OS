import { Link } from 'react-router-dom'
import { BarChart3, BellRing, FileText, Map, Plus, Ship, Users } from 'lucide-react'
import Card from '../common/Card.jsx'

const actions = [
  { to: '/missions', label: 'Create mission', icon: Plus, variant: 'primary' },
  { to: '/reefs', label: 'Reef intelligence', icon: Map, variant: 'secondary' },
  { to: '/alerts', label: 'Review alerts', icon: BellRing, variant: 'secondary' },
  { to: '/reports', label: 'Generate report', icon: FileText, variant: 'secondary' },
  { to: '/teams', label: 'Response teams', icon: Users, variant: 'secondary' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, variant: 'secondary' },
]

export default function QuickActions() {
  return (
    <Card title="Quick actions" eyebrow="Command shortcuts">
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map(({ to, label, icon: Icon, variant }) => (
          <Link
            key={to + label}
            to={to}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium transition ${
              variant === 'primary'
                ? 'border-cyan-300/25 bg-gradient-to-r from-cyan-400/15 to-emerald-400/10 text-cyan-50 hover:brightness-110'
                : 'border-cyan-100/10 bg-white/3 text-slate-300 hover:border-cyan-200/25 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={18} className="text-cyan-300" />
            {label}
          </Link>
        ))}
      </div>
    </Card>
  )
}
