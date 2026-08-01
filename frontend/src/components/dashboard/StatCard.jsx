import { motion } from 'framer-motion'

const accents = {
  cyan: 'bg-cyan-300/10 text-cyan-200',
  emerald: 'bg-emerald-400/10 text-emerald-200',
  rose: 'bg-rose-400/10 text-rose-200',
  amber: 'bg-amber-400/10 text-amber-200',
}

export default function StatCard({ label, value, note, icon: Icon, accent = 'cyan', suffix = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      className="surface relative overflow-hidden rounded-3xl p-5"
    >
      <div className="absolute -right-6 -top-6 size-24 rounded-full bg-cyan-300/5 blur-2xl" />
      <div className="flex items-start justify-between">
        <span className={`grid size-10 place-items-center rounded-2xl ${accents[accent] ?? accents.cyan}`}>
          {Icon && <Icon size={20} />}
        </span>
        {note && <span className="text-xs text-emerald-300">{note}</span>}
      </div>
      <p className="mt-6 text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
        {value}
        {suffix && <span className="text-base text-slate-500">{suffix}</span>}
      </p>
    </motion.div>
  )
}
