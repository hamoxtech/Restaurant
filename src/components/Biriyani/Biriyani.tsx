import { useRef } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Picture } from '../ui/Picture'
import { Steam } from '../ui/Steam'
import { ScrubVideo } from '../ui/ScrubVideo'
import { AddButton } from '../Order/AddButton'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'
import { useStageIndex } from '../../hooks/useStageIndex'
import { getItem } from '../../data/menu'
import { restaurant } from '../../data/restaurant'
import { formatPrice } from '../../lib/format'
import { EASE_OUT_EXPO } from '../../animations/variants'

const dish = getItem('chicken-biriyani')

const BEATS = [
  { k: 'Sealed', line: 'Dough-sealed. Dum-cooked. Nobody peeks.' },
  { k: 'The lid', line: 'Ninety minutes on a low flame, then the seal breaks.' },
  { k: 'The steam', line: 'Saffron, ghee and rosewater, all at once.' },
  { k: 'Revealed', line: 'Long-grain basmati, layered over spiced chicken.' },
  { k: 'Served', line: 'Raita, salan and a boiled egg on the side.' },
]

/** A brass handi lid, built from light rather than drawn: gradients, rings and a cast knob. */
function Lid() {
  return (
    <div className="relative size-full rounded-full shadow-[0_30px_60px_-10px_rgba(0,0,0,.85)]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_28%,#e2c48c_0%,#b48a4c_22%,#7a5427_55%,#3d2812_85%,#24170a_100%)]" />
      <div className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay bg-[repeating-radial-gradient(circle_at_50%_50%,rgba(255,255,255,.22)_0_1px,transparent_1px_7px)]" />
      <div className="absolute inset-[7%] rounded-full shadow-[inset_0_2px_6px_rgba(255,230,180,.35),inset_0_-6px_14px_rgba(0,0,0,.45)]" />
      <div className="absolute inset-[30%] rounded-full shadow-[inset_0_1px_3px_rgba(255,230,180,.4),0_2px_8px_rgba(0,0,0,.5)]" />
      {/* Knob */}
      <div className="absolute left-1/2 top-1/2 size-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_38%_30%,#f3dcaa,#9b6e35_55%,#3a2611)] shadow-[0_10px_18px_rgba(0,0,0,.6)]" />
      <div className="grain absolute inset-0 overflow-hidden rounded-full" />
    </div>
  )
}

