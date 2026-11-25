import { useState } from 'react'
import { motion } from 'framer-motion'
import { Picture } from '../ui/Picture'
import type { ImageKey } from '../../data/images.generated'
import { EASE_OUT_EXPO } from '../../animations/variants'

const CRAVINGS: Array<{ word: string; image: ImageKey; pick: string; alt: string }> = [
  { word: 'Crispy', image: 'crave-crispy', pick: 'Crispy Fried Chicken · Onion Rings', alt: 'Golden fried chicken on a banana leaf' },
  { word: 'Spicy', image: 'crave-spicy', pick: 'Fire Wings · Prawn Fried Rice', alt: 'Charred tandoori chicken glistening with spice' },
  { word: 'Loaded', image: 'crave-loaded', pick: 'Shawarma Plate · Mixed Fried Rice', alt: 'Shawarma chicken piled high over fries with garlic sauce' },
  { word: 'Meaty', image: 'crave-meaty', pick: 'Mixed Grill Platter · Mutton Biriyani', alt: 'A mixed grill board with skewers and grilled meats' },
  { word: 'Fresh', image: 'crave-fresh', pick: 'Fresh Lime Soda · Garden sides', alt: 'A bright bowl of fresh vegetables and leaves' },
]

export function Craving() {
  const [active, setActive] = useState(0)
  const c = CRAVINGS[active]

  return (
    <section aria-labelledby="craving-title" className="on-dark relative isolate min-h-[100svh] overflow-hidden bg-char text-cream">
      {/* All five stay mounted (lazy-loaded as the section nears) so swaps are instant. */}
      {CRAVINGS.map((item, i) => (
        <motion.div
          key={item.image}
          aria-hidden={i !== active}
          className="absolute inset-0 -z-10"
          initial={false}
          animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.08 }}
          transition={{ opacity: { duration: 0.7 }, scale: { duration: 2.2, ease: EASE_OUT_EXPO } }}
        >
          <Picture image={item.image} alt={i === active ? item.alt : ''} sizes="100vw" className="block size-full" imgClassName="size-full object-cover" />
        </motion.div>
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(21,17,15,.9)_0%,rgba(21,17,15,.55)_55%,rgba(21,17,15,.25))]" />

      <div className="mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-center px-5 py-24 md:px-8">
        <h2 id="craving-title" className="eyebrow mb-8 text-sand">What are you craving?</h2>
        <ul className="space-y-0" aria-label="Cravings">
          {CRAVINGS.map((item, i) => {
            const on = i === active
            return (
              <li key={item.word}>
                <button
                  type="button"
                  aria-pressed={on}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-baseline gap-4 text-left md:gap-8"
                >
                  <span className="eyebrow w-6 text-cream/45 tabular-nums">0{i + 1}</span>
                  <span className={`display text-[clamp(3.4rem,10vw,8.5rem)] leading-[0.9] transition-[color,transform,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${on ? 'translate-x-3 text-cream' : 'text-transparent opacity-70 [-webkit-text-stroke:1.5px_rgba(242,230,208,.55)] group-hover:opacity-100'}`}>
                    {item.word}
                  </span>
                  {on && (
                    <motion.span
                      layoutId="craving-pick"
                      className="hidden self-center rounded-full bg-crimson px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] md:inline-block"
                      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                    >
                      Try: {item.pick}
                    </motion.span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-6 text-sm text-cream/75 md:hidden" aria-live="polite">Try: {c.pick}</p>
        <a href="#menu" className="btn-ghost-cream mt-10 self-start">See the full menu</a>
      </div>
    </section>
  )
}
