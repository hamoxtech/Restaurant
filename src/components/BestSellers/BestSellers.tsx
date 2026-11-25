import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BESTSELLER_IDS, CATEGORIES, getItem } from '../../data/menu'
import { Picture } from '../ui/Picture'
import { SplitHeadline } from '../ui/SplitHeadline'
import { AddButton } from '../Order/AddButton'
import { ArrowLeft, ArrowRight } from '../ui/Icons'
import { formatPrice } from '../../lib/format'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'

const ITEMS = BESTSELLER_IDS.map(getItem)

/**
 * Native horizontal scroll + scroll-snap: inertial and touch-perfect for free.
 * On desktop we add click-and-drag and arrow buttons on top of it.
 */
export function BestSellers() {
  const track = useRef<HTMLOListElement>(null)
  const [progress, setProgress] = useState(0)
  const [edge, setEdge] = useState({ start: true, end: false })
  const { finePointer, reduced } = useMotionPrefs()
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth
      setProgress(max > 0 ? el.scrollLeft / max : 0)
      setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 })
    }
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const step = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 400) + 24), behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section id="specials" aria-labelledby="best-title" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="eyebrow mb-4 text-olive">Bestsellers</p>
          <SplitHeadline className="display text-[clamp(3.4rem,9vw,9rem)] text-crimson" lines={[{ text: 'The usual' }, { text: 'suspects.', accent: true, className: 'text-ink' }]} />
          <span id="best-title" className="sr-only">Bestsellers</span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous bestseller" className="grid size-14 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-cream disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink">
            <ArrowLeft />
          </button>
          <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label="Next bestseller" className="grid size-14 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-cream disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink">
            <ArrowRight />
          </button>
        </div>
      </div>

      <ol
        ref={track}
        aria-label="Bestselling dishes"
        className={`no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-4 md:scroll-px-8 md:px-8 ${finePointer ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onPointerDown={(e) => {
          if (!finePointer || e.pointerType !== 'mouse' || !track.current) return
          drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
          track.current.style.scrollSnapType = 'none'
        }}
        onPointerMove={(e) => {
          if (!drag.current || !track.current) return
          const dx = e.clientX - drag.current.x
          if (Math.abs(dx) > 4) drag.current.moved = true
          track.current.scrollLeft = drag.current.left - dx
        }}
        onPointerUp={() => {
          if (track.current) track.current.style.scrollSnapType = ''
          setTimeout(() => (drag.current = null))
        }}
        onPointerLeave={() => {
          if (track.current) track.current.style.scrollSnapType = ''
          drag.current = null
        }}
        onClickCapture={(e) => drag.current?.moved && e.preventDefault()}
      >
        {ITEMS.map((item, i) => (
          <motion.li
            key={item.id}
            className="group w-[82vw] shrink-0 snap-start sm:w-[58vw] lg:w-[34vw] xl:w-[30vw]"
            initial={reduced ? false : { opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <article className="flex h-full flex-col">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink">
                <Picture
                  image={item.image}
                  alt={item.description}
                  sizes="(min-width:1024px) 34vw, 82vw"
                  className="block size-full"
                  imgClassName="size-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
                />
                <span className="display absolute left-5 top-4 text-[5.5rem] leading-none text-cream/90 [text-shadow:0_4px_30px_rgba(0,0,0,.35)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="eyebrow absolute right-4 top-5 rounded-full bg-olive px-3 py-1.5 text-[0.6rem] text-cream">
                  {CATEGORIES.find((c) => c.id === item.category)?.label}
                </span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="display text-4xl">{item.name}</h3>
                  <p className="mt-1 text-ink/60">{formatPrice(item.price)}</p>
                </div>
                <AddButton id={item.id} name={item.name} compact />
              </div>
            </article>
          </motion.li>
        ))}
      </ol>

      <div className="mx-auto mt-8 max-w-[1600px] px-5 md:px-8" aria-hidden>
        <div className="h-px w-full bg-ink/12">
          <div className="h-px origin-left bg-crimson transition-transform duration-150" style={{ transform: `scaleX(${0.15 + progress * 0.85})` }} />
        </div>
      </div>
    </section>
  )
}
