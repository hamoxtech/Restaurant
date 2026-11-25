import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { SplitHeadline } from '../ui/SplitHeadline'
import { MagneticButton } from '../ui/MagneticButton'
import { Picture } from '../ui/Picture'
import { useOrder } from '../Order/OrderContext'
import { useMotionPrefs } from '../../hooks/useMotionPrefs'
import { ArrowRight } from '../ui/Icons'

/** Olive seal with circular type that turns slowly with scroll. */
function Seal({ rotate }: { rotate: MotionValue<number> }) {
  return (
    <motion.svg viewBox="0 0 200 200" className="size-32 md:size-40" style={{ rotate }} aria-hidden>
      <circle cx="100" cy="100" r="98" fill="#26382C" />
      <defs>
        <path id="seal-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>
      <text fill="#F2E6D0" fontSize="15.5" fontWeight="700" letterSpacing="5">
        <textPath href="#seal-circle">COOKED TO ORDER • SERVED HOT • COOKED TO ORDER • </textPath>
      </text>
      <path d="M78 112c0-12 10-22 22-22s22 10 22 22" fill="none" stroke="#F2E6D0" strokeWidth="5" strokeLinecap="round" />
      <path d="M72 115h56" stroke="#F2E6D0" strokeWidth="5" strokeLinecap="round" />
    </motion.svg>
  )
}

export function CTA() {
  const ref = useRef<HTMLElement>(null)
  const { setOpen } = useOrder()
  const { reduced } = useMotionPrefs()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 160])
  const plateY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['18%', '-12%'])
  const plateRot = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -25, 0])

  return (
    <section ref={ref} aria-labelledby="cta-title" className="on-dark grain relative overflow-hidden bg-crimson py-28 text-cream md:py-40">
      {/* The plate peeks in from the edge */}
      <motion.div style={{ y: plateY, rotate: plateRot }} className="pointer-events-none absolute -right-[18vw] top-1/2 hidden size-[52vw] max-w-[820px] max-h-[820px] -translate-y-1/2 overflow-hidden rounded-full shadow-[0_60px_120px_-30px_rgba(0,0,0,.6)] md:block" aria-hidden>
        <Picture image="dish-topdown" alt="" sizes="52vw" className="block size-full" imgClassName="size-full scale-[1.06] object-cover" />
      </motion.div>

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-olive" />
          <p className="eyebrow text-cream/80">Last call for the wok</p>
        </div>
        <SplitHeadline
          as="h2"
          className="display mt-6 text-[clamp(5rem,19vw,17rem)] text-cream"
          lines={[{ text: 'Hungry' }, { text: 'yet?', accent: true }]}
        />
        <span id="cta-title" className="sr-only">Hungry yet?</span>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:pr-[28vw]">
          <div>
            <p className="max-w-md text-lg text-cream/85">Order ahead for pickup, have it delivered, or just walk in. The wok is already hot.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton onClick={() => setOpen(true)} className="btn-cream">
                Order now <ArrowRight width={16} height={16} />
              </MagneticButton>
              <MagneticButton href="#menu" className="btn-ghost-cream">
                View menu
              </MagneticButton>
            </div>
          </div>
          <Seal rotate={rotate} />
        </div>
      </div>
    </section>
  )
}
