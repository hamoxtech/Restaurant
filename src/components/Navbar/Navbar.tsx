import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { NAV_LINKS, restaurant } from '../../data/restaurant'
import { useOrder } from '../Order/OrderContext'
import { Bag, Close, Logo, Menu as MenuIcon } from '../ui/Icons'
import { MagneticButton } from '../ui/MagneticButton'
import { EASE_OUT_EXPO } from '../../animations/variants'

export function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, setOpen } = useOrder()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 60)
    // Tuck away while reading downward, return on any upward scroll.
    setHidden(y > 900 && y > prev + 4)
    if (y < prev - 4) setHidden(false)
  })

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  const light = !scrolled // over the hero photograph

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-olive focus:px-4 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !mobileOpen ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      >
        <div
          className={`mx-auto flex items-center justify-between px-5 transition-[height,background-color,color,box-shadow,margin,border-radius] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:px-8 ${
            scrolled
              ? 'mt-2 h-16 max-w-[min(1200px,calc(100%-1rem))] rounded-full bg-cream/85 text-ink shadow-[0_8px_30px_-12px_rgba(33,27,24,.35)] backdrop-blur-md'
              : 'h-24 max-w-[1600px] text-cream'
          }`}
        >
          <a href="#top" className="rounded-xl" aria-label={`${restaurant.name} — home`}>
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group relative rounded-full px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.18em]"
                  >
                    {l.label}
                    <span className={`absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${light ? 'bg-cream' : 'bg-crimson'}`} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <MagneticButton onClick={() => setOpen(true)} className={`${light ? 'btn-cream' : 'btn-red'} !py-3 !px-5`} ariaLabel={`Order now${count ? `, ${count} items in your order` : ''}`}>
              <Bag width={16} height={16} />
              <span className="hidden sm:inline">Order Now</span>
              {count > 0 && <span className="badge badge-sm border-0 bg-olive font-bold text-cream tabular-nums">{count}</span>}
            </MagneticButton>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="on-dark fixed inset-0 z-[70] flex flex-col bg-crimson px-6 pb-10 pt-6 text-cream"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" autoFocus className="grid size-11 place-items-center rounded-full border border-cream/30" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <Close />
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-auto">
              <ul className="space-y-1">
                {NAV_LINKS.map((l, i) => (
                  <motion.li key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.8, ease: EASE_OUT_EXPO }}>
                    <a href={l.href} onClick={() => setMobileOpen(false)} className="display block text-[18vw] leading-[0.9]">
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <button type="button" onClick={() => { setMobileOpen(false); setOpen(true) }} className="btn-cream mt-10 w-full">
              Order Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
