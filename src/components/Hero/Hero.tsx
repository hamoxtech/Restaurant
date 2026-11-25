import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Picture } from '../ui/Picture'
import { SplitHeadline } from '../ui/SplitHeadline'
import { MagneticButton } from '../ui/MagneticButton'
import { Steam } from '../ui/Steam'
import { ArrowRight, Flame } from '../ui/Icons'
import { useOrder } from '../Order/OrderContext'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'
import { restaurant } from '../../data/restaurant'
import { getItem } from '../../data/menu'
import { formatPrice } from '../../lib/format'
import { EASE_OUT_EXPO } from '../../animations/variants'

const featured = getItem('chicken-fried-rice')

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { reduced } = useMotionPrefs()
  const { setOpen } = useOrder()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Camera drifts down and in while the copy lifts away — a slow push, not a jump.
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-30%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduced ? 1 : 0])

  const intro = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.2, delay, ease: EASE_OUT_EXPO } }

  return (
    <section id="top" ref={ref} aria-label="Welcome" className="on-dark grain relative h-[100svh] min-h-[620px] overflow-hidden bg-char text-cream">
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY, scale: imgScale }}>
        <Picture
          image="hero"
          priority
          sizes="100vw"
          alt="Chicken fried rice glistening in a dark bowl, lit by a single warm shaft of light, with sliced tomato on the side"
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover object-[62%_50%] md:object-[70%_45%] motion-safe:animate-[kenburns_14s_cubic-bezier(.16,1,.3,1)_forwards]"
        />
      </motion.div>

      {/* Legibility: one directional shade + a floor, nothing more. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,17,15,.86)_0%,rgba(21,17,15,.5)_42%,rgba(21,17,15,0)_70%)]" />
      <div className="absolute inset-0 bg-char/35 md:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,rgba(21,17,15,.75),transparent)]" />

      <Steam className="absolute right-[4%] top-[6%] hidden h-[62%] w-[46%] opacity-70 md:block" intensity={0.9} />

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-14 md:px-8 md:pb-20">
        <motion.p {...intro(0.1)} className="eyebrow mb-6 flex items-center gap-3 text-cream/80">
          <span className="inline-flex items-center gap-2 rounded-full bg-olive px-3 py-1.5 text-cream">
            <Flame width={14} height={14} /> Wok-fired since {restaurant.established}
          </span>
          <span className="hidden sm:inline">Fried Rice · Biriyani · Shawarma</span>
        </motion.p>

        <SplitHeadline
          as="h1"
          trigger="mount"
          delay={250}
          className="display text-[clamp(3rem,13.5vw,13.5rem)] text-cream"
          lines={[
            { text: 'Made hot.' },
            { text: 'Served bold.', className: 'text-sand' },
          ]}
        />

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.div {...intro(0.9)} className="max-w-md">
            <p className="text-base leading-relaxed text-cream/85 md:text-lg">
              Rice tossed through a roaring wok, biriyani sealed and slow-steamed, shawarma shaved straight off the spit. Every plate cooked to order — and it shows.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <MagneticButton onClick={() => setOpen(true)} className="btn-red">
                Order Now <ArrowRight width={16} height={16} />
              </MagneticButton>
              <MagneticButton href="#menu" className="btn-ghost-cream">
                Explore the menu
              </MagneticButton>
            </div>
          </motion.div>

          <motion.a
            {...intro(1.1)}
            href="#specials"
            className="group hidden items-center gap-4 self-end rounded-2xl border border-cream/15 bg-char/40 p-3 pr-6 backdrop-blur-sm lg:flex"
          >
            <span className="eyebrow rounded-full bg-crimson px-3 py-1.5 text-[0.62rem]">On the pass</span>
            <span>
              <span className="block font-semibold">{featured.name}</span>
              <span className="block text-sm text-cream/70">{formatPrice(featured.price)}</span>
            </span>
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>
      </motion.div>

      {!reduced && (
        <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex" aria-hidden>
          <span className="eyebrow text-[0.6rem] text-cream/60">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-cream/20">
            <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-cream" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
          </span>
        </div>
      )}
    </section>
  )
}
