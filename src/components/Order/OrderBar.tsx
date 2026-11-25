import { AnimatePresence, motion } from 'framer-motion'
import { useOrder } from './OrderContext'
import { formatPrice } from '../../lib/format'
import { Bag } from '../ui/Icons'
import { EASE_OUT_EXPO } from '../../animations/variants'

/** Floating "view order" bar — appears once something is in the order. */
export function OrderBar() {
  const { count, total, setOpen, open } = useOrder()
  return (
    <AnimatePresence>
      {count > 0 && !open && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="fixed bottom-4 left-1/2 z-40 flex w-[min(92vw,420px)] -translate-x-1/2 items-center justify-between gap-4 rounded-full bg-olive py-2.5 pl-5 pr-2.5 text-cream shadow-[0_20px_50px_-15px_rgba(21,17,15,.6)]"
          aria-label={`View your order: ${count} items, ${formatPrice(total)}`}
        >
          <span className="flex items-center gap-3 text-sm font-semibold">
            <Bag width={18} height={18} />
            {count} item{count > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-cream/80">{formatPrice(total)}</span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-olive">View order</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
