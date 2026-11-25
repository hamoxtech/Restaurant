import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { restaurant } from '../../data/restaurant'
import { isOpenNow, to12h } from '../../lib/format'
import { Picture } from '../ui/Picture'
import { SplitHeadline } from '../ui/SplitHeadline'
import { MagneticButton } from '../ui/MagneticButton'
import { useOrder } from '../Order/OrderContext'
import { ArrowUpRight, Clock, Phone, Pin } from '../ui/Icons'
import { fadeUp, stagger, viewportOnce } from '../../animations/variants'

export function Location() {
  const loc = restaurant.locations[0]
  const { setOpen } = useOrder()
  const [showMap, setShowMap] = useState(false)
  const [open, setOpenNow] = useState(() => isOpenNow(loc.hours))

  useEffect(() => {
    const id = window.setInterval(() => setOpenNow(isOpenNow(loc.hours)), 60_000)
    return () => window.clearInterval(id)
  }, [loc.hours])

  return (
    <section id="locations" aria-labelledby="loc-title" className="relative bg-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-8 lg:grid-cols-12 lg:gap-16">
        <motion.div className="lg:col-span-5" initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger(0.08)}>
          <motion.p variants={fadeUp} className="eyebrow mb-4 text-olive">Find us</motion.p>
          <SplitHeadline className="display text-[clamp(3.4rem,8vw,7.5rem)] text-crimson" lines={[{ text: 'Pull up' }, { text: 'a chair.', accent: true, className: 'text-ink' }]} />
          <h2 id="loc-title" className="sr-only">Location and opening hours</h2>

          <motion.div variants={fadeUp} className="mt-10 flex items-center gap-3">
            <span className={`relative inline-flex size-2.5 rounded-full ${open ? 'bg-olive' : 'bg-crimson'}`}>
              {open && <span className="absolute inset-0 rounded-full bg-olive motion-safe:animate-[pulse-ring_2s_ease-out_infinite]" />}
            </span>
            <span className="eyebrow">{open ? 'Open now — the wok is hot' : 'Closed right now'}</span>
          </motion.div>

          <dl className="mt-8 divide-y divide-ink/12 border-y border-ink/12">
            <motion.div variants={fadeUp} className="flex gap-5 py-6">
              <dt className="pt-1 text-crimson"><Pin /><span className="sr-only">Address</span></dt>
              <dd>
                <p className="font-semibold">{loc.name}</p>
                <address className="not-italic text-ink/70">
                  {loc.addressLines.map((l) => (<span key={l} className="block">{l}</span>))}
                </address>
              </dd>
            </motion.div>
            <motion.div variants={fadeUp} className="flex gap-5 py-6">
              <dt className="pt-1 text-crimson"><Clock /><span className="sr-only">Opening hours</span></dt>
              <dd className="w-full">
                <ul className="space-y-1.5">
                  {loc.hours.map((h) => (
                    <li key={h.days} className="flex items-baseline gap-3">
                      <span className="font-semibold">{h.days}</span>
                      <span className="dotted-leader" aria-hidden />
                      <span className="tabular-nums text-ink/70">{to12h(h.open)} – {to12h(h.close)}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </motion.div>
            <motion.div variants={fadeUp} className="flex gap-5 py-6">
              <dt className="pt-1 text-crimson"><Phone /><span className="sr-only">Phone</span></dt>
              <dd>
                <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="font-semibold underline-offset-4 hover:underline">{loc.phone}</a>
                <p className="text-sm text-ink/60">Calls & WhatsApp orders</p>
              </dd>
            </motion.div>
          </dl>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
            <MagneticButton onClick={() => setOpen(true)} className="btn-red">Order online</MagneticButton>
            <MagneticButton href={loc.mapsUrl} external className="btn-ghost-ink">
              Get directions <ArrowUpRight width={16} height={16} />
            </MagneticButton>
          </motion.div>
        </motion.div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-ink lg:col-span-7 lg:min-h-[640px]">
          {showMap ? (
            <iframe
              title={`Map showing ${restaurant.name}`}
              src={loc.mapEmbedUrl}
              className="absolute inset-0 size-full border-0 grayscale-[30%] sepia-[20%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <>
              <Picture image="room-light" alt={`Inside ${restaurant.name}: wooden tables, warm pendant lights and an open kitchen`} sizes="(min-width:1024px) 55vw, 100vw" className="absolute inset-0 block" imgClassName="size-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(21,17,15,.7),transparent_55%)]" />
              <div className="on-dark absolute inset-x-0 bottom-0 flex flex-col gap-4 p-7 text-cream sm:flex-row sm:items-end sm:justify-between">
                <p className="serif-accent max-w-xs text-2xl leading-snug">Dine in, take away, or let us bring the fire to you.</p>
                <button type="button" onClick={() => setShowMap(true)} className="btn-cream shrink-0">
                  <Pin width={16} height={16} /> Show map
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
