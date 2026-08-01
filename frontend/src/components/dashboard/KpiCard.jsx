import { motion } from 'framer-motion'
import Card from '../common/Card.jsx'
export default function KpiCard({ label = 'Metric', value = '—' }) { return <motion.div whileHover={{ y: -3 }}><Card className="relative overflow-hidden"><div className="absolute -right-8 -top-8 size-24 rounded-full bg-cyan-300/10 blur-2xl" /><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p><div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" /></Card></motion.div> }
