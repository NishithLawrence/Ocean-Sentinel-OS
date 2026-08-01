import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../common/Card.jsx'
import Badge from '../common/Badge.jsx'

const tooltipStyle = {
  background: '#082440',
  border: '1px solid rgba(148,210,255,.15)',
  borderRadius: 14,
  color: '#e6f4ff',
}

export default function OceanHealthIndex({ score, chartData, status = 'Stable' }) {
  const variant = score >= 70 ? 'success' : score >= 40 ? 'warning' : 'danger'
  const displayScore = Number.isFinite(score) ? Math.round(score) : '—'

  return (
    <Card title="Ocean Health Index" eyebrow="Live environment signal" action={<Badge variant={variant}>{status}</Badge>}>
      <div className="grid gap-6 lg:grid-cols-[140px_1fr] lg:items-center">
        <div className="mx-auto grid size-32 place-items-center rounded-full border-[10px] border-emerald-300/20 shadow-[0_0_45px_rgba(52,211,153,.15)]">
          <div className="text-center">
            <p className="text-4xl font-semibold text-white">{displayScore}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">/ 100</p>
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="oceanHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity=".45" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
              </defs>
              <Tooltip contentStyle={tooltipStyle} />
              <XAxis dataKey="label" stroke="#638099" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis hide domain={[0, 'auto']} />
              <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2.5} fill="url(#oceanHealth)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
