import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMagnetic } from '../../hooks/useMagnetic'

type Common = { children: ReactNode; className?: string; strength?: number; ariaLabel?: string }
type AsButton = Common & { href?: undefined; onClick?: () => void; type?: 'button' | 'submit' }
type AsLink = Common & { href: string; onClick?: () => void; external?: boolean }

/** A button/link that leans toward the cursor, with an inner label that leans further. */
export function MagneticButton(props: AsButton | AsLink) {
  const { children, className = 'btn-red', strength = 0.3, ariaLabel } = props
  const { ref, x, y, handlers } = useMagnetic<HTMLElement>(strength)
  const inner = (
    <motion.span style={{ x, y }} className="pointer-events-none relative inline-flex items-center gap-2">
      {children}
    </motion.span>
  )
  const style = { x, y }
  if ('href' in props && props.href) {
    const ext = 'external' in props && props.external
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={props.href}
        onClick={props.onClick}
        aria-label={ariaLabel}
        {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
        className={className}
        style={style}
        {...handlers}
      >
        {inner}
      </motion.a>
    )
  }
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={(props as AsButton).type ?? 'button'}
      onClick={props.onClick}
      aria-label={ariaLabel}
      className={className}
      style={style}
      {...handlers}
    >
      {inner}
    </motion.button>
  )
}
