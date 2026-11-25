import type { SVGProps } from 'react'

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>)
export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>)
export const ArrowUpRight = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>)
export const Plus = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>)
export const Minus = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M5 12h14" /></svg>)
export const Close = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>)
export const Bag = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>)
export const Pin = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>)
export const Clock = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>)
export const Phone = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>)
export const Flame = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M12 22c4 0 7-2.7 7-7 0-3.5-2.5-6-4-8-.5 2-1.6 3.2-3 3.5C12.5 7.5 11 4.5 8.5 2 8.5 6 5 8.5 5 15c0 4.3 3 7 7 7Z" /></svg>)
export const Menu = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>)

/** Wordmark — crescent wok arc over a horizon line. */
export function Logo({ className = '', mono = false }: { className?: string; mono?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="16" fill={mono ? 'currentColor' : '#8E2424'} />
        <path d="M14 40c0-10 8-18 18-18s18 8 18 18" fill="none" stroke="#F2E6D0" strokeWidth="4" strokeLinecap="round" />
        <path d="M10 42h44" stroke="#F2E6D0" strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="16" r="3" fill="#F2E6D0" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="display text-[1.15rem] tracking-wide">Al Arabian</span>
        <span className="serif-accent text-[0.95rem] -mt-0.5 opacity-80">Delights</span>
      </span>
    </span>
  )
}
