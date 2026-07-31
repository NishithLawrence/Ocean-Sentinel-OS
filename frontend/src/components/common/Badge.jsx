const styles = { success: 'bg-emerald-100 text-emerald-800', warning: 'bg-amber-100 text-amber-800', danger: 'bg-red-100 text-red-800', info: 'bg-sky-100 text-sky-800' }
export default function Badge({ variant = 'info', children }) { return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[variant]}`}>{children}</span> }
