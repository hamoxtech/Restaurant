import { useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

/** Maps a 0–1 scroll progress onto a discrete stage index (re-renders only on change). */
export function useStageIndex(progress: MotionValue<number>, breakpoints: number[]): number {
  const find = (v: number) => {
    let i = 0
    while (i < breakpoints.length && v >= breakpoints[i]) i++
    return i
  }
  const [stage, setStage] = useState(() => find(progress.get()))
  useMotionValueEvent(progress, 'change', (v) => {
    const next = find(v)
    setStage((s) => (s === next ? s : next))
  })
  return stage
}
