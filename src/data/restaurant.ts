/**
 * Restaurant details. Everything customer-facing that is not a dish lives here.
 * ⚠️ Address, phone, hours and links are PLACEHOLDERS — replace with real values.
 */
export interface OpeningHours {
  days: string
  /** Day indexes covered, 0 = Sunday … 6 = Saturday. */
  dayIndexes: readonly number[]
  /** 24h "HH:MM". A close earlier than open means past midnight. */
  open: string
  close: string
}

export interface Location {
  id: string
  name: string
  addressLines: readonly string[]
  phone: string
  /** Opens Google Maps directions without loading an embedded map. */
  mapsUrl: string
  /** Only loaded when the visitor explicitly asks to see the map. */
  mapEmbedUrl: string
  hours: readonly OpeningHours[]
}

export const restaurant = {
  name: 'Al Arabian Delights',
  shortName: 'Al Arabian',
  tagline: 'Made hot. Served bold.',
  established: 2016,
  currency: 'Rs.',
  /** Digits only, international format, used for wa.me order links. */
  whatsapp: '94770000000',
  phoneDisplay: '+94 77 000 0000',
  email: 'hello@alarabiandelights.example',
  /** External ordering platform. Leave empty to order via WhatsApp only. */
  orderOnlineUrl: '',
  /**
   * Optional scroll-scrubbed films (compressed MP4/WebM, ≤ 4 MB, 720p, all-keyframe
   * encoding scrubs best: `ffmpeg -i in.mov -vf scale=1280:-2 -g 1 -crf 28 -an out.mp4`).
   * When empty, the sections use layered photography instead.
   */
  videos: {
    biriyani: '',
    shawarma: '',
  },
  social: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'Facebook', href: 'https://facebook.com/' },
    { label: 'TikTok', href: 'https://tiktok.com/' },
  ],
  locations: [
    {
      id: 'main',
      name: 'The Flagship',
      addressLines: ['123 Main Street', 'Your City 10000'],
      phone: '+94 77 000 0000',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Al+Arabian+Delights',
      mapEmbedUrl: 'https://www.google.com/maps?q=Al+Arabian+Delights&output=embed',
      hours: [
        { days: 'Mon – Thu', dayIndexes: [1, 2, 3, 4], open: '11:00', close: '23:00' },
        { days: 'Fri – Sun', dayIndexes: [5, 6, 0], open: '11:00', close: '01:00' },
      ],
    },
  ] satisfies readonly Location[],
} as const

export const NAV_LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Story', href: '#story' },
  { label: 'Specials', href: '#specials' },
  { label: 'Locations', href: '#locations' },
] as const
