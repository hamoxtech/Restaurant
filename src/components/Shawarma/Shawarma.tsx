import { useRef } from 'react'
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Picture } from '../ui/Picture'
import { ScrubVideo } from '../ui/ScrubVideo'
import { AddButton } from '../Order/AddButton'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'
import { useStageIndex } from '../../hooks/useStageIndex'
import { getItem } from '../../data/menu'
import { restaurant } from '../../data/restaurant'
import { formatPrice, range } from '../../lib/format'
import type { ImageKey } from '../../data/images.generated'
import { EASE_OUT_EXPO } from '../../animations/variants'

const FRAMES: Array<{ k: string; title: string; body: string; image: ImageKey; alt: string; item: string }> = [
  { k: '01', title: 'Whole', body: 'Rolled tight around shaved chicken, toum, pickles and fries.', image: 'sh-whole', alt: 'A whole chicken shawarma wrap with fries and salad visible at the open end', item: 'chicken-shawarma' },
  { k: '02', title: 'Sliced', body: 'Cut on the bias so every bite gets a little of everything.', image: 'sh-sliced', alt: 'Shawarma wraps sliced in half showing chicken, cabbage and herbs inside', item: 'cut-shawarma' },
  { k: '03', title: 'Plated', body: 'Opened up over fries with garlic sauce and pickled onion.', image: 'sh-plated', alt: 'Shawarma chicken plated over fries with onion, parsley and garlic sauce', item: 'shawarma-plate' },
  { k: '04', title: 'Served', body: 'The full grill, on the table, ready for the whole crew.', image: 'sh-served', alt: 'A mixed grill board with skewers, chicken, grilled vegetables and dips', item: 'mixed-grill-platter' },
]

const knife = (t: number) => {
  // A diagonal cut sweeping across the frame.
  const a = -40 + t * 180
  return `polygon(0% 0%, ${a + 40}% 0%, ${a}% 100%, 0% 100%)`
}

function FrameLayer({ i, p, mobile }: { i: number; p: MotionValue<number>; mobile: boolean }) {
  const f = FRAMES[i]
  const clip = useTransform(p, (v) => {
    if (i === 0) return 'none'
    if (i === 1) return knife(range(v, 0.18, 0.36))
    if (i === 2) return `circle(${range(v, 0.44, 0.62) * 80}% at 50% 55%)`
    return 'none'
  })
  const scale = useTransform(p, [Math.max(0, (i - 0.6) / 4), (i + 1) / 4], [1.18, 1])
  if (i === 3) return null // the served frame lives outside the card, full-bleed
  return (
    <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: clip }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Picture image={f.image} alt={f.alt} sizes={mobile ? '80vw' : '40vw'} className="block size-full" imgClassName="size-full object-cover" />
      </motion.div>
    </motion.div>
  )
}

