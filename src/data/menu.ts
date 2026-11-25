import type { ImageKey } from './images.generated'

/**
 * The menu — single source of truth for every section that shows a dish.
 * ⚠️ Prices are PLACEHOLDERS — update them to the real menu.
 */

export type CategoryId = 'fried-rice' | 'biriyani' | 'shawarma' | 'sides' | 'drinks'

export type IngredientId =
  | 'prawn'
  | 'chicken'
  | 'egg'
  | 'vegetables'
  | 'spring-onion'
  | 'tomato'
  | 'coriander'
  | 'lemon'
  | 'mutton'
  | 'rice'
  | 'sambal'
  | 'crackers'

export interface Hotspot {
  ingredient: IngredientId
  /** Position on the photo, in percent of its width / height. */
  x: number
  y: number
}

export interface MenuItem {
  id: string
  category: CategoryId
  name: string
  description: string
  price: number
  image: ImageKey
  tags?: Array<'spicy' | 'bestseller' | 'new' | 'veg' | 'signature'>
  ingredients?: IngredientId[]
  hotspots?: Hotspot[]
  /** Optional CSS object-position for tight crops. */
  focus?: string
}

export interface Category {
  id: CategoryId
  label: string
  kicker: string
  blurb: string
}

export const CATEGORIES: Category[] = [
  { id: 'fried-rice', label: 'Fried Rice', kicker: 'Wok-fired', blurb: 'Day-old rice, a screaming-hot wok and forty seconds of fire. That is where the smoke comes from.' },
  { id: 'biriyani', label: 'Biriyani', kicker: 'Dum-cooked', blurb: 'Layered, sealed and slow-steamed until every grain carries saffron, ghee and spice.' },
  { id: 'shawarma', label: 'Shawarma', kicker: 'Off the spit', blurb: 'Marinated overnight, shaved to order, wrapped hot with garlic toum and pickles.' },
  { id: 'sides', label: 'Sides', kicker: 'For the table', blurb: 'Crunchy, golden and made to be shared — or not.' },
  { id: 'drinks', label: 'Drinks', kicker: 'Ice cold', blurb: 'Fresh-pressed limes, mint and something cold to put the fire out.' },
]

export const INGREDIENT_LABELS: Record<IngredientId, string> = {
  prawn: 'Prawn',
  chicken: 'Chicken',
  egg: 'Egg',
  vegetables: 'Vegetables',
  'spring-onion': 'Spring Onion',
  tomato: 'Tomato',
  coriander: 'Coriander',
  lemon: 'Lemon',
  mutton: 'Mutton',
  rice: 'Wok Rice',
  sambal: 'Chilli Sambal',
  crackers: 'Prawn Crackers',
}

