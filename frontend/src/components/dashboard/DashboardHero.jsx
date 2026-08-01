import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Sparkles } from 'lucide-react'
import Button from '../common/Button.jsx'

export default function DashboardHero({ userName, dateLabel }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
    >
      <div className="absolute -right-20 -top-20 size-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-emerald-400/8 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-xs text-cyan-200/80">
            <Sparkles size={14} />
            <span>AI Marine Command Center · {dateLabel}</span>
          </div>
          <p className="eyebrow">Ocean Sentinel OS</p>
          <h1 className="page-title mt-2">Marine command center</h1>
          <p className="page-subtitle mt-2 max-w-xl">
            {userName
              ? `Welcome back, ${userName}. Your real-time operational view across reefs, missions, and environmental signals.`
              : 'Your real-time operational view across reefs, response teams, and environmental signals.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/alerts">
            <Button variant="secondary">View alerts</Button>
          </Link>
          <Link to="/missions">
            <Button>
              <Plus size={16} />
              Create mission
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
