import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../common/Card.jsx'
import EmptyState from '../common/EmptyState.jsx'

const tooltipStyle = {
  background: '#082440',
  border: '1px solid rgba(148,210,255,.15)',
  borderRadius: 14,
  color: '#e6f4ff',
}

export default function MissionStatusChart({ data = [] }) {
  const chartData = data.map((item) => ({
    label: item.status.replaceAll('_', ' '),
    value: item.count,
  }))

  return (
    <Card title="Mission status overview" eyebrow="Operational distribution">
      {chartData.length === 0 ? (
        <EmptyState title="No mission data" description="Mission statistics will appear once missions are created." />
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
              <CartesianGrid stroke="rgba(148,210,255,.1)" strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#638099" tick={{ fontSize: 11, fill: '#8ca6bf' }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="#638099" tick={{ fontSize: 11, fill: '#8ca6bf' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
