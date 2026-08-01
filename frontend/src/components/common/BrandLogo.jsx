export default function BrandLogo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { img: 'size-9', title: 'text-sm', sub: 'text-[9px]' },
    md: { img: 'size-11', title: 'text-base', sub: 'text-[10px]' },
    lg: { img: 'size-14', title: 'text-lg', sub: 'text-[11px]' },
    xl: { img: 'size-20', title: 'text-2xl', sub: 'text-xs' },
  }
  const s = sizes[size] ?? sizes.md

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo.jpeg"
        alt="Ocean Sentinel OS"
        className={`${s.img} rounded-2xl object-cover shadow-[0_0_24px_rgba(34,211,238,.25)] ring-1 ring-cyan-200/20`}
      />
      {showText && (
        <div>
          <p className={`font-bold tracking-tight text-white ${s.title}`}>Ocean Sentinel OS</p>
          <p className={`font-bold uppercase tracking-[.18em] text-cyan-300 ${s.sub}`}>Marine Intelligence</p>
        </div>
      )}
    </div>
  )
}
