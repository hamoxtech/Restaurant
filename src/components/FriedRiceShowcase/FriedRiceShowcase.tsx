import { useId, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Picture } from '../ui/Picture'
import { SplitHeadline } from '../ui/SplitHeadline'
import { AddButton } from '../Order/AddButton'
import { getItem, INGREDIENT_LABELS, SHOWCASE_IDS, type IngredientId } from '../../data/menu'
import { IMAGE_META } from '../../data/images.generated'
import { formatPrice } from '../../lib/format'
import { EASE_IN_OUT, EASE_OUT_EXPO } from '../../animations/variants'

const PRODUCTS = SHOWCASE_IDS.map(getItem)

export function FriedRiceShowcase() {
  const [index, setIndex] = useState(3) // open on the loaded one
  const [active, setActive] = useState<IngredientId | null>(null)
  const uid = useId()
  const product = PRODUCTS[index]
  const aspect = IMAGE_META[product.image].aspect
  const spot = product.hotspots?.find((h) => h.ingredient === active)

  const select = (i: number) => {
    setIndex((i + PRODUCTS.length) % PRODUCTS.length)
    setActive(null)
  }
  const onTabKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select(index + 1); focusTab(index + 1) }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select(index - 1); focusTab(index - 1) }
  }
  const focusTab = (i: number) =>
    requestAnimationFrame(() => document.getElementById(`${uid}-tab-${(i + PRODUCTS.length) % PRODUCTS.length}`)?.focus())

  return (
    <section id="fried-rice" aria-labelledby={`${uid}-title`} className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4 text-olive">The fried rice counter</p>
            <SplitHeadline
              className="display text-[clamp(3.4rem,9vw,9rem)] text-crimson"
              lines={[{ text: 'Pick your' }, { text: 'fire.', accent: true, className: 'text-ink' }]}
            />
            <span id={`${uid}-title`} className="sr-only">Fried rice showcase</span>
          </div>
          <p className="max-w-sm text-ink/70">
            Five ways through the wok. Hover or tap an ingredient on the plate to see exactly where it lives.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Product selector */}
          <div role="tablist" aria-label="Fried rice dishes" aria-orientation="vertical" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:col-span-3 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
            {PRODUCTS.map((p, i) => {
              const selected = i === index
              return (
                <button
                  key={p.id}
                  id={`${uid}-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${uid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={onTabKey}
                  className={`group relative flex shrink-0 items-baseline gap-3 rounded-full border px-4 py-2.5 text-left transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-ink/10 lg:px-0 lg:py-5 ${
                    selected ? 'border-crimson bg-crimson text-cream lg:bg-transparent lg:text-crimson' : 'border-ink/15 text-ink/60 hover:text-ink'
                  }`}
                >
                  <span className="eyebrow hidden tabular-nums lg:inline">0{i + 1}</span>
                  <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.12em] lg:display lg:whitespace-normal lg:text-[clamp(1.5rem,2.2vw,2.1rem)] lg:font-extrabold lg:tracking-normal">
                    {p.name}
                  </span>
                  {selected && (
                    <motion.span layoutId={`${uid}-marker`} className="absolute right-0 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-crimson lg:block" transition={{ duration: 0.5, ease: EASE_OUT_EXPO }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Stage */}
          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${index}`} className="grid gap-8 lg:col-span-9 lg:grid-cols-9">
            <div className="relative h-[85vw] sm:h-[min(62vh,560px)] sm:min-h-[340px] rounded-[2rem] bg-cream-dim lg:col-span-6 lg:h-[70vh]" style={{ containerType: 'size' }}>
              <div className="absolute inset-0 grid place-items-center p-3 md:p-6">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={product.id}
                    className="relative overflow-hidden rounded-[1.5rem] shadow-[0_40px_80px_-30px_rgba(33,27,24,.55)]"
                    style={{ width: `min(100cqw - 3rem, (100cqh - 3rem) * ${aspect})`, aspectRatio: aspect }}
                    initial={{ clipPath: 'inset(0% 0% 100% 0% round 24px)', scale: 1.04 }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)', scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.35 } }}
                    transition={{ duration: 0.9, ease: EASE_IN_OUT }}
                  >
                    <motion.div
                      className="size-full"
                      animate={{ scale: spot ? 1.08 : 1 }}
                      style={{ transformOrigin: spot ? `${spot.x}% ${spot.y}%` : '50% 50%' }}
                      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                    >
                      <Picture image={product.image} alt={product.description} sizes="(min-width: 1024px) 45vw, 100vw" className="block size-full" imgClassName="size-full object-cover" />
                    </motion.div>

                    {/* Spotlight: dim everything except the chosen ingredient */}
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-char/65"
                      initial={false}
                      animate={{ opacity: spot ? 1 : 0 }}
                      transition={{ duration: 0.45 }}
                      style={spot ? { maskImage: `radial-gradient(circle at ${spot.x}% ${spot.y}%, transparent 0 11%, #000 24%)`, WebkitMaskImage: `radial-gradient(circle at ${spot.x}% ${spot.y}%, transparent 0 11%, #000 24%)` } : undefined}
                    />

                    {product.hotspots?.map((h, i) => {
                      const on = active === h.ingredient
                      const right = h.x < 62
                      return (
                        <motion.button
                          key={h.ingredient}
                          type="button"
                          className="on-dark absolute z-10 -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${h.x}%`, top: `${h.y}%` }}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: active && !on ? 0.45 : 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: EASE_OUT_EXPO }}
                          onPointerEnter={() => setActive(h.ingredient)}
                          onPointerLeave={() => setActive(null)}
                          onFocus={() => setActive(h.ingredient)}
                          onBlur={() => setActive(null)}
                          onClick={() => setActive(on ? null : h.ingredient)}
                          aria-pressed={on}
                          aria-label={`Highlight ${INGREDIENT_LABELS[h.ingredient]}`}
                        >
                          <span className="relative grid size-5 place-items-center">
                            <span className="absolute inset-0 rounded-full bg-cream/70 motion-safe:animate-[pulse-ring_2.2s_ease-out_infinite]" />
                            <span className={`relative size-3 rounded-full ring-2 ring-cream transition-colors ${on ? 'bg-crimson' : 'bg-olive'}`} />
                          </span>
                          <span
                            className={`absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] shadow-lg transition-colors sm:block ${
                              right ? 'left-7' : 'right-7'
                            } ${on ? 'bg-crimson text-cream' : 'bg-cream/95 text-ink'}`}
                          >
                            {INGREDIENT_LABELS[h.ingredient]}
                          </span>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-end lg:col-span-3">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                >
                  {product.tags?.includes('signature') && <span className="badge mb-4 border-0 bg-olive px-3 py-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-cream">House signature</span>}
                  <h3 className="display text-5xl text-ink md:text-6xl">{product.name}</h3>
                  <p className="mt-4 leading-relaxed text-ink/75">{product.description}</p>

                  <p className="eyebrow mt-8 text-ink/50">What's inside</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {product.ingredients?.map((ing) => {
                      const on = active === ing
                      const hasSpot = product.hotspots?.some((h) => h.ingredient === ing)
                      return (
                        <li key={ing}>
                          <button
                            type="button"
                            disabled={!hasSpot}
                            aria-pressed={on}
                            onPointerEnter={() => hasSpot && setActive(ing)}
                            onPointerLeave={() => setActive(null)}
                            onFocus={() => hasSpot && setActive(ing)}
                            onBlur={() => setActive(null)}
                            onClick={() => setActive(on ? null : ing)}
                            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${on ? 'border-crimson bg-crimson text-cream' : 'border-ink/20 text-ink/80 hover:border-ink'}`}
                          >
                            {INGREDIENT_LABELS[ing]}
                          </button>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
                    <span className="display text-4xl text-crimson tabular-nums">{formatPrice(product.price)}</span>
                    <AddButton id={product.id} name={product.name} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
