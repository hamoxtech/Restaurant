import { restaurant, type OpeningHours } from '../data/restaurant'

const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
export const formatPrice = (n: number) => `${restaurant.currency} ${nf.format(n)}`

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
/** Remaps v from [a,b] to [0,1], clamped. */
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a))
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Is the restaurant open at `now`? Handles closing times past midnight. */
export function isOpenNow(hours: readonly OpeningHours[], now = new Date()): boolean {
  const day = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()
  return hours.some((h) => {
    const o = toMin(h.open)
    const c = toMin(h.close)
    if (c > o) return h.dayIndexes.includes(day) && mins >= o && mins < c
    // Overnight: open today after `o`, or still open from yesterday before `c`.
    const yesterday = (day + 6) % 7
    return (h.dayIndexes.includes(day) && mins >= o) || (h.dayIndexes.includes(yesterday) && mins < c)
  })
}

export const to12h = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am'
  const hr = h % 12 === 0 ? 12 : h % 12
  return `${hr}${m ? `:${String(m).padStart(2, '0')}` : ''}${suffix}`
}
