import { NAV_LINKS, restaurant } from '../../data/restaurant'
import { to12h } from '../../lib/format'
import { Logo } from '../ui/Icons'

const YEAR = new Date().getFullYear()

export function Footer() {
  const loc = restaurant.locations[0]
  return (
    <footer className="on-dark relative overflow-hidden bg-char pt-20 text-cream">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <Logo />
          <p className="serif-accent mt-6 max-w-xs text-2xl leading-snug text-cream/80">{restaurant.tagline}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-2">
          <p className="eyebrow mb-4 text-sand">Explore</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><a href={l.href} className="text-cream/75 hover:text-cream">{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="eyebrow mb-4 text-sand">Visit</p>
          <address className="not-italic text-cream/75">
            {loc.addressLines.map((l) => (<span key={l} className="block">{l}</span>))}
          </address>
          <ul className="mt-4 space-y-1 text-sm text-cream/60">
            {loc.hours.map((h) => (<li key={h.days}>{h.days}: {to12h(h.open)} – {to12h(h.close)}</li>))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-4 text-sand">Talk to us</p>
          <a href={`tel:${restaurant.phoneDisplay.replace(/\s/g, '')}`} className="block text-cream/75 hover:text-cream">{restaurant.phoneDisplay}</a>
          <a href={`mailto:${restaurant.email}`} className="block text-cream/75 hover:text-cream">{restaurant.email}</a>
          <ul className="mt-5 flex gap-2">
            {restaurant.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border border-cream/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] hover:border-olive hover:bg-olive">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p aria-hidden className="display mt-16 select-none whitespace-nowrap text-center text-[17vw] leading-[0.8] text-cream/[0.06]">
        Al Arabian
      </p>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-5 py-6 text-xs text-cream/45 md:flex-row md:justify-between md:px-8">
          <p>© {YEAR} {restaurant.name}. All rights reserved.</p>
          <p>Food photography via Unsplash.</p>
        </div>
      </div>
    </footer>
  )
}
