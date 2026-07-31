import { Bell, Waves } from 'lucide-react'
export default function Navbar() { return <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6"><div className="flex items-center gap-2 font-semibold text-ocean-700"><Waves size={22} />Ocean Sentinel OS</div><button aria-label="Notifications"><Bell size={20} /></button></header> }
