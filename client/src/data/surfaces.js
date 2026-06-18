// Surface definitions for the gift sequence.
// A "surface" is one screen the recipient experiences. Each maps to a screen
// renderer via `kind`: lock | intro | card | notebook | letter | bouquet | misc.

// ── CARDS (18) ──
export const cards = [
  { id: 'earth-muse', name: 'Earth Muse', kind: 'card', cardStyle: 'earth-muse', tags: ['CELEBRATION', 'PREMIUM'] },
  { id: 'botanical-collage', name: 'Botanical Collage', kind: 'card', cardStyle: 'botanical-collage', tags: ['ROMANCE', 'ELEGANCE'] },
  { id: 'soft-nostalgia', name: 'Soft Nostalgia', kind: 'card', cardStyle: 'soft-nostalgia', tags: ['LOVE', 'VINTAGE'] },
  { id: 'sapphire-vineyard', name: 'Sapphire Vineyard', kind: 'card', cardStyle: 'sapphire-vineyard', tags: ['PREMIUM', 'ELEGANCE'] },
  { id: 'picnic-keepsake', name: 'Picnic Keepsake', kind: 'card', cardStyle: 'picnic-keepsake', tags: ['CELEBRATION'] },
  { id: 'pastel-daydream', name: 'Pastel Daydream', kind: 'card', cardStyle: 'pastel-daydream', tags: ['LOVE', 'DREAMY'] },
  { id: 'seaside-reverie', name: 'Seaside Reverie', kind: 'card', cardStyle: 'seaside-reverie', tags: ['CALM'] },
  { id: 'lucky-love-notes', name: 'Lucky Love Notes', kind: 'card', cardStyle: 'lucky-love-notes', tags: ['LOVE', 'PLAYFUL'] },
  { id: 'starlit-souvenir', name: 'Starlit Souvenir', kind: 'card', cardStyle: 'starlit-souvenir', tags: ['ROMANCE', 'PREMIUM'] },
  { id: 'blush-love-letters', name: 'Blush Love Letters', kind: 'card', cardStyle: 'blush-love-letters', tags: ['LOVE', 'ROMANCE'] },
  { id: 'golden-hour', name: 'Golden Hour', kind: 'card', cardStyle: 'golden-hour', tags: ['CELEBRATION', 'WARM'] },
  { id: 'midnight-bloom', name: 'Midnight Bloom', kind: 'card', cardStyle: 'midnight-bloom', tags: ['PREMIUM', 'DUAL INTRO'] },
  { id: 'forest-whisper', name: 'Forest Whisper', kind: 'card', cardStyle: 'forest-whisper', tags: ['CALM', 'NATURE'] },
  { id: 'rose-quartz', name: 'Rose Quartz', kind: 'card', cardStyle: 'rose-quartz', tags: ['LOVE', 'ELEGANCE'] },
  { id: 'vintage-postcard', name: 'Vintage Postcard', kind: 'card', cardStyle: 'vintage-postcard', tags: ['VINTAGE'] },
  { id: 'paper-lanterns', name: 'Paper Lanterns', kind: 'card', cardStyle: 'paper-lanterns', tags: ['CELEBRATION'] },
  { id: 'meadow-light', name: 'Meadow Light', kind: 'card', cardStyle: 'meadow-light', tags: ['NATURE', 'CALM'] },
  { id: 'crimson-vow', name: 'Crimson Vow', kind: 'card', cardStyle: 'crimson-vow', tags: ['ROMANCE', 'PREMIUM'] },
];

// ── NOTEBOOKS (9) ──
export const notebooks = Array.from({ length: 9 }, (_, i) => ({
  id: `scratchbook-${i + 1}`,
  name: `Scratchbook ${i + 1}`,
  kind: 'notebook',
  variant: i + 1,
  tags: ['NOTEBOOK', 'PAGES'],
}));

