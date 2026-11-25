import { useMediaQuery } from './useMediaQuery'

/**
 * One place that decides how much motion a device gets.
 *  - reduced: user asked for reduced motion → static compositions, no scroll-jacking.
 *  - mobile / tablet: shorter scroll distances, fewer particles, no WebGL.
 */
export function useMotionPrefs() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const mobile = useMediaQuery('(max-width: 767px)')
  const tablet = useMediaQuery('(max-width: 1023px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  return { reduced, mobile, tablet, desktop: !tablet, finePointer }
}