export const MENU: MenuItem[] = [
  // ------------------------------------------------------------------ FRIED RICE
  {
    id: 'egg-fried-rice',
    category: 'fried-rice',
    name: 'Egg Fried Rice',
    description: 'Silky scrambled egg folded through smoky wok rice, carrot, peas and a fistful of spring onion.',
    price: 950,
    image: 'fr-egg',
    tags: ['veg'],
    ingredients: ['egg', 'spring-onion', 'vegetables', 'rice'],
    hotspots: [
      { ingredient: 'egg', x: 46, y: 44 },
      { ingredient: 'spring-onion', x: 63, y: 33 },
      { ingredient: 'vegetables', x: 37, y: 64 },
      { ingredient: 'rice', x: 58, y: 70 },
    ],
  },
  {
    id: 'chicken-fried-rice',
    category: 'fried-rice',
    name: 'Chicken Fried Rice',
    description: 'Charred chicken thigh, garlic, soy and white pepper tossed hard over a roaring flame.',
    price: 1250,
    image: 'fr-chicken',
    tags: ['bestseller'],
    ingredients: ['chicken', 'tomato', 'vegetables', 'spring-onion'],
    hotspots: [
      { ingredient: 'tomato', x: 22, y: 45 },
      { ingredient: 'chicken', x: 64, y: 47 },
      { ingredient: 'vegetables', x: 40, y: 61 },
      { ingredient: 'spring-onion', x: 72, y: 36 },
    ],
  },
  {
    id: 'chicken-egg-fried-rice',
    category: 'fried-rice',
    name: 'Chicken Egg Fried Rice',
    description: 'Our chicken fried rice crowned with a crisp-edged fried egg, sambal and prawn crackers.',
    price: 1390,
    image: 'fr-chicken-egg',
    ingredients: ['chicken', 'egg', 'vegetables', 'sambal', 'crackers'],
    hotspots: [
      { ingredient: 'egg', x: 70, y: 40 },
      { ingredient: 'chicken', x: 27, y: 64 },
      { ingredient: 'vegetables', x: 17, y: 42 },
      { ingredient: 'sambal', x: 46, y: 33 },
      { ingredient: 'crackers', x: 71, y: 66 },
    ],
  },
  {
    id: 'mixed-fried-rice',
    category: 'fried-rice',
    name: 'Mixed Fried Rice',
    description: 'The loaded one — chicken, prawn, egg and greens, finished with lemon and fresh coriander.',
    price: 1650,
    image: 'fr-mixed',
    tags: ['signature', 'bestseller'],
    ingredients: ['prawn', 'chicken', 'egg', 'coriander', 'lemon'],
    hotspots: [
      { ingredient: 'lemon', x: 50, y: 20 },
      { ingredient: 'coriander', x: 43, y: 49 },
      { ingredient: 'prawn', x: 62, y: 62 },
      { ingredient: 'chicken', x: 33, y: 63 },
      { ingredient: 'egg', x: 56, y: 40 },
    ],
  },
  {
    id: 'prawn-fried-rice',
    category: 'fried-rice',
    name: 'Prawn Fried Rice',
    description: 'Butterflied tiger prawns seared in garlic butter over chilli-flecked rice and a ladle of masala.',
    price: 1790,
    image: 'fr-prawn',
    tags: ['bestseller', 'spicy'],
    ingredients: ['prawn', 'rice', 'tomato', 'coriander'],
    hotspots: [
      { ingredient: 'prawn', x: 53, y: 47 },
      { ingredient: 'rice', x: 44, y: 25 },
      { ingredient: 'tomato', x: 75, y: 38 },
      { ingredient: 'coriander', x: 25, y: 56 },
    ],
  },
  {
    id: 'mutton-fried-rice',
    category: 'fried-rice',
    name: 'Mutton Fried Rice',
    description: 'Slow-braised mutton pulled and wok-crisped, with fried shallots and garden herbs.',
    price: 1850,
    image: 'fr-beef',
    ingredients: ['mutton', 'rice', 'coriander'],
    hotspots: [
      { ingredient: 'mutton', x: 65, y: 56 },
      { ingredient: 'coriander', x: 40, y: 25 },
      { ingredient: 'rice', x: 55, y: 78 },
    ],
  },

  // ------------------------------------------------------------------ BIRIYANI
  {
    id: 'chicken-biriyani',
    category: 'biriyani',
    name: 'Chicken Biriyani',
    description: 'Bone-in chicken marinated in yoghurt and spice, layered with saffron basmati and sealed for dum.',
    price: 1550,
    image: 'bir-plated',
    tags: ['bestseller', 'signature'],
  },
  {
    id: 'mutton-biriyani',
    category: 'biriyani',
    name: 'Mutton Biriyani',
    description: 'Tender mutton shoulder, slow-cooked for hours, with caramelised onion and whole spices.',
    price: 1950,
    image: 'bir-mutton',
  },
  {
    id: 'clay-pot-biriyani',
    category: 'biriyani',
    name: 'Clay Pot Biriyani',
    description: 'Served in the pot it was steamed in, with raita and a boiled egg. Built for two.',
    price: 3200,
    image: 'bir-pot',
    tags: ['signature'],
  },
  {
    id: 'leg-piece-biriyani',
    category: 'biriyani',
    name: 'Leg Piece Biriyani',
    description: 'A whole spiced chicken leg buried in fragrant rice. For the serious appetite.',
    price: 1750,
    image: 'bir-leg',
    tags: ['spicy'],
  },

  // ------------------------------------------------------------------ SHAWARMA
  {
    id: 'chicken-shawarma',
    category: 'shawarma',
    name: 'Chicken Shawarma',
    description: 'Shaved chicken, garlic toum, pickles and fries rolled tight in a toasted wrap.',
    price: 850,
    image: 'sh-whole',
    tags: ['bestseller'],
  },
  {
    id: 'shawarma-plate',
    category: 'shawarma',
    name: 'Shawarma Plate',
    description: 'Open-plate shawarma over fries with toum, pickled turnip, onions and parsley.',
    price: 1450,
    image: 'sh-plated',
  },
  {
    id: 'cut-shawarma',
    category: 'shawarma',
    name: 'Arabic Cut Shawarma',
    description: 'Grilled and sliced into bite-size rounds, with dips for dragging.',
    price: 1150,
    image: 'sh-sliced',
    tags: ['new'],
  },
  {
    id: 'mixed-grill-platter',
    category: 'shawarma',
    name: 'Mixed Grill Platter',
    description: 'Shawarma, shish tawook and charred vegetables. The whole fire on one board.',
    price: 3400,
    image: 'sh-served',
    tags: ['signature'],
  },

  // ------------------------------------------------------------------ SIDES
  {
    id: 'crispy-chicken',
    category: 'sides',
    name: 'Crispy Fried Chicken',
    description: 'Twice-dredged, spice-salted and shatteringly crisp. Four pieces.',
    price: 1100,
    image: 'side-crispy',
  },
  {
    id: 'hot-wings',
    category: 'sides',
    name: 'Fire Wings',
    description: 'Glazed in chilli-garlic butter with a cooling yoghurt dip.',
    price: 990,
    image: 'side-wings',
    tags: ['spicy'],
  },
  {
    id: 'loaded-fries',
    category: 'sides',
    name: 'Garlic Fries',
    description: 'Skin-on fries with toum, parmesan and parsley.',
    price: 650,
    image: 'side-fries',
    tags: ['veg'],
  },
  {
    id: 'onion-rings',
    category: 'sides',
    name: 'Onion Rings',
    description: 'Thick-cut, beer-free batter, served with smoked chilli mayo.',
    price: 590,
    image: 'side-rings',
    tags: ['veg'],
  },
  {
    id: 'samosa',
    category: 'sides',
    name: 'Chicken Samosa',
    description: 'Hand-folded, spiced minced chicken. Three per order.',
    price: 450,
    image: 'side-samosa',
  },

  // ------------------------------------------------------------------ DRINKS
  {
    id: 'fresh-lime',
    category: 'drinks',
    name: 'Fresh Lime Soda',
    description: 'Hand-squeezed lime, a pinch of salt, sweet or salted.',
    price: 390,
    image: 'drink-lime',
  },
  {
    id: 'virgin-mojito',
    category: 'drinks',
    name: 'Virgin Mojito',
    description: 'Muddled mint, lime and crushed ice.',
    price: 550,
    image: 'drink-mojito',
    tags: ['bestseller'],
  },
  {
    id: 'house-mocktails',
    category: 'drinks',
    name: 'House Mocktails',
    description: 'Passion fruit, watermelon or pineapple — ask what is fresh today.',
    price: 650,
    image: 'drink-mocktail',
    tags: ['new'],
  },
]

export const BESTSELLER_IDS = ['prawn-fried-rice', 'chicken-biriyani', 'chicken-shawarma', 'mixed-fried-rice'] as const

export const SHOWCASE_IDS = [
  'egg-fried-rice',
  'chicken-fried-rice',
  'chicken-egg-fried-rice',
  'mixed-fried-rice',
  'prawn-fried-rice',
] as const

const byId = new Map(MENU.map((m) => [m.id, m]))

export function getItem(id: string): MenuItem {
  const item = byId.get(id)
  if (!item) throw new Error(`Unknown menu item: ${id}`)
  return item
}

export const itemsIn = (category: CategoryId) => MENU.filter((m) => m.category === category)
