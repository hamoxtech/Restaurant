import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Picture } from '../ui/Picture'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'
import { useStageIndex } from '../../hooks/useStageIndex'
import { clamp, easeInOutCubic, easeOutCubic, range } from '../../lib/format'
import type { ImageKey } from '../../data/images.generated'
import { EASE_OUT_EXPO } from '../../animations/variants'

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

interface Ingredient {
  id: string
  label: string
  note: string
  image: ImageKey
  /** Optional zoom into a region of the photo (for crops like a lemon wedge). */
  zoom?: { scale: number; origin: string }
}

const INGREDIENTS: Ingredient[] = [
  { id: 'prawn', label: 'Prawn', note: 'Tiger, butterflied', image: 'ing-prawn' },
  { id: 'egg', label: 'Egg', note: 'Soft-scrambled', image: 'ing-egg' },
  { id: 'chicken', label: 'Chicken', note: 'Charred thigh', image: 'ing-chicken' },
  { id: 'vegetables', label: 'Vegetables', note: 'Carrot, pepper, cabbage', image: 'ing-veg' },
  { id: 'spring-onion', label: 'Spring Onion', note: 'Sliced at the pass', image: 'ing-onion' },
  { id: 'lemon', label: 'Lemon', note: 'Cut to order', image: 'dish-topdown', zoom: { scale: 3.4, origin: '62% 12%' } },
]

const STAGES = [
  { k: '01', title: 'The plate', body: 'Mixed fried rice, straight off the flame. Now watch it come apart.' },
  { k: '02', title: 'The grain', body: 'Day-old basmati — dry enough to separate, so every grain catches the wok.' },
  { k: '03', title: 'The build', body: 'Six components, each cooked on its own terms before they meet in the pan.' },
  { k: '04', title: 'Accounted for', body: 'Every grain, every garnish. Nothing on the plate is there by accident.' },
]
const STAGE_BREAKS = [0.12, 0.3, 0.64]

/* -------------------------------------------------------------------------- */
/*  Geometry                                                                   */
/* -------------------------------------------------------------------------- */

const TAU = Math.PI * 2

function wedgeClip(k: number, n: number) {
  const a0 = (k / n) * TAU - Math.PI / 2
  const a1 = ((k + 1) / n) * TAU - Math.PI / 2
  const pt = (a: number) => `${(50 + 80 * Math.cos(a)).toFixed(2)}% ${(50 + 80 * Math.sin(a)).toFixed(2)}%`
  return `polygon(50% 50%, ${pt(a0)}, ${pt((a0 + a1) / 2)}, ${pt(a1)})`
}

interface Grain {
  boundary: number
  jitter: number
  r0: number
  dist: number
  delay: number
  rot: number
  len: number
  color: string
}

const GRAIN_COLORS = ['#f3dca6', '#e9c784', '#f6e7c4', '#d9a95c', '#efd29a', '#c98d43']

