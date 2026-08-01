import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
const visuals = { info: [Info, 'border-cyan-300/20 bg-cyan-400/8 text-cyan-100'], success: [CheckCircle2, 'border-emerald-300/20 bg-emerald-400/8 text-emerald-100'], warning: [AlertTriangle, 'border-amber-300/20 bg-amber-400/8 text-amber-100'] }
export default function Alert({ variant = 'info', children }) { const [Icon, style] = visuals[variant] ?? visuals.info; return <div className={`flex gap-3 rounded-2xl border p-4 text-sm ${style}`}><Icon size={18} className="shrink-0" />{children}</div> }
