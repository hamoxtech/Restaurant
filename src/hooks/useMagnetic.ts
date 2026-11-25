import { useRef, type RefObject } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'
import { useMotionPrefs } from './useMotionPrefs'

/** Magnetic pull towards the cursor. Disabled for touch and reduced motion. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35): {
  ref: RefObject<T | null>
  x: MotionValue<number>
  y: MotionValue<number>
  handlers: { onPointerMove: (e: React.PointerEvent) => void; onPointerLeave: () => void }
} {
  const ref = useRef<T>(null)
  const { reduced, finePointer } = useMotionPrefs()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.4 })
  const enabled = finePointer && !reduced

  return {
    ref,
    x,
    y,
    handlers: {
      onPointerMove: (e) => {
        if (!enabled || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        rawX.set((e.clientX - (r.left + r.width / 2)) * strength)
        rawY.set((e.clientY - (r.top + r.height / 2)) * strength)
      },
      onPointerLeave: () => {
        rawX.set(0)
        rawY.set(0)
      },
    },
  }
}
