import { useEffect, useRef } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

/** A muted video whose playhead follows scroll progress. Only seeks once per frame. */
export function ScrubVideo({ src, progress, className, poster, label }: { src: string; progress: MotionValue<number>; className?: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const raf = useRef(0)
  const target = useRef(0)

  const seek = () => {
    raf.current = 0
    const v = ref.current
    if (!v || !v.duration) return
    const t = target.current * (v.duration - 0.05)
    if (Math.abs(v.currentTime - t) > 0.01) v.currentTime = t
  }

  useMotionValueEvent(progress, 'change', (p) => {
    target.current = p
    if (!raf.current) raf.current = requestAnimationFrame(seek)
  })
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      muted
      playsInline
      preload="auto"
      aria-label={label}
      onLoadedMetadata={seek}
    />
  )
}
