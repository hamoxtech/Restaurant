import { animate, stagger, createTimeline } from 'animejs'

/**
 * Anime.js is used for the moments that need choreography rather than
 * physics: the hero headline's character cascade and the CTA type.
 * Everything here animates transform/opacity only.
 */
export function revealChars(root: HTMLElement, { delay = 0, duration = 1100, gap = 28 } = {}) {
  const chars = root.querySelectorAll<HTMLElement>('[data-char]')
  if (!chars.length) return undefined
  return animate(chars, {
    translateY: { from: '108%', to: '0%' },
    rotate: { from: 6, to: 0 },
    opacity: { from: 0, to: 1 },
    duration,
    delay: stagger(gap, { start: delay }),
    ease: 'outExpo',
  })
}

/** Lines that slide up from behind their mask, one after another. */
export function revealLines(root: HTMLElement, { delay = 0 } = {}) {
  const lines = root.querySelectorAll<HTMLElement>('[data-line]')
  const tl = createTimeline({ defaults: { ease: 'outExpo', duration: 1000 } })
  tl.add(lines, { translateY: { from: '100%', to: '0%' }, opacity: { from: 0, to: 1 }, delay: stagger(120, { start: delay }) })
  return tl
}
