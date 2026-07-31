import Card from './Card.jsx'
import EmptyState from './EmptyState.jsx'
export default function PlaceholderPage({ title, description }) { return <div className="space-y-6"><div><h1 className="text-2xl font-bold text-slate-900">{title}</h1><p className="mt-1 text-slate-600">{description}</p></div><Card title="Scaffold status"><EmptyState title={`${title} is ready for implementation`} description="This placeholder intentionally contains no business logic or live data." /></Card></div> }
