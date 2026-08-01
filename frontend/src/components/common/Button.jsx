import { motion } from 'framer-motion'

const styles = {
  primary: 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,.2)] hover:brightness-110',
  secondary: 'border border-cyan-200/15 bg-white/5 text-cyan-50 hover:border-cyan-300/35 hover:bg-cyan-300/10',
  danger: 'border border-rose-300/20 bg-rose-500/12 text-rose-100 hover:bg-rose-500/22',
  ghost: 'text-slate-300 hover:bg-white/6 hover:text-white',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return <motion.button whileHover={{ y: -1 }} whileTap={{ scale: .98 }} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant] ?? styles.primary} ${className}`} {...props}>{children}</motion.button>
}
