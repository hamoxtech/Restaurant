import { useRef } from 'react'
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Picture } from '../ui/Picture'
import { SplitHeadline } from '../ui/SplitHeadline'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'
import { useStageIndex } from '../../hooks/useStageIndex'
import type { ImageKey } from '../../data/images.generated'
import { EASE_OUT_EXPO, maskReveal, fadeUp, viewportOnce } from '../../animations/variants'

interface Step {
  key: string
  title: string
  body: string
  image: ImageKey
  alt: string
}

const STEPS: Step[] = [
  { key: 'ingredients', title: 'Ingredients', body: 'Delivered every morning. Chicken marinated overnight, prawns cleaned by hand, greens cut to order.', image: 'story-ingredients', alt: 'Fresh ingredients laid out on a wooden table: greens, chillies, cashews and sliced meat' },
  { key: 'wok', title: 'The wok', body: 'Carbon steel, seasoned for years and heated until it smokes. Nothing goes in until it is ready.', image: 'story-wok', alt: 'A chef tossing food in a wok over leaping flames in a restaurant kitchen' },
  { key: 'cooking', title: 'Cooking', body: 'Forty seconds of fire. Protein first, then rice, then the toss that gives it that smoky wok hei.', image: 'story-cooking', alt: 'Chicken and vegetables stir-frying in a black pan, topped with fresh basil' },
  { key: 'plating', title: 'Plating', body: 'Shaped, garnished and checked at the pass by the chef who cooked it.', image: 'story-plating', alt: 'A carefully plated dish on a white plate at a candle-lit restaurant table' },
  { key: 'final', title: 'The table', body: 'Hot, loud and generous. Exactly as it left the wok.', image: 'story-final', alt: 'Mixed fried rice in a black pan with lemon wedges, shared at the table' },
]

function Layer({ step, i, progress }: { step: Step; i: number; progress: MotionValue<number> }) {
  const n = STEPS.length
  const at = i / n
  const reveal = useTransform(progress, [at - 0.06, at + 0.04], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'])
  const scale = useTransform(progress, [at - 0.1, at + 0.25], [1.28, 1])
  const y = useTransform(progress, [at - 0.1, at + 0.3], ['8%', '-4%'])
  return (
    <motion.div className="absolute inset-0 overflow-hidden" style={i === 0 ? undefined : { clipPath: reveal }}>
      <motion.div className="absolute inset-[-6%] will-change-transform" style={{ scale, y }}>
        <Picture image={step.image} alt={step.alt} sizes="(min-width: 1024px) 50vw, 100vw" className="block size-full" imgClassName="size-full object-cover" />
      </motion.div>
    </motion.div>
  )
}

function Pinned() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const active = useStageIndex(scrollYProgress, [0.2, 0.4, 0.6, 0.8])
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const step = STEPS[active]

  return (
    <div ref={ref} style={{ height: `${STEPS.length * 90}vh` }} className="relative">
      <div className="sticky top-0 grid h-[100svh] grid-cols-12 items-center gap-8 px-8 pt-20 pb-10 xl:px-14">
        <div className="col-span-5 flex h-full flex-col justify-center">
          <p className="eyebrow mb-5 text-olive">The process</p>
          <SplitHeadline className="display text-[clamp(4rem,8vw,8.5rem)] text-crimson" lines={[{ text: 'From wok' }, { text: 'to table.', accent: true, className: 'text-ink' }]} />

          <ol className="mt-10 space-y-1" aria-label="Steps from wok to table">
            {STEPS.map((s, i) => (
              <li key={s.key} aria-current={i === active ? 'step' : undefined} className="flex items-baseline gap-4">
                <span className={`eyebrow w-8 tabular-nums transition-colors duration-500 ${i === active ? 'text-crimson' : 'text-ink/35'}`}>0{i + 1}</span>
                <span className={`display text-3xl transition-all duration-500 ${i === active ? 'translate-x-1 text-ink' : 'text-ink/25'}`}>{s.title}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8 h-20 max-w-md">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={step.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                className="text-lg leading-relaxed text-ink/75"
              >
                {step.body}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="mt-4 h-px w-full max-w-md bg-ink/10">
            <motion.div className="h-px bg-crimson" style={{ width: bar }} />
          </div>
        </div>

        <div className="relative col-span-7 h-[78vh] overflow-hidden rounded-[2rem] bg-ink">
          {STEPS.map((s, i) => (
            <Layer key={s.key} step={s} i={i} progress={scrollYProgress} />
          ))}
          <div className="absolute left-5 top-5 z-10 rounded-full bg-cream/90 px-4 py-2 backdrop-blur">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={step.key} className="eyebrow block text-ink" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
                0{active + 1} / {step.title}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stacked({ reduced }: { reduced: boolean }) {
  return (
    <div className="px-5 pb-24 pt-24 md:px-8">
      <p className="eyebrow mb-4 text-olive">The process</p>
      <SplitHeadline className="display text-[clamp(3.5rem,16vw,7rem)] text-crimson" lines={[{ text: 'From wok' }, { text: 'to table.', accent: true, className: 'text-ink' }]} />
      <ol className="mt-12 space-y-14">
        {STEPS.map((s, i) => (
          <motion.li key={s.key} initial={reduced ? false : 'hidden'} whileInView="show" viewport={viewportOnce}>
            <motion.div variants={maskReveal} className="aspect-[4/3] overflow-hidden rounded-3xl md:aspect-[16/9]">
              <Picture image={s.image} alt={s.alt} sizes="100vw" className="block size-full" imgClassName="size-full object-cover" />
            </motion.div>
            <motion.div variants={fadeUp} className="mt-5 flex gap-4">
              <span className="eyebrow pt-2 text-crimson">0{i + 1}</span>
              <div>
                <h3 className="display text-4xl">{s.title}</h3>
                <p className="mt-2 text-ink/75">{s.body}</p>
              </div>
            </motion.div>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

export function FoodStory() {
  const { reduced, tablet } = useMotionPrefs()
  return (
    <section id="process" aria-label="From wok to table" className="relative bg-cream">
      {reduced || tablet ? <Stacked reduced={reduced} /> : <Pinned />}
    </section>
  )
}
