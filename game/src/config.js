export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;
export const SHIFT_DURATION = 150; // seconds

// Cooking & Burn timing constants (seconds)
export const GRILL_COOK_TIME = 6;
export const GRILL_BURN_TIME = 5;
export const FRYER_COOK_TIME = 5;
export const FRYER_BURN_TIME = 4;

export const INGREDIENTS = {
  roti: { id: 'roti', label: 'Roti', color: '#d99b52', key: '1', raw: true },
  daging: { id: 'daging', label: 'Daging', color: '#8b3a3a', key: '2', raw: true, cooksAt: 'grill', result: 'patty_panggang' },
  selada: { id: 'selada', label: 'Selada', color: '#4a8c4a', key: '3', raw: true, chopsOn: 'board', result: 'selada_cincang' },
  tomat: { id: 'tomat', label: 'Tomat', color: '#bf3b3b', key: '4', raw: true, chopsOn: 'board', result: 'tomat_cincang' },
  keju: { id: 'keju', label: 'Keju', color: '#f0c242', key: '5', raw: true },
  saus: { id: 'saus', label: 'Saus', color: '#a62424', key: '6', raw: true },
  nasi: { id: 'nasi', label: 'Nasi', color: '#f5f5f0', key: '7', raw: true },
  telur: { id: 'telur', label: 'Telur', color: '#f2e3b6', key: '8', raw: true, friesAt: 'fryer', result: 'telur_goreng' },

  // Processed / cooked states
  patty_panggang: { id: 'patty_panggang', label: 'Patty Panggang', color: '#592615', cooked: true },
  selada_cincang: { id: 'selada_cincang', label: 'Selada Cincang', color: '#3b703b', chopped: true },
  tomat_cincang: { id: 'tomat_cincang', label: 'Tomat Cincang', color: '#992a2a', chopped: true },
  telur_goreng: { id: 'telur_goreng', label: 'Telur Goreng', color: '#e8bc48', fried: true }
};

export const RECIPES = [
  {
    name: 'Burger Api',
    baseScore: 100,
    ingredients: ['roti', 'patty_panggang', 'selada_cincang', 'tomat_cincang']
  },
  {
    name: 'Burger Keju',
    baseScore: 120,
    ingredients: ['roti', 'patty_panggang', 'keju', 'saus']
  },
  {
    name: 'Salad Segar',
    baseScore: 80,
    ingredients: ['selada_cincang', 'tomat_cincang', 'saus']
  },
  {
    name: 'Nasi Telur Ember',
    baseScore: 90,
    ingredients: ['nasi', 'telur_goreng', 'saus']
  }
];

export const STATIONS = {
  pantry: { x: 16, y: 164, w: 232, h: 600 },
  plates: [
    { x: 280, y: 320, w: 240, h: 180, id: 0, label: 'Piring 1' },
    { x: 560, y: 320, w: 240, h: 180, id: 1, label: 'Piring 2' },
    { x: 840, y: 320, w: 240, h: 180, id: 2, label: 'Piring 3' }
  ],
  grill: { x: 280, y: 560, w: 240, h: 210, slots: 2 },
  board: { x: 540, y: 560, w: 240, h: 210 },
  fryer: { x: 800, y: 560, w: 240, h: 210, slots: 2 },
  bell: { x: 1080, y: 300, w: 160, h: 180 },
  trash: { x: 1080, y: 560, w: 160, h: 210 }
};
