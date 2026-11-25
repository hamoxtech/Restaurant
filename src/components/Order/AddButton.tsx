import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOrder } from './OrderContext'
import { Plus } from '../ui/Icons'

/** "Add to order" with a brief confirmation state. */
export function AddButton({ id, name, variant = 'red', compact = false }: { id: string; name: string; variant?: 'red' | 'olive' | 'cream' | 'ghost'; compact?: boolean }) {
  const { add } = useOrder()
  const [done, setDone] = useState(false)
  const cls = { red: 'btn-red', olive: 'btn-olive', cream: 'btn-cream', ghost: 'btn-ghost-ink' }[variant]
  return (
    <button
      type="button"
      aria-label={`Add ${name} to your order`}
      onClick={() => {
        add(id)
        setDone(true)
        window.setTimeout(() => setDone(false), 1400)
      }}
      className={`${cls} ${compact ? '!px-4 !py-2.5 !text-[0.7rem]' : ''} relative overflow-hidden`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={done ? 'done' : 'add'}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2"
        >
          {done ? 'Added' : (<><Plus width={16} height={16} /> {compact ? 'Add' : 'Order'}</>)}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