export function Shawarma() {
  const ref = useRef<HTMLElement>(null)
  const { reduced, mobile } = useMotionPrefs()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const stage = useStageIndex(p, [0.27, 0.53, 0.76])
  const video = restaurant.videos.shawarma

  const wordX = useTransform(p, [0, 1], ['6%', mobile ? '-62%' : '-38%'])
  const grillY = useTransform(p, [0, 1], ['30%', '-40%'])
  // "Served": the full-bleed layer grows out of the card's exact footprint.
  // First it wipes up inside the card, then the card opens out to full-bleed.
  const served = useTransform(p, (v) => {
    const wipe = range(v, 0.62, 0.72)
    const inv = 1 - range(v, 0.72, 0.9)
    const halfW = mobile ? '39vw' : 'min(19vw, 27vh)'
    const vInset = mobile ? 21 : 13
    const top = (vInset + (100 - 2 * vInset) * (1 - wipe)) * inv
    return `inset(${top}% calc((50% - ${halfW}) * ${inv}) ${vInset * inv}% calc((50% - ${halfW}) * ${inv}) round ${28 * inv}px)`
  })
  const servedVis = useTransform(p, (v) => (v < 0.62 ? 'hidden' : 'visible'))
  const servedScale = useTransform(p, [0.7, 1], [1.25, 1])
  const shade = useTransform(p, [0.82, 0.92], [0, 1])

  if (reduced) {
    return (
      <section id="shawarma" aria-labelledby="shawarma-title" className="on-dark bg-crimson py-24 text-cream">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <h2 id="shawarma-title" className="display text-7xl md:text-9xl">Shawarma</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FRAMES.map((f) => (
              <li key={f.k}>
                <Picture image={f.image} alt={f.alt} sizes="(min-width:1024px) 25vw, 50vw" className="block aspect-[3/4] overflow-hidden rounded-3xl" imgClassName="size-full object-cover" />
                <p className="display mt-4 text-3xl">{f.k} {f.title}</p>
                <p className="text-cream/75">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  const current = FRAMES[stage]
  const item = getItem(current.item)

  return (
    <section id="shawarma" ref={ref} aria-labelledby="shawarma-title" className="on-dark relative bg-crimson text-cream" style={{ height: mobile ? '300vh' : '420vh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Oversized word sliding behind the food */}
        <motion.p aria-hidden style={{ x: wordX }} className="display pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[34vw] leading-none text-crimson-bright/60 md:text-[26vw]">
          Shawarma · Shawarma
        </motion.p>

        {!mobile && (
          <motion.div style={{ y: grillY }} className="absolute right-[7%] top-[18%] w-[15vw] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-cream/20">
            <Picture image="sh-grill" alt="Chicken skewers charring over open coals" sizes="15vw" className="block aspect-[3/4]" imgClassName="size-full object-cover" />
            <p className="eyebrow bg-olive px-3 py-2 text-[0.6rem]">Off the coals</p>
          </motion.div>
        )}

        {video ? (
          <ScrubVideo src={video} progress={p} label="A shawarma being sliced, plated and served" className="absolute inset-0 size-full object-cover" />
        ) : (
          <>
            <div className="absolute left-1/2 top-1/2 h-[58vh] w-[78vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-ink shadow-[0_50px_100px_-30px_rgba(0,0,0,.7)] md:h-[74vh] md:w-[min(38vw,54vh)]">
              {FRAMES.map((_, i) => (
                <FrameLayer key={i} i={i} p={p} mobile={mobile} />
              ))}
            </div>
            <motion.div className="absolute inset-0" style={{ clipPath: served, visibility: servedVis }}>
              <motion.div className="absolute inset-0" style={{ scale: servedScale }}>
                <Picture image="sh-served" alt={FRAMES[3].alt} sizes="100vw" className="block size-full" imgClassName="size-full object-cover" />
              </motion.div>
              <motion.div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(33,27,24,.85),rgba(33,27,24,0)_55%)]" style={{ opacity: shade }} />
            </motion.div>
          </>
        )}

        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-5 pt-24 md:px-10 md:pt-28">
          <div>
            <p className="eyebrow text-sand">Off the spit</p>
            <h2 id="shawarma-title" className="display mt-3 text-[clamp(2.2rem,6vw,5.5rem)]">
              Shaved
              <br className="hidden md:block" />{' '}
              <span className="serif-accent text-sand">to</span> order.
            </h2>
          </div>
          <ol className="hidden gap-5 md:flex" aria-label="Shawarma stages">
            {FRAMES.map((f, i) => (
              <li key={f.k} aria-current={i === stage ? 'step' : undefined} className={`eyebrow transition-colors duration-500 ${i === stage ? 'text-cream' : 'text-cream/40'}`}>
                {f.k} {f.title}
              </li>
            ))}
          </ol>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-5 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-10 md:pb-12" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={current.k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: EASE_OUT_EXPO }} className="max-w-sm">
              <p className="display text-5xl md:text-7xl">
                <span className="text-sand">{current.k}</span> {current.title}
              </p>
              <p className="mt-2 hidden text-cream/80 md:block">{current.body}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-4 rounded-full bg-char/45 p-2 pl-5 backdrop-blur-md">
            <span className="text-sm">
              <span className="block font-semibold">{item.name}</span>
              <span className="text-cream/70">{formatPrice(item.price)}</span>
            </span>
            <AddButton id={item.id} name={item.name} variant="cream" compact />
          </div>
        </div>
      </div>
    </section>
  )
}
