import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { getItem, type MenuItem } from '../../data/menu'

type Lines = Record<string, number>
type Action = { type: 'add'; id: string } | { type: 'set'; id: string; qty: number } | { type: 'clear' }

function reducer(state: Lines, a: Action): Lines {
  switch (a.type) {
    case 'add':
      return { ...state, [a.id]: (state[a.id] ?? 0) + 1 }
    case 'set': {
      const next = { ...state }
      if (a.qty <= 0) delete next[a.id]
      else next[a.id] = Math.min(a.qty, 50)
      return next
    }
    case 'clear':
      return {}
  }
}

const STORAGE_KEY = 'aad-order-v1'
const load = (): Lines => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Lines
    // Drop items that no longer exist on the menu.
    return Object.fromEntries(Object.entries(raw).filter(([id]) => { try { getItem(id); return true } catch { return false } }))
  } catch {
    return {}
  }
}

interface OrderApi {
  lines: Array<{ item: MenuItem; qty: number }>
  count: number
  total: number
  add: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  open: boolean
  setOpen: (v: boolean) => void
  /** Last item added — drives the little toast. */
  lastAdded: { id: string; at: number } | null
}

const Ctx = createContext<OrderApi | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<OrderApi['lastAdded']>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const add = useCallback((id: string) => {
    dispatch({ type: 'add', id })
    setLastAdded({ id, at: Date.now() })
  }, [])
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: 'set', id, qty }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  const value = useMemo<OrderApi>(() => {
    const lines = Object.entries(state).map(([id, qty]) => ({ item: getItem(id), qty }))
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * l.item.price, 0),
      add,
      setQty,
      clear,
      open,
      setOpen,
      lastAdded,
    }
  }, [state, add, setQty, clear, open, lastAdded])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrder() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useOrder must be used inside <OrderProvider>')
  return ctx
}
