import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Clock, Search, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from './BrandLogo.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { alertService } from '../../services/alertService.js'

const destinations = [
  { label: 'Command center', path: '/dashboard', keywords: 'dashboard home command' },
  { label: 'Reef intelligence', path: '/reefs', keywords: 'reef map coral' },
  { label: 'Mission planner', path: '/missions', keywords: 'mission deploy ship' },
  { label: 'Response teams', path: '/teams', keywords: 'team crew' },
  { label: 'Analytics', path: '/analytics', keywords: 'charts metrics data' },
  { label: 'Reports', path: '/reports', keywords: 'report pdf export' },
  { label: 'Alerts', path: '/alerts', keywords: 'alert notification signal' },
  { label: 'Profile', path: '/profile', keywords: 'profile account identity' },
  { label: 'System settings', path: '/admin', keywords: 'admin settings system' },
]

function formatUtc(date) {
  return date.toISOString().replace('T', ' ').slice(0, 19)
}

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [utcTime, setUtcTime] = useState(formatUtc(new Date()))
  const [alerts, setAlerts] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)

  const initials = user?.full_name
    ? user.full_name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'O'

  useEffect(() => {
    const tick = setInterval(() => setUtcTime(formatUtc(new Date())), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    alertService
      .getAll()
      .then(({ data }) => setAlerts(data ?? []))
      .catch(() => setAlerts([]))
  }, [])

  useEffect(() => {
    const close = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return destinations.slice(0, 5)
    return destinations.filter(
      (item) => item.label.toLowerCase().includes(q) || item.keywords.includes(q),
    )
  }, [query])

  const recentAlerts = [...alerts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4)

  const go = (path) => {
    navigate(path)
    setQuery('')
    setFocused(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-100/10 bg-[#041426]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-7">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="lg:hidden">
            <BrandLogo size="sm" showText={false} />
          </div>

          <div className="relative hidden max-w-md flex-1 md:block">
            <label className="flex items-center gap-2 rounded-xl border border-cyan-100/12 bg-white/4 px-3 text-slate-400 transition focus-within:border-cyan-300/40">
              <Search size={16} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && results[0]) go(results[0].path)
                }}
                placeholder="Search Ocean Sentinel OS…"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-500"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-slate-500 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </label>
            {focused && results.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+.35rem)] overflow-hidden rounded-2xl border border-cyan-100/15 bg-[#06182d]/95 shadow-[0_20px_50px_rgba(0,0,0,.35)] backdrop-blur-xl">
                {results.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onMouseDown={() => go(item.path)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                    <span className="text-[10px] uppercase tracking-wider text-slate-600">{item.path}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-cyan-100/10 bg-white/3 px-3 py-2 text-xs text-slate-400 xl:flex">
            <Clock size={14} className="text-cyan-300" />
            <span className="font-mono text-cyan-100/90">{utcTime}</span>
            <span className="text-slate-600">UTC</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((value) => !value)}
              className="relative grid size-10 place-items-center rounded-xl border border-cyan-100/10 bg-white/4 text-slate-300 transition hover:text-cyan-200"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {alerts.length > 0 && (
                <span className="absolute right-2 top-2 grid min-w-4 place-items-center rounded-full bg-rose-400 px-1 text-[9px] font-bold text-white">
                  {alerts.length > 9 ? '9+' : alerts.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-[calc(100%+.5rem)] w-80 overflow-hidden rounded-2xl border border-cyan-100/15 bg-[#06182d]/95 shadow-[0_20px_50px_rgba(0,0,0,.35)] backdrop-blur-xl">
                <div className="border-b border-cyan-100/10 px-4 py-3">
                  <p className="text-sm font-medium text-white">Notifications</p>
                  <p className="text-xs text-slate-500">{alerts.length} active signal{alerts.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {recentAlerts.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-500">No alerts at this time.</p>
                  ) : (
                    recentAlerts.map((alert) => (
                      <div key={alert.id} className="border-b border-cyan-100/8 px-4 py-3 last:border-0">
                        <p className="text-sm font-medium text-white">{alert.reef_name}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  to="/alerts"
                  onClick={() => setShowNotifications(false)}
                  className="block border-t border-cyan-100/10 px-4 py-3 text-center text-xs text-cyan-200 hover:bg-white/5"
                >
                  View all alerts
                </Link>
              </div>
            )}
          </div>

          <div className="hidden text-right sm:block">
            <p className="max-w-36 truncate text-sm font-medium text-white">{user?.full_name ?? user?.email ?? 'Signed in'}</p>
            <p className="text-xs text-slate-500">{user?.role ?? 'Ocean Sentinel OS'}</p>
          </div>

          <Link
            to="/profile"
            className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-xs font-black text-slate-950 ring-1 ring-white/10"
            title="Profile"
          >
            {initials}
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-cyan-100/8 px-4 py-2 md:hidden">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Clock size={12} className="text-cyan-300" />
          <span className="font-mono text-cyan-100/80">{utcTime} UTC</span>
        </div>
      </div>
    </header>
  )
}
