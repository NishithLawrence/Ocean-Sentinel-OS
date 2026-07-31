import { BarChart3, FileText, LayoutDashboard, Map, Ship, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [[ '/dashboard', 'Dashboard', LayoutDashboard ], ['/reefs', 'Reef Intelligence', Map], ['/missions', 'Missions', Ship], ['/analytics', 'Analytics', BarChart3], ['/reports', 'Reports', FileText], ['/teams', 'Team Management', Users]]

export default function Sidebar() {
  return <aside className="hidden w-64 shrink-0 bg-ocean-700 p-4 text-white md:block"><nav className="space-y-1">{items.map(([to, label, Icon]) => <NavLink key={to} to={to} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-ocean-600"><Icon size={18} />{label}</NavLink>)}</nav></aside>
}
