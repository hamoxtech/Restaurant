import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOrder } from './OrderContext'
import { restaurant } from '../../data/restaurant'
import { formatPrice } from '../../lib/format'
import { Picture } from '../ui/Picture'
import { Close, Minus, Plus, ArrowUpRight, Bag } from '../ui/Icons'
import { EASE_OUT_EXPO } from '../../animations/variants'

type Mode = 'pickup' | 'delivery'

function buildWhatsAppUrl(lines: ReturnType<typeof useOrder>['lines'], total: number, mode: Mode, name: string, note: string) {
  const body = [
    `Hi ${restaurant.name}! I'd like to place an order (${mode}).`,
    '',
    ...lines.map((l) => `• ${l.qty} × ${l.item.name} — ${formatPrice(l.qty * l.item.price)}`),
    '',
    `Total: ${formatPrice(total)}`,
    name ? `Name: ${name}` : null,
    note ? `Note: ${note}` : null,
  ]
    .filter((l): l is string => l !== null)
    .join('\n')
  return `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(body)}`
}

export function OrderDrawer() {
  const { open, setOpen, lines, total, setQty, clear, count } = useOrder()
  const [mode, setMode] = useState<Mode>('pickup')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      // Minimal focus trap.
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,select')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      returnFocus.current?.focus?.()
    }
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="order-title">
          <motion.button
            type="button"
            aria-label="Close order"
            tabIndex={-1}
            className="absolute inset-0 bg-char/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={panelRef}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div>
                <p className="eyebrow text-olive">Your order</p>
                <h2 id="order-title" className="display text-4xl text-crimson">
                  {count ? `${count} item${count > 1 ? 's' : ''}` : 'Empty plate'}
                </h2>
              </div>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-cream" aria-label="Close order">
                <Close />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <Bag width={40} height={40} className="text-crimson" />
                <p className="serif-accent text-2xl">Nothing sizzling yet.</p>
                <p className="text-sm text-ink/70">Add a plate from the menu and it will land here.</p>
                <a href="#menu" onClick={() => setOpen(false)} className="btn-red mt-2">Browse the menu</a>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6" aria-label="Items in your order">
                  {lines.map(({ item, qty }) => (
                    <li key={item.id} className="flex items-center gap-4 py-4">
                      <Picture image={item.image} alt="" sizes="64px" className="size-16 shrink-0 overflow-hidden rounded-full" imgClassName="size-full object-cover" noPlaceholder />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{item.name}</p>
                        <p className="text-sm text-ink/60">{formatPrice(item.price)}</p>
                      </div>
                      <div className="join rounded-full border border-ink/15" role="group" aria-label={`Quantity of ${item.name}`}>
                        <button type="button" className="join-item grid size-9 place-items-center hover:text-crimson" onClick={() => setQty(item.id, qty - 1)} aria-label={`Remove one ${item.name}`}>
                          <Minus width={14} height={14} />
                        </button>
                        <span className="join-item grid w-7 place-items-center text-sm font-semibold tabular-nums" aria-live="polite">{qty}</span>
                        <button type="button" className="join-item grid size-9 place-items-center hover:text-crimson" onClick={() => setQty(item.id, qty + 1)} aria-label={`Add one ${item.name}`}>
                          <Plus width={14} height={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <form
                  className="space-y-4 border-t border-ink/10 bg-cream-dim/50 px-6 py-5"
                  onSubmit={(e) => {
                    e.preventDefault()
                    window.open(buildWhatsAppUrl(lines, total, mode, name.trim(), note.trim()), '_blank', 'noopener')
                  }}
                >
                  <fieldset className="flex gap-2" aria-label="Pickup or delivery">
                    {(['pickup', 'delivery'] as const).map((m) => (
                      <label key={m} className={`flex-1 cursor-pointer rounded-full border py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-olive ${mode === m ? 'border-olive bg-olive text-cream' : 'border-ink/20'}`}>
                        <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                        {m}
                      </label>
                    ))}
                  </fieldset>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="sr-only" htmlFor="order-name">Your name</label>
                    <input id="order-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="rounded-full border border-ink/20 bg-cream px-4 py-2.5 text-sm placeholder:text-ink/45" />
                    <label className="sr-only" htmlFor="order-note">Order note</label>
                    <input id="order-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (e.g. extra spicy)" className="rounded-full border border-ink/20 bg-cream px-4 py-2.5 text-sm placeholder:text-ink/45" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow text-ink/60">Total</span>
                    <span className="display text-4xl text-crimson tabular-nums">{formatPrice(total)}</span>
                  </div>
                  <button type="submit" className="btn-red w-full">
                    Send order on WhatsApp <ArrowUpRight width={16} height={16} />
                  </button>
                  <div className="flex items-center justify-between text-xs text-ink/60">
                    {restaurant.orderOnlineUrl ? (
                      <a href={restaurant.orderOnlineUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Or order on our delivery partner</a>
                    ) : (
                      <a href={`tel:${restaurant.phoneDisplay.replace(/\s/g, '')}`} className="underline underline-offset-4">Or call {restaurant.phoneDisplay}</a>
                    )}
                    <button type="button" onClick={clear} className="underline underline-offset-4 hover:text-crimson">Clear</button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
