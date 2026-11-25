import { useId, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES, itemsIn, type CategoryId } from '../../data/menu'
import { SplitHeadline } from '../ui/SplitHeadline'
import { Picture } from '../ui/Picture'
import { MenuItemRow } from './MenuItemRow'
import { EASE_OUT_EXPO } from '../../animations/variants'

export function Menu() {
  const [cat, setCat] = useState<CategoryId>('fried-rice')
  const items = itemsIn(cat)
  const [hovered, setHovered] = useState<string | null>(null)
  const uid = useId()
  const category = CATEGORIES.find((c) => c.id === cat)!
  const feature = items.find((i) => i.id === hovered) ?? items[0]
  const idx = CATEGORIES.findIndex((c) => c.id === cat)

  const choose = (i: number) => {
    const next = CATEGORIES[(i + CATEGORIES.length) % CATEGORIES.length]
    setCat(next.id)
    setHovered(null)
    requestAnimationFrame(() => document.getElementById(`${uid}-${next.id}`)?.focus())
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); choose(idx + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); choose(idx - 1) }
  }

  return (
    <section id="menu" aria-labelledby={`${uid}-h`} className="relative bg-cream-dim/60 py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="flex flex-col gap-6 border-b border-ink/15 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4 text-olive">Al Arabian Delights — the full menu</p>
            <SplitHeadline className="display text-[clamp(4rem,12vw,12rem)] text-ink" lines={[{ text: 'The menu' }]} />
            <h2 id={`${uid}-h`} className="sr-only">Menu</h2>
          </div>
          <p className="max-w-sm text-ink/70">Everything cooked to order. Prices include tax; ask us about allergens and spice levels.</p>
        </div>

        {/* Category tabs */}
        <div className="sticky top-[4.75rem] z-20 -mx-5 mt-8 bg-transparent px-5 py-2 md:static md:mx-0 md:px-0">
          <div role="tablist" aria-label="Menu categories" className="no-scrollbar flex gap-2 overflow-x-auto rounded-full bg-cream/90 p-1.5 shadow-[0_10px_30px_-18px_rgba(33,27,24,.5)] backdrop-blur md:inline-flex md:shadow-none">
            {CATEGORIES.map((c) => {
              const on = c.id === cat
              return (
                <button
                  key={c.id}
                  id={`${uid}-${c.id}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => { setCat(c.id); setHovered(null) }}
                  onKeyDown={onKey}
                  className={`relative shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${on ? 'text-cream' : 'text-ink/60 hover:text-ink'}`}
                >
                  {on && <motion.span layoutId={`${uid}-pill`} className="absolute inset-0 rounded-full bg-crimson" transition={{ duration: 0.5, ease: EASE_OUT_EXPO }} />}
                  <span className="relative">{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${cat}`} className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Feature image — follows whichever dish you're reading */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={feature.id}
                    className="absolute inset-0"
                    initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                    exit={{ opacity: 0.6 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <motion.div className="size-full" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}>
                      <Picture image={feature.image} alt={feature.name} sizes="(min-width:1024px) 40vw, 0px" className="block size-full" imgClassName="size-full object-cover" imgStyle={feature.focus ? { objectPosition: feature.focus } : undefined} />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(21,17,15,.8),transparent)] p-7 pt-24 text-cream">
                  <p className="eyebrow text-sand">{category.kicker}</p>
                  <p className="serif-accent mt-2 text-2xl leading-snug">{category.blurb}</p>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              key={cat}
              className="lg:col-span-7"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              aria-label={`${category.label} dishes`}
            >
              <li className="mb-6 lg:hidden">
                <p className="eyebrow text-olive">{category.kicker}</p>
                <p className="serif-accent mt-1 text-xl text-ink/80">{category.blurb}</p>
              </li>
              {items.map((item, i) => (
                <MenuItemRow key={item.id} item={item} index={i} onActivate={() => setHovered(item.id)} active={feature.id === item.id} />
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
