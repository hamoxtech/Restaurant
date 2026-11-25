import { useRef } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Picture } from '../ui/Picture'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'
import { useStageIndex } from '../../hooks/useStageIndex'
import { restaurant } from '../../data/restaurant'
import { EASE_OUT_EXPO, fadeUp, viewportOnce } from '../../animations/variants'

// ⚠️ Placeholder story — replace with the restaurant's own history.
const CHAPTERS = [
  {
    kicker: `${restaurant.established} — The beginning`,
    title: 'It started with one wok.',
    body: `${restaurant.name} began as a small counter with a single carbon-steel wok and a family recipe for biriyani. The queue did the marketing.`,
  },
  {
    kicker: 'Two kitchens, one table',
    title: 'Fire from both sides.',
    body: 'Arabian grill and South Asian rice traditions, cooked side by side — shawarma off the spit next to biriyani sealed for dum.',
  },
  {
    kicker: 'Today',
    title: 'Still cooked to order.',
    body: 'We have grown, but nothing waits under a heat lamp. Every plate leaves the pass seconds after it leaves the fire.',
  },
]

export function RestaurantStory() {
  const ref = useRef<HTMLElement>(null)
  const { reduced, tablet } = useMotionPrefs()
  const pinned = !reduced && !tablet
  const { scrollYProgress } = useScroll({ target: ref, offset: pinned ? ['start start', 'end end'] : ['start end', 'end start'] })
  const chapter = useStageIndex(scrollYProgress, [0.36, 0.68])
  // The photograph drifts slowly for the whole section — a long, steady camera move.
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-6%', '6%'])
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.18, 1.04])
  const c = CHAPTERS[chapter]

  if (!pinned) {
    return (
      <section id="story" ref={ref} aria-labelledby="story-title" className="relative bg-cream py-24">
        <div className="relative mx-5 h-[70vh] overflow-hidden rounded-[2rem] md:mx-8">
          <motion.div className="absolute inset-0" style={{ y, scale }}>
            <Picture image="room-dark" alt="The warmly lit dining room in the evening, tables set and waiting" sizes="100vw" className="block size-full" imgClassName="size-full object-cover" />
          </motion.div>
          <h2 id="story-title" className="display absolute bottom-6 left-6 right-6 text-6xl text-cream">Our story</h2>
        </div>
        <div className="space-y-14 px-5 pt-14 md:px-8">
          {CHAPTERS.map((ch) => (
            <motion.div key={ch.title} initial={reduced ? false : 'hidden'} whileInView="show" viewport={viewportOnce} variants={fadeUp}>
              <p className="eyebrow text-olive">{ch.kicker}</p>
              <h3 className="display mt-3 text-5xl text-crimson">{ch.title}</h3>
              <p className="mt-3 max-w-xl text-lg text-ink/75">{ch.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="story" ref={ref} aria-labelledby="story-title" className="relative bg-cream" style={{ height: '320vh' }}>
      <div className="sticky top-0 grid h-[100svh] grid-cols-12 items-center gap-10 px-8 xl:px-14">
        <div className="relative col-span-5 xl:col-span-4">
          <h2 id="story-title" className="eyebrow text-olive">Our story</h2>
          <div className="relative mt-6 min-h-[26rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={chapter} initial="hidden" animate="show" exit="exit" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } }, exit: { opacity: 0, y: -16, transition: { duration: 0.35 } } }}>
                <motion.p variants={fadeUp} className="eyebrow text-ink/50">{c.kicker}</motion.p>
                <motion.h3 variants={fadeUp} className="display mt-4 text-[clamp(3.6rem,6.2vw,6.6rem)] text-crimson">{c.title}</motion.h3>
                <motion.p variants={fadeUp} className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">{c.body}</motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex gap-2" aria-hidden>
            {CHAPTERS.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === chapter ? 'w-12 bg-crimson' : 'w-5 bg-ink/15'}`} />
            ))}
          </div>
        </div>

        <div className="relative col-span-7 h-[84vh] overflow-hidden rounded-[2.25rem] xl:col-span-8">
          <motion.div className="absolute inset-0 will-change-transform" style={{ y, scale }}>
            <Picture image="room-dark" alt="The warmly lit dining room in the evening, tables set and waiting" sizes="62vw" className="block size-full" imgClassName="size-full object-cover" />
          </motion.div>
          <motion.blockquote
            className="absolute bottom-8 left-8 max-w-md rounded-3xl bg-olive/90 p-7 text-cream backdrop-blur"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          >
            <p className="serif-accent text-2xl leading-snug">“If it didn't come off a fire in the last minute, it doesn't leave the kitchen.”</p>
            <footer className="eyebrow mt-4 text-cream/70">— The house rule</footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  )
}
