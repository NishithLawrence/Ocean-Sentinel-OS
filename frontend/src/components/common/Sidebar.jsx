import { useEffect, useRef, useState } from 'react'
import {
  BarChart3,
  BellRing,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Settings,
  Ship,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import BrandLogo from './BrandLogo.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { alertService } from '../../services/alertService.js'

const items = [
  { to: '/dashboard', label: 'Command center', icon: LayoutDashboard },
  { to: '/reefs', label: 'Reef intelligence', icon: Map },
  { to: '/missions', label: 'Mission planner', icon: Ship },
  { to: '/teams', label: 'Response teams', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/alerts', label: 'Alerts', icon: BellRing, badgeKey: 'alerts' },
]

export default function Sidebar() {
  const { clearSession, user } = useAuth()
  const navigate = useNavigate()
  const [alertCount, setAlertCount] = useState(0)
  const [online, setOnline] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    alertService
      .getAll()
      .then(({ data }) => setAlertCount(data?.length ?? 0))
      .catch(() => setOnline(false))
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => setOnline(navigator.onLine), 30000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const logout = () => {
    clearSession()
    navigate('/', { replace: true })
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-[17.5rem] shrink-0 flex-col border-r border-cyan-400/15 bg-[#030c1a]/90 backdrop-blur-2xl lg:flex z-40">
      <div className="border-b border-cyan-400/15 px-6 py-6">
        <NavLink to="/dashboard" className="block transition opacity-95 hover:opacity-100">
          <BrandLogo size="md" />
        </NavLink>
      </div>

      <div className="flex flex-1 flex-col px-4 py-5 overflow-y-auto">
        <p className="eyebrow mb-4 px-3 tracking-widest text-cyan-400/80">Command Navigation</p>
        <nav className="space-y-1.5">
          {items.map(({ to, label, icon: Icon, badgeKey }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-cyan-200 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.25)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]" />
                  )}
                  <Icon size={18} className={isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300 transition-colors'} />
                  <span className="flex-1 tracking-tight">{label}</span>
                  {badgeKey === 'alerts' && alertCount > 0 && (
                    <span className="grid min-w-5 place-items-center rounded-full bg-rose-500/20 border border-rose-400/30 px-1.5 py-0.5 text-[10px] font-mono font-bold text-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                      {alertCount > 99 ? '99+' : alertCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6">
          <div className="rounded-2xl border border-cyan-400/15 bg-slate-900/60 p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full pulse-dot ${online ? 'bg-emerald-400 text-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-amber-400 text-amber-400'}`}
              />
              <p className="text-xs font-mono font-semibold text-slate-200">{online ? 'System Operational' : 'Connection Degraded'}</p>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 font-mono">Ocean Sentinel OS · AI Stream Active</p>
            {user?.email && <p className="mt-2 truncate font-mono text-[11px] text-cyan-300/80">{user.email}</p>}
          </div>

          <div className="space-y-1 border-t border-cyan-400/15 pt-4">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <ShieldCheck size={18} className="text-cyan-400/80" />
              Profile & Access
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Settings size={18} className="text-cyan-400/80" />
              System Settings
            </NavLink>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
            >
              <LogOut size={18} className="text-rose-400/80" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
