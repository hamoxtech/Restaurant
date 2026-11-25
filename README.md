# Al Arabian Delights — website

A cinematic, scroll-driven restaurant site built with React 19, TypeScript, Vite, Tailwind CSS v4 (plus daisyUI), Framer Motion, Anime.js and three.js.

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build
npm run images     # (re)build responsive AVIF/WebP images
```

## Before launch: replace the placeholders

| What | Where |
| --- | --- |
| Address, phone, WhatsApp number, hours, map links, email, socials, delivery-partner URL | `src/data/restaurant.ts` |
| Dish names, descriptions, **prices**, tags, bestsellers | `src/data/menu.ts` |
| Currency symbol (currently `Rs.`) | `restaurant.currency` |
| Restaurant story copy | `src/components/RestaurantStory/RestaurantStory.tsx` (`CHAPTERS`) |
| Optional biriyani / shawarma films | `restaurant.videos` (scroll-scrubbed when set) |

Orders: the **Order** buttons fill a real cart (saved in `localStorage`). Checkout sends the order as a pre-filled WhatsApp message to `restaurant.whatsapp`. If you set `orderOnlineUrl`, a link to your delivery partner appears too.

## Photography

All photos are real food photography from Unsplash (free for commercial use). The sources are listed in `scripts/images.config.mjs`.

To use the restaurant's own photos, put a JPG named after the image key into `assets-src/` (for example `assets-src/hero.jpg` or `assets-src/fr-prawn.jpg`) and run `npm run images`. Your file always wins over the stock source. The script writes AVIF and WebP files at several widths into `public/img/`, plus a typed manifest with 24px blur placeholders in `src/data/images.generated.ts`.

Product hotspots in the fried-rice showcase (`hotspots` in `menu.ts`) are percentage positions on each photo. Re-place them if you swap a photo.

## Structure

```
src/
  components/   one folder per section, plus ui/ (Picture, MagneticButton, SplitHeadline, Steam…) and Order/ (cart)
  data/         menu.ts, restaurant.ts, images.generated.ts
  hooks/        useMotionPrefs, useMagnetic, useStageIndex, useMediaQuery
  animations/   Framer variants + Anime.js choreography
  three/        steam shader (lazy-loaded)
  lib/          price formatting, open-now logic, easing helpers
```

## Motion & performance notes

- **Deconstruction** (`FoodDecomposition`) is driven by one scroll subscription that writes transforms straight to the DOM, so React doesn't re-render every frame. The plate splits into clip-path wedges of the real photo, a 2D canvas spills rice grains (150 on desktop, 56 on mobile), and ingredient photos travel out on arcs.
- **three.js** is used only for the steam shader: one full-screen quad, DPR ≤ 1.5. It loads on desktop only, after idle, when steam is near the viewport, and pauses off-screen. Touch devices get a CSS fallback. React Three Fiber was removed on purpose: for a single draw call it pulled the whole THREE namespace and roughly doubled the chunk size.
- Initial JS is about 175 KB gzipped. The hero image is preloaded as AVIF, and every other image is lazy-loaded with an intrinsic size and a blur placeholder.
- **Responsiveness:** tablet and mobile get shorter pinned sections and a stacked "wok to table" layout.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, every pinned sequence turns into a static editorial layout.