// ── MISC SCREENS (12) ──
export const misc = [
  { id: 'glass-heart-orbit', name: 'Glass Heart Orbit', kind: 'misc', miscStyle: 'glass-heart-orbit', tags: ['SCREEN'] },
  { id: 'sincerely-folder', name: 'Sincerely Folder', kind: 'letter', miscStyle: 'sincerely-folder', tags: ['SCREEN', 'LETTER'] },
  { id: 'misc-screen-01', name: '01. Heart Beat Love', kind: 'misc', miscStyle: 'heart-beat-love', tags: ['SCREEN'] },
  { id: 'misc-screen-02', name: '02. Love Galaxy', kind: 'card', cardStyle: 'love-galaxy', tags: ['SCREEN', 'GALAXY'] },
  { id: 'misc-screen-03', name: '03. Botanical Letter', kind: 'letter', miscStyle: 'botanical-letter', tags: ['SCREEN', 'LETTER'] },
  { id: 'misc-screen-04', name: '04. Starfield Letter', kind: 'letter', miscStyle: 'starfield-letter', tags: ['SCREEN', 'LETTER'] },
  { id: 'misc-screen-05', name: '05. Petal Rain', kind: 'misc', miscStyle: 'petal-rain', tags: ['SCREEN'] },
  { id: 'misc-screen-06', name: '06. Galaxy Card', kind: 'card', cardStyle: 'love-galaxy', tags: ['SCREEN', 'GALAXY'] },
  { id: 'misc-screen-07', name: '07. Aurora Veil', kind: 'misc', miscStyle: 'aurora-veil', tags: ['SCREEN'] },
  { id: 'misc-screen-08', name: '08. Fireflies', kind: 'misc', miscStyle: 'fireflies', tags: ['SCREEN'] },
  { id: 'misc-screen-09', name: '09. Confetti Heart', kind: 'misc', miscStyle: 'confetti-heart', tags: ['SCREEN'] },
  { id: 'misc-screen-10', name: '10. Moonlit Garden', kind: 'misc', miscStyle: 'moonlit-garden', tags: ['SCREEN'] },
];

// ── SPECIAL SURFACES (always available) ──
export const special = [
  { id: 'lock', name: 'PIN Lock', kind: 'lock', tags: ['LOCK', 'SECURITY'], starter: true },
  { id: 'intro-xoxo', name: 'XOXO Burst', kind: 'intro', introId: 'xoxo', tags: ['INTRO', 'ANIMATED'], starter: true },
  { id: 'intro-love-letter', name: 'Love Letter Intro', kind: 'intro', introId: 'love-letter', tags: ['INTRO'] },
  { id: 'intro-garden', name: 'Garden Intro', kind: 'intro', introId: 'garden', tags: ['INTRO'] },
  { id: 'bouquet-display', name: 'Bouquet Reveal', kind: 'bouquet', tags: ['BOUQUET'], starter: true },
];

// Sections used by the surface picker modal.
export const surfaceSections = [
  { key: 'special', label: 'Essentials', badges: ['CORE'], items: special },
  { key: 'card', label: 'Card', badges: ['CARD', 'REVEAL'], items: cards },
  { key: 'notebook', label: 'Notebook', badges: ['NOTEBOOK', 'PAGES'], items: notebooks },
  { key: 'misc', label: 'Misc', badges: ['MISC', 'SCREEN'], items: misc },
];

// Flat lookup of every surface by id.
export const allSurfaces = [...special, ...cards, ...notebooks, ...misc];
export const surfacesById = allSurfaces.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {});

export function getSurface(id) {
  return surfacesById[id] || null;
}

// Surfaces available on the free (starter) plan.
export const starterSurfaceIds = allSurfaces.filter((s) => s.starter).map((s) => s.id);

// Human-readable badge for a surface kind.
export const kindBadge = {
  lock: 'LOCK',
  intro: 'INTRO',
  card: 'CARD',
  notebook: 'NOTEBOOK',
  letter: 'LETTER',
  bouquet: 'BOUQUET',
  misc: 'MISC',
};
