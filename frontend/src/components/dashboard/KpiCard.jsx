import Card from '../common/Card.jsx'
export default function KpiCard({ label = 'Metric', value = '—' }) { return <Card><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></Card> }
