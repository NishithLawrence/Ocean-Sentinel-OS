import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../common/Card.jsx'
import EmptyState from '../common/EmptyState.jsx'

export default function AnalyticsChart({ title, data, labelKey }) {
  return <Card title={title}>{data.length === 0 ? <EmptyState title="No data available" description="Data will appear after operational records are created." /> : <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={labelKey} tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#075985" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>}</Card>
}
