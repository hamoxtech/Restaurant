import { motion } from 'framer-motion'
import type { MenuItem } from '../../data/menu'
import { Picture } from '../ui/Picture'
import { AddButton } from '../Order/AddButton'
import { formatPrice } from '../../lib/format'
import { EASE_OUT_EXPO } from '../../animations/variants'

const TAG_LABEL: Record<NonNullable<MenuItem['tags']>[number], string> = {
  spicy: 'Spicy',
  bestseller: 'Bestseller',
  new: 'New',
  veg: 'Vegetarian',
  signature: 'Signature',
}

export function MenuItemRow({ item, index, onActivate, active }: { item: MenuItem; index: number; onActivate: () => void; active: boolean }) {
  return (
    <motion.li
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } } }}
      onPointerEnter={onActivate}
      onFocusCapture={onActivate}
      className="group relative border-b border-ink/12 py-6 md:py-7"
    >
      <article className="flex gap-4 md:gap-6">
        <Picture
          image={item.image}
          alt=""
          sizes="96px"
          className="block size-20 shrink-0 overflow-hidden rounded-2xl md:size-24 lg:hidden"
          imgClassName="size-full object-cover"
        />
        <span className={`eyebrow hidden w-8 pt-3 tabular-nums transition-colors lg:block ${active ? 'text-crimson' : 'text-ink/35'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className={`display text-[1.9rem] transition-colors md:text-[2.6rem] ${active ? 'text-crimson' : 'text-ink'}`}>{item.name}</h3>
            <span className="dotted-leader hidden sm:block" aria-hidden />
            <span className="display shrink-0 text-2xl tabular-nums text-ink md:text-3xl">{formatPrice(item.price)}</span>
          </div>
          <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-ink/70">{item.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {item.tags?.map((t) => (
              <span key={t} className={`badge badge-sm border-0 px-2.5 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] ${t === 'spicy' ? 'bg-crimson/12 text-crimson' : t === 'veg' ? 'bg-olive/12 text-olive' : 'bg-ink/8 text-ink/70'}`}>
                {TAG_LABEL[t]}
              </span>
            ))}
            <span className="ml-auto">
              <AddButton id={item.id} name={item.name} variant={active ? 'red' : 'ghost'} compact />
            </span>
          </div>
        </div>
      </article>
    </motion.li>
  )
}
