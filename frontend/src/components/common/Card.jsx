import { motion } from 'framer-motion'

export default function Card({ title, eyebrow, children, className = '', action }) {
  return <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`surface rounded-3xl p-5 sm:p-6 ${className}`}><>{(title || eyebrow || action) && <div className="mb-5 flex items-start justify-between gap-4"><div>{eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}{title && <h2 className="text-base font-semibold tracking-tight text-white">{title}</h2>}</div>{action}</div>}</>{children}</motion.section>
}
