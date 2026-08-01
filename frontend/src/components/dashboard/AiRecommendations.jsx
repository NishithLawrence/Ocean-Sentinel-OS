import { Bot, Lightbulb } from 'lucide-react'
import Card from '../common/Card.jsx'

export default function AiRecommendations({ recommendations = [] }) {
  return (
    <Card title="AI recommendations" eyebrow="Operational guidance">
      {recommendations.length === 0 ? (
        <p className="text-sm text-slate-400">All monitored systems within normal parameters. Continue routine surveillance.</p>
      ) : (
        <ul className="space-y-3">
          {recommendations.map((item, index) => (
            <li key={index} className="flex gap-3 rounded-2xl border border-cyan-100/10 bg-white/3 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-200">
                {index === 0 ? <Bot size={16} /> : <Lightbulb size={16} />}
              </span>
              <p className="text-sm leading-6 text-slate-300">{item}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