function makeGrains(count: number, slices: number): Grain[] {
  // Deterministic pseudo-random so the choreography is identical every visit.
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  return Array.from({ length: count }, () => ({
    boundary: Math.floor(rnd() * slices),
    jitter: (rnd() - 0.5) * 0.22,
    r0: 0.12 + rnd() * 0.34,
    dist: 0.12 + rnd() * 0.42,
    delay: rnd(),
    rot: rnd() * TAU,
    len: 0.8 + rnd() * 0.5,
    color: GRAIN_COLORS[Math.floor(rnd() * GRAIN_COLORS.length)],
  }))
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function FoodDecomposition() {
  const { reduced, mobile } = useMotionPrefs()
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const dishRef = useRef<HTMLDivElement>(null)
  const wholeRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const sliceRefs = useRef<Array<HTMLDivElement | null>>([])
  const ingRefs = useRef<Array<HTMLDivElement | null>>([])
  const labelRefs = useRef<Array<HTMLDivElement | null>>([])
  const lineRefs = useRef<Array<HTMLDivElement | null>>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [box, setBox] = useState({ w: 1280, h: 800 })

  const slices = mobile ? 6 : 8
  const grains = useMemo(() => makeGrains(mobile ? 56 : 150, slices), [mobile, slices])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const stage = useStageIndex(scrollYProgress, STAGE_BREAKS)

  /* Measure the sticky viewport — all motion is proportional to it. */
  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = useMemo(() => {
    const { w, h } = box
    const D = mobile ? Math.min(w * 0.74, h * 0.4) : Math.min(h * 0.56, w * 0.4)
    const M = mobile ? Math.min(D * 0.3, w * 0.24) : D * 0.27
    const targets = INGREDIENTS.map((_, i) => {
      if (mobile) {
        // Two rows of three: above and below the plate.
        const col = (i % 3) - 1
        const row = i < 3 ? -1 : 1
        return { x: col * Math.min(w * 0.3, M * 1.25), y: row * (D * 0.41 + M * 0.62 + 14) }
      }
      const angle = (-150 + i * 60) * (Math.PI / 180)
      const rx = Math.min(w * 0.38, D * 1.02)
      const ry = D * 0.58
      return { x: Math.cos(angle) * rx, y: Math.sin(angle) * ry }
    })
    // Desktop: nudge the composition right so the caption (bottom-left) never collides.
    const offsetX = mobile ? 0 : Math.min(w * 0.05, 80)
    const offsetY = mobile ? -h * 0.02 : h * 0.01
    return { D, M, targets, offsetX, offsetY }
  }, [box, mobile])

  /* The whole choreography, as a pure function of scroll progress. */
  const apply = useCallback(
    (p: number) => {
      const { D, M, targets, offsetX, offsetY } = layout
      const cam = easeOutCubic(range(p, 0, 0.16))
      const split = easeInOutCubic(range(p, 0.12, 0.36)) - easeInOutCubic(range(p, 0.64, 0.84))
      const settle = easeInOutCubic(range(p, 0.6, 0.88))
      const dishScale = (1 + cam * 0.08) * (1 - settle * (mobile ? 0.2 : 0.22))
      const dishRot = -10 * range(p, 0, 1)

      if (dishRef.current) dishRef.current.style.transform = `translate3d(-50%,-50%,0) scale(${dishScale}) rotate(${dishRot}deg)`
      if (shadowRef.current) shadowRef.current.style.transform = `translate3d(-50%,-50%,0) scale(${dishScale * (1 + split * 0.18)})`
      if (wholeRef.current) wholeRef.current.style.opacity = split > 0.002 ? '0' : '1'

      const gap = split * D * 0.15
      sliceRefs.current.forEach((el, k) => {
        if (!el) return
        const mid = ((k + 0.5) / slices) * TAU - Math.PI / 2
        const tilt = (k % 2 ? 1 : -1) * split * 5
        el.style.opacity = split > 0.002 ? '1' : '0'
        el.style.transform = `translate3d(${Math.cos(mid) * gap}px, ${Math.sin(mid) * gap}px, 0) rotate(${tilt}deg)`
      })

      INGREDIENTS.forEach((_, i) => {
        const el = ingRefs.current[i]
        if (!el) return
        const e = easeOutCubic(range(p, 0.3 + i * 0.035, 0.56 + i * 0.035))
        const t = targets[i]
        // Arc travel: lerp to target plus a perpendicular bow that vanishes on arrival.
        const len = Math.hypot(t.x, t.y) || 1
        const bow = Math.sin(Math.PI * e) * D * 0.14
        const x = t.x * e + (-t.y / len) * bow
        const y = t.y * e + (t.x / len) * bow
        const s = 0.25 + 0.75 * e
        el.style.opacity = String(clamp(e * 4))
        el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${s}) rotate(${(1 - e) * -40}deg)`

        const label = labelRefs.current[i]
        if (label) {
          const l = range(e, 0.75, 1)
          label.style.opacity = String(l)
          label.style.transform = `translate3d(0, ${(1 - l) * 10}px, 0)`
        }
        const line = lineRefs.current[i]
        if (line) {
          const start = (D * dishScale) / 2 + 6
          const length = Math.max(0, len - start - M / 2 - 6)
          const angle = Math.atan2(t.y, t.x)
          const l = range(e, 0.85, 1)
          line.style.width = `${length}px`
          line.style.transform = `rotate(${angle}rad) translateX(${start}px) scaleX(${l})`
          line.style.opacity = String(l)
        }
      })

      // Rice grains spill out through the gaps between slices.
      const cv = canvasRef.current
      const ctx = cv?.getContext('2d')
      if (cv && ctx) {
        ctx.clearRect(0, 0, cv.width, cv.height)
        if (p > 0.1 && p < 0.76) {
          const dpr = cv.width / Math.max(1, cv.clientWidth)
          const cx = (cv.clientWidth / 2 + offsetX) * dpr
          const cy = (cv.clientHeight / 2 + offsetY) * dpr
          const fadeOut = 1 - range(p, 0.56, 0.74)
          const unit = D * dpr
          for (const g of grains) {
            const gp = range(p, 0.13 + g.delay * 0.18, 0.4 + g.delay * 0.18)
            if (gp <= 0) continue
            const ang = (g.boundary / slices) * TAU - Math.PI / 2 + g.jitter + (dishRot * Math.PI) / 180
            const r = (g.r0 * dishScale + g.dist * easeOutCubic(gp)) * unit
            const a = Math.sin(Math.PI * Math.min(1, gp * 1.1)) * fadeOut
            if (a <= 0.01) continue
            ctx.save()
            ctx.globalAlpha = a
            ctx.translate(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r)
            ctx.rotate(g.rot + gp * 3)
            ctx.fillStyle = g.color
            ctx.beginPath()
            ctx.ellipse(0, 0, unit * 0.013 * g.len, unit * 0.0048, 0, 0, TAU)
            ctx.fill()
            ctx.restore()
          }
        }
      }
    },
    [layout, grains, slices, mobile],
  )

  useMotionValueEvent(scrollYProgress, 'change', (p) => !reduced && apply(p))

  /* Size the canvas to the viewport and paint the current frame on any layout change. */
  useEffect(() => {
    const cv = canvasRef.current
    if (cv) {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      cv.width = Math.round(box.w * dpr)
      cv.height = Math.round(box.h * dpr)
    }
    apply(reduced ? 1 : scrollYProgress.get())
  }, [apply, box, reduced, mobile, scrollYProgress])

  const { D, M, offsetX, offsetY } = layout
  const center = { left: `calc(50% + ${offsetX}px)`, top: `calc(50% + ${offsetY}px)` }
  const current = STAGES[reduced ? 3 : stage]

  return (
    <section
      ref={sectionRef}
      aria-labelledby="decon-title"
      className="on-dark relative bg-char text-cream"
      style={{ height: reduced ? 'auto' : mobile ? '300vh' : '420vh' }}
    >
      <div ref={viewportRef} className={`${reduced ? 'relative h-[100svh] min-h-[720px]' : 'sticky top-0 h-[100svh]'} overflow-hidden`}>
        {/* One warm key light. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(142,36,36,.38)_0%,rgba(21,17,15,0)_55%)]" />
        <p aria-hidden className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[22vw] leading-none text-cream/[0.035]">
          Deconstructed
        </p>

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        {/* Plate shadow */}
        <div
          ref={shadowRef}
          aria-hidden
          className="absolute rounded-full bg-black/60 blur-3xl"
          style={{ ...center, width: D * 1.05, height: D * 1.05, marginTop: D * 0.06 }}
        />

        {/* The dish: one whole photo at rest, wedge slices once it starts to separate. */}
        <div ref={dishRef} className="absolute will-change-transform" style={{ ...center, width: D, height: D }}>
          <div ref={wholeRef} className="absolute inset-0 overflow-hidden rounded-full shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
            <Picture image="dish-topdown" alt="" sizes={`${Math.round(D)}px`} className="block size-full" imgClassName="size-full scale-[1.06] object-cover" />
          </div>
          {Array.from({ length: slices }, (_, k) => (
            <div
              key={k}
              ref={(el) => void (sliceRefs.current[k] = el)}
              aria-hidden
              className="absolute inset-0 opacity-0 will-change-transform"
              style={{ clipPath: wedgeClip(k, slices) }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <Picture image="dish-topdown" alt="" sizes={`${Math.round(D)}px`} className="block size-full" imgClassName="size-full scale-[1.06] object-cover" noPlaceholder />
              </div>
            </div>
          ))}
        </div>

        {/* Connector lines + ingredients */}
        <ul aria-label="Ingredients in our mixed fried rice" className="absolute" style={center}>
          {INGREDIENTS.map((ing, i) => (
            <li key={ing.id}>
              <div
                ref={(el) => void (lineRefs.current[i] = el)}
                aria-hidden
                className="absolute left-0 top-0 h-px origin-left border-t border-dashed border-cream/35 opacity-0"
              />
              <div
                ref={(el) => void (ingRefs.current[i] = el)}
                className="absolute left-0 top-0 opacity-0 will-change-transform"
                style={{ width: M, height: M }}
              >
                <div className="size-full overflow-hidden rounded-full ring-1 ring-cream/25 shadow-[0_20px_40px_-12px_rgba(0,0,0,.7)]">
                  <Picture
                    image={ing.image}
                    alt={ing.label}
                    sizes={`${Math.round(M * 1.5)}px`}
                    className="block size-full"
                    imgClassName="size-full object-cover"
                    imgStyle={ing.zoom ? { transform: `scale(${ing.zoom.scale})`, transformOrigin: ing.zoom.origin } : undefined}
                  />
                </div>
                <div
                  ref={(el) => void (labelRefs.current[i] = el)}
                  className="absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 text-center opacity-0"
                >
                  <p className="eyebrow text-[0.58rem] tracking-[0.12em] text-sand md:text-[0.68rem] md:tracking-[0.22em]">
                    <span className="hidden text-cream/50 md:inline">0{i + 1}</span> {ing.label}
                  </p>
                  <p className="serif-accent hidden text-sm text-cream/70 md:block">{ing.note}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Stage caption */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 px-5 pb-8 md:px-10 md:pb-12">
          <div className="max-w-sm" aria-live="polite">
            <h2 id="decon-title" className="eyebrow mb-3 text-sand">The anatomy of fried rice</h2>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.k}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              >
                <p className="display text-4xl md:text-5xl">
                  <span className="mr-3 text-crimson-bright">{current.k}</span>
                  {current.title}
                </p>
                <p className="mt-2 hidden text-sm leading-relaxed text-cream/70 sm:block md:text-base">{current.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          {!reduced && (
            <div className="hidden items-center gap-2 md:flex" aria-hidden>
              {STAGES.map((s, i) => (
                <span key={s.k} className={`h-1 rounded-full transition-all duration-500 ${i === stage ? 'w-10 bg-cream' : 'w-4 bg-cream/25'}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
