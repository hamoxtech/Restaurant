/**
 * Image source manifest.
 *
 * Every photo is a real photograph from Unsplash (free commercial licence,
 * https://unsplash.com/license). Swap any entry for the restaurant's own
 * photography by dropping a JPG into `assets-src/` with the same key name
 * (e.g. `assets-src/hero.jpg`) and re-running `npm run images`.
 *
 * widths  – responsive widths generated (AVIF + WebP each)
 * aspect  – optional crop ratio (w/h). Omit to keep the original ratio.
 * focus   – sharp crop position when cropping.
 */
export const IMAGES = {
  // ---- Hero & signature --------------------------------------------------
  hero: { id: '1645177628172-a94c1f96e6db', widths: [640, 1024, 1600, 2200], aspect: 4 / 3 },
  'dish-topdown': { id: '1512058564366-18510be2db19', widths: [480, 800, 1200], aspect: 1, focus: 'centre' },

  // ---- Ingredients (medallions) -----------------------------------------
  'ing-prawn': { id: '1565680018434-b513d5e5fd47', widths: [320, 560], aspect: 1 },
  'ing-chicken': { id: '1626074353765-517a681e40be', widths: [320, 560], aspect: 1 },
  'ing-egg': { id: '1482049016688-2d3e1b311543', widths: [320, 560], aspect: 1, zoom: 1.7 },
  'ing-veg': { id: '1540420773420-3366772f4999', widths: [320, 560], aspect: 1 },
  'ing-onion': { id: '1664717698774-84f62382613b', widths: [320, 560], aspect: 1, zoom: 2.2 },

  // ---- Fried rice -------------------------------------------------------
  'fr-egg': { id: '1664717698774-84f62382613b', widths: [480, 800, 1200, 1600] },
  'fr-chicken': { id: '1645177628172-a94c1f96e6db', widths: [480, 800, 1200, 1600] },
  'fr-chicken-egg': { id: '1647093953000-9065ed6f85ef', widths: [480, 800, 1200, 1600] },
  'fr-mixed': { id: '1512058564366-18510be2db19', widths: [480, 800, 1200, 1600] },
  'fr-prawn': { id: '1559847844-5315695dadae', widths: [480, 800, 1200, 1600] },
  'fr-beef': { id: '1581184953963-d15972933db1', widths: [480, 800, 1200, 1600] },
  'fr-bowl': { id: '1596560548464-f010549b84d7', widths: [480, 800, 1200] },

  // ---- Story (wok to table) ---------------------------------------------
  'story-ingredients': { id: '1504674900247-0877df9cc836', widths: [640, 1024, 1600] },
  'story-wok': { id: '1600565193348-f74bd3c7ccdf', widths: [640, 1024, 1600] },
  'story-cooking': { id: '1604908176997-125f25cc6f3d', widths: [640, 1024, 1600] },
  'story-plating': { id: '1414235077428-338989a2e8c0', widths: [640, 1024, 1600] },
  'story-final': { id: '1512058564366-18510be2db19', widths: [640, 1024, 1600] },

  // ---- Biriyani ---------------------------------------------------------
  'bir-pot': { id: '1642821373181-696a54913e93', widths: [640, 1024, 1600] },
  'bir-handi': { id: '1563379091339-03b21ab4a4f8', widths: [480, 800, 1200] },
  'bir-plated': { id: '1589302168068-964664d93dc0', widths: [640, 1024, 1600] },
  'bir-mutton': { id: '1633945274405-b6c8069047b0', widths: [480, 800, 1200] },
  'bir-bowl': { id: '1630851840633-f96999247032', widths: [480, 800, 1200] },
  'bir-leg': { id: '1631515243349-e0cb75fb8d3a', widths: [480, 800, 1200] },

  // ---- Shawarma ---------------------------------------------------------
  'sh-whole': { id: '1633321702518-7feccafb94d5', widths: [640, 1024, 1600] },
  'sh-sliced': { id: '1626700051175-6818013e1d4f', widths: [640, 1024, 1600] },
  'sh-plated': { id: '1529006557810-274b9b2fc783', widths: [640, 1024, 1600] },
  'sh-served': { id: '1555939594-58d7cb561ad1', widths: [640, 1024, 1600] },
  'sh-grill': { id: '1599487488170-d11ec9c172f0', widths: [480, 800, 1200] },

  // ---- Sides & drinks ---------------------------------------------------
  'side-fries': { id: '1573080496219-bb080dd4f877', widths: [480, 800] },
  'side-rings': { id: '1639024471283-03518883512d', widths: [480, 800] },
  'side-wings': { id: '1608039755401-742074f0548d', widths: [480, 800] },
  'side-crispy': { id: '1569058242253-92a9c755a0ec', widths: [480, 800, 1600] },
  'side-samosa': { id: '1601050690597-df0568f70950', widths: [480, 800] },
  'drink-lime': { id: '1621263764928-df1444c5e859', widths: [480, 800] },
  'drink-mojito': { id: '1599021456807-25db0f974333', widths: [480, 800] },
  'drink-mocktail': { id: '1544145945-f90425340c7e', widths: [480, 800] },

  // ---- Craving / atmosphere --------------------------------------------
  'crave-spicy': { id: '1626074353765-517a681e40be', widths: [800, 1280, 1920] },
  'crave-fresh': { id: '1540420773420-3366772f4999', widths: [800, 1280, 1920] },
  'crave-meaty': { id: '1555939594-58d7cb561ad1', widths: [800, 1280, 1920] },
  'crave-loaded': { id: '1529006557810-274b9b2fc783', widths: [800, 1280, 1920] },
  'crave-crispy': { id: '1569058242253-92a9c755a0ec', widths: [800, 1280, 1920] },
  'room-dark': { id: '1578474846511-04ba529f0b88', widths: [800, 1280, 1920] },
  'room-light': { id: '1517248135467-4c7edcad34c4', widths: [640, 1024, 1600] },
};
