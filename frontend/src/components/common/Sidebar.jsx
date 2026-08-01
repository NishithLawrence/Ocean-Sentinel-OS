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
    <aside className="sticky top-0 hidden h-screen w-[17.5rem] shrink-0 flex-col border-r border-cyan-100/10 bg-[#031223]/85 backdrop-blur-xl lg:flex">
      <div className="border-b border-cyan-100/8 px-6 py-6">
        <NavLink to="/dashboard" className="block transition opacity-95 hover:opacity-100">
          <BrandLogo size="md" />
        </NavLink>
      </div>

      <div className="flex flex-1 flex-col px-4 py-5">
        <p className="eyebrow mb-4 px-3">Navigation</p>
        <nav className="space-y-1">
          {items.map(({ to, label, icon: Icon, badgeKey }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400/15 to-emerald-400/10 text-cyan-50 shadow-[inset_0_0_0_1px_rgba(103,232,249,.15)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-300 to-emerald-300" />
                  )}
                  <Icon size={18} className={isActive ? 'text-cyan-200' : 'text-cyan-300/70 group-hover:text-cyan-200'} />
                  <span className="flex-1">{label}</span>
                  {badgeKey === 'alerts' && alertCount > 0 && (
                    <span className="grid min-w-5 place-items-center rounded-full bg-rose-400/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-100">
                      {alertCount > 99 ? '99+' : alertCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6">
          <div className="rounded-2xl border border-cyan-100/10 bg-white/3 px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full ${online ? 'bg-emerald-300 shadow-[0_0_12px_#34d399]' : 'bg-amber-300'}`}
              />
              <p className="text-xs font-medium text-white">{online ? 'System operational' : 'Connection degraded'}</p>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Ocean Sentinel OS · Intelligence layer active</p>
            {user?.email && <p className="mt-2 truncate text-[11px] text-cyan-200/70">{user.email}</p>}
          </div>

          <div className="space-y-1 border-t border-cyan-100/10 pt-4">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  isActive ? 'bg-white/6 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <ShieldCheck size={18} />
              Profile & access
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  isActive ? 'bg-white/6 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Settings size={18} />
              System settings
            </NavLink>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-200"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
