import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'

// three.js (~150kB gz) is only fetched on desktop, after idle, when steam is near the viewport.
const SteamCanvas = lazy(() => import('../../three/SteamCanvas'))

interface Props {
  className?: string
  intensity?: number | MotionValue<number>
}

/** CSS-only steam — three blurred wisps. Used on touch devices and as the WebGL fallback. */
function CssSteam() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute bottom-[10%] h-[70%] w-[28%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,248,236,.32),transparent)] blur-2xl"
          style={{ left: `${24 + i * 18}%`, animation: `steam-rise ${6 + i * 1.4}s ${i * 1.8}s ease-out infinite` }}
        />
      ))}
    </div>
  )
}

export function Steam({ className = 'absolute inset-0', intensity = 1 }: Props) {
  const { reduced, desktop } = useMotionPrefs()
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const webgl = desktop && !reduced

  useEffect(() => {
    const el = ref.current
    if (!el || !webgl) return
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting)
      if (e.isIntersecting) setNear(true)
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [webgl])

  const [idle, setIdle] = useState(false)
  useEffect(() => {
    if (!near) return
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300))
    const id = ric(() => setIdle(true))
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number)
  }, [near])

  if (reduced) return null
  return (
    <div ref={ref} className={`pointer-events-none ${className}`} aria-hidden>
      {webgl && idle ? (
        <Suspense fallback={<CssSteam />}>
          <SteamCanvas intensity={intensity} active={visible} />
        </Suspense>
      ) : (
        <CssSteam />
      )}
    </div>
  )
}
