'use strict';
/* Data layer. Only `api` is used by the UI; swap its bodies for fetch('/api/...') later. */
const shoeArt = (c, bg, m) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 450'><rect width='600' height='450' fill='${bg}'/><ellipse cx='300' cy='376' rx='230' ry='14' fill='#000' opacity='.12'/><g transform='${m ? 'translate(600 0) scale(-1 1)' : ''}'><path d='M70 300c0-46 26-64 70-72l58-72c14-17 36-12 44 6l16 38 88 20c62 14 136 38 160 76v46H70z' fill='${c}'/><path d='M180 200l56 28M206 176l54 28M232 156l50 24' stroke='#fff' stroke-opacity='.55' stroke-width='7' stroke-linecap='round'/><path d='M70 322h456' stroke='#fff' stroke-opacity='.25' stroke-width='3'/><rect x='66' y='330' width='466' height='30' rx='15' fill='#f1ece1'/></g></svg>`);

const RAW = [
  [1, 'Aero One', 'Running', 'Men', 720, '#161616', '#e4e0d6', ['Black', 'White']],
  [2, 'Velocity X', 'Running', 'Women', 680, '#e9e3d6', '#2a2a2a', ['Cream', 'Black']],
  [3, 'Urban 01', 'Sneakers', 'Unisex', 640, '#f4f1ea', '#bdb6a6', ['White', 'Black']],
  [4, 'Form Runner', 'Running', 'Women', 750, '#9b978f', '#efece5', ['Black', 'White']],
  [5, 'Motion Pro', 'Basketball', 'Men', 980, '#0f0f0f', '#d6cfc0', ['Black', 'White']],
  [6, 'Core Street', 'Sneakers', 'Men', 590, '#3a3733', '#e8e4da', ['Black', 'Cream']],
  [7, 'Apex High', 'Basketball', 'Men', 1000, '#f1ede4', '#1d1d1d', ['White', 'Black']],
  [8, 'Flux Knit', 'Lifestyle', 'Women', 760, '#b8a88f', '#efece5', ['Cream', 'Black']],
  [9, 'Stride Lite', 'Running', 'Men', 500, '#d9d4c8', '#25231f', ['White', 'Black']],
  [10, 'Court Nine', 'Basketball', 'Women', 840, '#1c1c1c', '#e0dbcf', ['Black', 'White']],
  [11, 'Halo Low', 'Sneakers', 'Women', 610, '#f6f3ec', '#cbc4b4', ['White', 'Cream']],
  [12, 'Drift 84', 'Lifestyle', 'Unisex', 800, '#5c4f42', '#e7e2d7', ['Black', 'Cream']],
  [13, 'Nova Hi', 'Sneakers', 'Unisex', 700, '#e6e0d3', '#2d2b28', ['Cream', 'Black']],
  [14, 'Pace 2', 'Running', 'Unisex', 550, '#2b2b2b', '#dedad0', ['Black', 'White']],
  [15, 'Loft Classic', 'Lifestyle', 'Men', 650, '#efe9dc', '#4a4640', ['White', 'Cream']],
  [16, 'Ember Mid', 'Basketball', 'Unisex', 920, '#121212', '#cfc7b6', ['Black', 'White']]
];
const AR_NAMES = {
  1: 'حذاء جري بيج', 2: 'حذاء جري رمادي', 3: 'حذاء أبيض بسيط', 4: 'حذاء يومي زيتي',
  5: 'حذاء كرة سلة أسود', 6: 'حذاء كاجوال بني', 7: 'حذاء أسود برقبة عالية', 8: 'حذاء يومي كريمي',
  9: 'حذاء جري أبيض', 10: 'حذاء رياضي أسود بتصميم بسيط', 11: 'حذاء أبيض بتفاصيل بيج', 12: 'حذاء كاجوال جملي',
  13: 'حذاء شمواه بيج', 14: 'حذاء رياضي أسود يومي', 15: 'حذاء كلاسيكي بلون فاتح', 16: 'حذاء أسود بقاعدة بيضاء'
};
/* Generated demo concepts supplied with the project; unverified models retain SVG art. */
const PHOTO_BY_ID = {
  1: 'soleva-beige-runner-10.jpg',
  3: 'soleva-white-minimal-01.jpg', 4: 'soleva-olive-lifestyle-07.jpg',
  5: 'soleva-black-high-top-12.jpg', 6: 'soleva-brown-casual-06.jpg',
  8: 'soleva-cream-lifestyle-11.jpg', 9: 'soleva-white-lifestyle-04.jpg',
  10: 'soleva-black-minimal-02.jpg', 11: 'soleva-cream-panel-15.jpg',
  12: 'soleva-tan-loafer-13.jpg', 13: 'soleva-beige-suede-03.jpg',
  14: 'soleva-black-lifestyle-14.jpg', 16: 'soleva-black-white-sole-05.jpg',
  7: 'sport-high-top-black-15.jpg',
  2: 'sport-runner-silver-grey-05.jpg'
};
const LIFESTYLE_IDS = new Set([4, 8, 9, 14]);
const PRODUCTS = RAW.map(([id, name, category, gender, price, c, bg, colors]) => ({
  id, brand: 'SOLEVA', name, nameAr: AR_NAMES[id], category, gender, price, colors,
  sizes: [39, 40, 41, 42, 43, 44, 45].filter((_, i) => (id + i) % 8 !== 0),
  description: `${name} is a contemporary SOLEVA design for everyday wear.`,
  imageFit: LIFESTYLE_IDS.has(id) ? 'cover' : 'contain',
  // Keep one concept visual per item; generated concepts are not verified stock photography.
  images: [PHOTO_BY_ID[id] ? `assets/photography/${[2, 7].includes(id) ? 'ai-sport-products' : 'ai-products'}/${PHOTO_BY_ID[id]}` : shoeArt(c, bg, 0)],
  imageKind: PHOTO_BY_ID[id] ? 'photo' : 'illustration'
}));

const api = {
  getProducts: async () => PRODUCTS.slice(),                                   // GET /api/products
  getProduct: async id => PRODUCTS.find(p => p.id === +id) || null,            // GET /api/products/{id}
  getCategories: async () => ['Running', 'Sneakers', 'Basketball', 'Lifestyle'] // GET /api/categories
};