export function Biriyani() {
  const ref = useRef<HTMLElement>(null)
  const { reduced, mobile } = useMotionPrefs()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const beat = useStageIndex(p, [0.12, 0.34, 0.5, 0.7])
  const video = restaurant.videos.biriyani

  // Dough seal cracks, then the lid lifts and tilts away toward the camera.
  const sealOpacity = useTransform(p, [0.06, 0.16], [1, 0])
  const lidY = useTransform(p, [0.12, 0.38], ['0%', '-115%'])
  const lidRotX = useTransform(p, [0.12, 0.38], [0, 58])
  const lidRot = useTransform(p, [0.12, 0.38], [0, -14])
  const lidOpacity = useTransform(p, [0.3, 0.4], [1, 0])
  const shade = useTransform(p, [0.1, 0.4], [0.72, 0])
  const steam = useTransform(p, [0.26, 0.4, 0.6, 0.72], [0, 1, 1, 0])
  const push = useTransform(p, [0.42, 0.68], [1, mobile ? 1.15 : 1.28])
  const plate = useTransform(p, [0.66, 0.86], ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'])
  const plateScale = useTransform(p, [0.66, 0.95], [1.2, 1])
  const cardOpacity = useTransform(p, [0.84, 0.92], [0, 1])
  const cardY = useTransform(p, [0.84, 0.92], [30, 0])
  const cardVis = useTransform(cardOpacity, (v) => (v < 0.04 ? 'hidden' : 'visible'))
  const captionOpacity = useTransform(cardOpacity, (v) => (mobile ? 1 - v : 1))

  const D = mobile ? 'min(78vw,44vh)' : 'min(56vh,40vw)'

  if (reduced) {
    return (
      <section aria-labelledby="biriyani-title" className="on-dark bg-ink py-24 text-cream">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:grid-cols-2 md:px-8">
          <Picture image="bir-plated" alt="Chicken biriyani plated with cucumber, raita and salan" className="block overflow-hidden rounded-3xl" imgClassName="h-full w-full object-cover" sizes="(min-width:768px) 50vw, 100vw" />
          <div className="self-center">
            <p className="eyebrow text-sand">Dum-cooked daily</p>
            <h2 id="biriyani-title" className="display mt-4 text-7xl">Chicken Biriyani</h2>
            <p className="mt-4 text-cream/75">{dish.description}</p>
            <div className="mt-8 flex items-center gap-6"><span className="display text-4xl">{formatPrice(dish.price)}</span><AddButton id={dish.id} name={dish.name} variant="cream" /></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} aria-labelledby="biriyani-title" className="on-dark relative bg-ink text-cream" style={{ height: mobile ? '320vh' : '480vh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {video ? (
          <ScrubVideo src={video} progress={p} label="A biriyani handi being opened and served" className="absolute inset-0 size-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(38,56,44,.55),rgba(33,27,24,0)_60%)]" />

            {/* The vessel */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: D, height: D, scale: push }}>
              <div className="absolute -inset-[6%] rounded-full bg-[radial-gradient(circle,#5a2f17_0%,#3a1d0e_62%,transparent_70%)]" aria-hidden />
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <Picture
                  image="bir-pot"
                  alt="Saffron-streaked biriyani in a clay pot, garnished with mint and fried onion"
                  sizes="(min-width:768px) 60vw, 90vw"
                  className="block size-full"
                  imgClassName="size-full scale-[2.05] object-cover"
                  imgStyle={{ transformOrigin: '37% 52%' }}
                />
                <motion.div className="absolute inset-0 bg-black" style={{ opacity: shade }} />
              </div>
              {/* Dum seal */}
              <motion.div aria-hidden style={{ opacity: sealOpacity }} className="absolute -inset-[3%] rounded-full border-[10px] border-[#d8bf91] [border-style:solid] shadow-[inset_0_0_8px_rgba(0,0,0,.4)] [mask-image:radial-gradient(circle,transparent_60%,#000_61%)]" />
              {/* Lid */}
              <div className="absolute inset-0 [perspective:900px]">
                <motion.div className="size-full origin-[50%_0%] will-change-transform" style={{ y: lidY, rotateX: lidRotX, rotate: lidRot, opacity: lidOpacity }}>
                  <Lid />
                </motion.div>
              </div>
            </motion.div>

            <motion.div className="absolute left-1/2 top-[44%] h-[70vh] w-[min(90vw,70vh)] -translate-x-1/2 -translate-y-1/2" style={{ opacity: steam }}>
              <Steam className="absolute inset-0" />
            </motion.div>

            {/* Plated serving — expands out of the vessel */}
            <motion.div className="absolute inset-0" style={{ clipPath: plate }}>
              <motion.div className="absolute inset-0" style={{ scale: plateScale }}>
                <Picture image="bir-plated" alt="Chicken biriyani served on a white plate with cucumber, raita and salan" sizes="100vw" className="block size-full" imgClassName="size-full object-cover object-[50%_60%]" />
              </motion.div>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(33,27,24,.82),rgba(33,27,24,.1)_60%)]" />
            </motion.div>
          </>
        )}

        {/* Copy */}
        <div className="absolute inset-x-0 top-0 z-10 px-5 pt-24 md:px-10 md:pt-28">
          <p className="eyebrow text-sand">The biriyani ritual</p>
          <h2 id="biriyani-title" className="display mt-3 text-[clamp(3rem,8vw,7.5rem)]">
            Lift <span className="serif-accent text-sand">the</span> lid.
          </h2>
        </div>

        <motion.div style={{ opacity: captionOpacity }} className="absolute bottom-0 left-0 z-10 px-5 pb-10 md:px-10 md:pb-14" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={beat} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}>
              <p className="eyebrow text-cream/50">0{beat + 1} — {BEATS[beat].k}</p>
              <p className="serif-accent mt-2 max-w-md text-2xl md:text-3xl">{BEATS[beat].line}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.aside
          style={{ opacity: cardOpacity, y: cardY, visibility: cardVis }}
          className="absolute bottom-10 right-5 z-20 w-[min(88vw,360px)] rounded-3xl bg-cream p-6 text-ink shadow-2xl md:bottom-14 md:right-10"
          aria-label={`${dish.name} — ${formatPrice(dish.price)}`}
        >
          <p className="eyebrow text-olive">Most ordered</p>
          <h3 className="display mt-2 text-4xl">{dish.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">{dish.description}</p>
          <div className="mt-5 flex items-center justify-between">
            <span className="display text-3xl text-crimson">{formatPrice(dish.price)}</span>
            <AddButton id={dish.id} name={dish.name} compact />
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
