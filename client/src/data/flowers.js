// BloomGift flower database.
// Each entry: { id, name, letter, type: 'STEM'|'BLOOM', image, color, description }
// `color` drives the procedural SVG renderer (see components/flowers/FlowerGlyph.jsx)
// so the app works even before real /flowers/*.png assets are added.
// `image` paths are kept for when illustrated assets are dropped into public/flowers/.

const f = (id, name, letter, type, color, description) => ({
  id,
  name,
  letter,
  type,
  color,
  description,
  image: `/flowers/${id}.png`,
});

export const flowers = [
  // ── A ──
  f('acacia', 'Acacia', 'A', 'STEM', '#f2d44e', 'Symbol of secret love'),
  f('white-acacia', 'White Acacia', 'A', 'STEM', '#f6f1e7', 'Elegance and friendship'),
  f('african-daisy-stem', 'African Daisy', 'A', 'STEM', '#e8854b', 'Cheerfulness'),
  f('african-daisy-bloom', 'African Daisy', 'A', 'BLOOM', '#f2a05a', 'Cheerfulness'),
  f('agapanthus', 'Agapanthus', 'A', 'STEM', '#6f8fd0', 'Love letter'),
  f('purple-agapanthus', 'Purple Agapanthus', 'A', 'STEM', '#8a6fc0', 'Devotion'),
  f('white-agapanthus', 'White Agapanthus', 'A', 'STEM', '#f3eee4', 'Purity'),
  f('yellow-agapanthus', 'Yellow Agapanthus', 'A', 'STEM', '#f0cf52', 'Joy'),
  f('allium', 'Allium', 'A', 'STEM', '#9a7bc0', 'Good fortune'),
  f('white-allium', 'White Allium', 'A', 'STEM', '#efe9dd', 'Patience'),
  f('anemone', 'Anemone', 'A', 'BLOOM', '#7a3b8f', 'Anticipation'),
  f('aster', 'Aster', 'A', 'STEM', '#b07fce', 'Wisdom and faith'),
  f('azalea', 'Azalea', 'A', 'BLOOM', '#e87a98', 'Take care of yourself'),

  // ── B ──
  f('blue-aconite', 'Blue Aconite', 'B', 'STEM', '#3f63a8', 'Caution'),
  f('blue-flax', 'Blue Flax', 'B', 'STEM', '#5b8fd4', 'Domestic happiness'),
  f('blue-flax-bloom', 'Blue Flax', 'B', 'BLOOM', '#7aa7e0', 'Domestic happiness'),
  f('blue-lace-flower', 'Blue Lace Flower', 'B', 'STEM', '#9bb8e0', 'Delicacy'),
  f('blue-lace-flower-bloom', 'Blue Lace Flower', 'B', 'BLOOM', '#aecbf0', 'Delicacy'),
  f('blue-star', 'Blue Star', 'B', 'STEM', '#4f86c6', 'Constancy'),
  f('blue-star-bloom', 'Blue Star', 'B', 'BLOOM', '#6f9fd6', 'Constancy'),
  f('blue-sweet-violet', 'Blue Sweet Violet', 'B', 'STEM', '#6a5acd', 'Modesty'),
  f('blue-thistle', 'Blue Thistle', 'B', 'STEM', '#5d6fb0', 'Nobility'),
  f('bluebell', 'Bluebell', 'B', 'STEM', '#5566cc', 'Gratitude'),
  f('bugloss', 'Bugloss', 'B', 'BLOOM', '#4a7fd0', 'Truthfulness'),
  f('buttercup', 'Buttercup', 'B', 'STEM', '#f4c430', 'Youthfulness'),
  f('buttercup-bloom', 'Buttercup', 'B', 'BLOOM', '#f6d365', 'Youthfulness'),
  f('begonia', 'Begonia', 'B', 'BLOOM', '#e86a8a', 'Harmony'),
  f('bird-of-paradise', 'Bird of Paradise', 'B', 'STEM', '#f08a2a', 'Joyfulness'),

  // ── C ──
  f('carnation-pink', 'Pink Carnation', 'C', 'STEM', '#e8859a', 'Gratitude'),
  f('carnation-red', 'Red Carnation', 'C', 'STEM', '#c1272d', 'Deep love'),
  f('carnation-white', 'White Carnation', 'C', 'STEM', '#f3eee4', 'Pure affection'),
  f('camellia', 'Camellia', 'C', 'BLOOM', '#e0707f', 'Admiration'),
  f('chamomile', 'Chamomile', 'C', 'STEM', '#f6e9b0', 'Patience in adversity'),
  f('cherry-blossom', 'Cherry Blossom', 'C', 'BLOOM', '#f6c6d4', 'Beauty of life'),
  f('chrysanthemum-white', 'White Chrysanthemum', 'C', 'STEM', '#f3eee4', 'Truth'),
  f('chrysanthemum-gold', 'Gold Chrysanthemum', 'C', 'BLOOM', '#e8a317', 'Optimism'),
  f('clematis', 'Clematis', 'C', 'STEM', '#9a7bc0', 'Mental beauty'),
  f('cornflower', 'Cornflower', 'C', 'STEM', '#4f6fd0', 'Hope in love'),
  f('cosmos-pink', 'Pink Cosmos', 'C', 'STEM', '#e88aa6', 'Order and harmony'),
  f('cosmos-white', 'White Cosmos', 'C', 'BLOOM', '#f6f1e7', 'Innocence'),
  f('crocus', 'Crocus', 'C', 'BLOOM', '#9a6fc0', 'Cheerfulness'),

  // ── D ──
  f('daffodil', 'Daffodil', 'D', 'STEM', '#f4c430', 'New beginnings'),
  f('dahlia-red', 'Red Dahlia', 'D', 'BLOOM', '#c92d3a', 'Dignity'),
  f('dahlia-pink', 'Pink Dahlia', 'D', 'BLOOM', '#e87a98', 'Grace'),
  f('daisy', 'Daisy', 'D', 'STEM', '#f6f1e7', 'Innocence'),
  f('daisy-bloom', 'Daisy', 'D', 'BLOOM', '#fbf6ec', 'Loyal love'),
  f('delphinium', 'Delphinium', 'D', 'STEM', '#4f7fd0', 'Big-hearted'),
  f('dianthus', 'Dianthus', 'D', 'STEM', '#e07090', 'Bold affection'),

  // ── E ──
  f('echinacea', 'Echinacea', 'E', 'BLOOM', '#d97a93', 'Strength and health'),
  f('edelweiss', 'Edelweiss', 'E', 'STEM', '#f3eee4', 'Daring devotion'),
  f('eucalyptus', 'Eucalyptus', 'E', 'STEM', '#7fa890', 'Protection'),
  f('eustoma', 'Eustoma', 'E', 'BLOOM', '#b07fce', 'Appreciation'),
  f('evening-primrose', 'Evening Primrose', 'E', 'BLOOM', '#f0cf52', 'Eternal love'),

  // ── F ──
  f('forget-me-not', 'Forget-Me-Not', 'F', 'STEM', '#6f9fd6', 'True love and memories'),
  f('foxglove', 'Foxglove', 'F', 'STEM', '#c97fb0', 'Sincerity'),
  f('freesia-white', 'White Freesia', 'F', 'STEM', '#f6f1e7', 'Trust'),
  f('freesia-yellow', 'Yellow Freesia', 'F', 'BLOOM', '#f4c430', 'Friendship'),
  f('frangipani', 'Frangipani', 'F', 'BLOOM', '#f6e3b0', 'Devotion and grace'),

  // ── G ──
  f('gardenia', 'Gardenia', 'G', 'BLOOM', '#f6f1e7', 'Secret love'),
  f('gerbera-pink', 'Pink Gerbera', 'G', 'BLOOM', '#e87a98', 'Cheerful innocence'),
  f('gerbera-orange', 'Orange Gerbera', 'G', 'BLOOM', '#f0852f', 'Sunshine'),
  f('gladiolus', 'Gladiolus', 'G', 'STEM', '#e0707f', 'Strength of character'),
  f('gypsophila', "Baby's Breath", 'G', 'STEM', '#f6f1e7', 'Everlasting love'),

  // ── H ──
  f('heather', 'Heather', 'H', 'STEM', '#b07fce', 'Admiration'),
  f('hibiscus', 'Hibiscus', 'H', 'BLOOM', '#e0454b', 'Delicate beauty'),
  f('hollyhock', 'Hollyhock', 'H', 'STEM', '#e07090', 'Ambition'),
  f('hyacinth', 'Hyacinth', 'H', 'STEM', '#7a6fc0', 'Sincerity'),
  f('hydrangea-blue', 'Blue Hydrangea', 'H', 'BLOOM', '#6f9fd6', 'Heartfelt emotion'),
  f('hydrangea-pink', 'Pink Hydrangea', 'H', 'BLOOM', '#e88aa6', 'Heartfelt emotion'),

  // ── I ──
  f('iris', 'Iris', 'I', 'STEM', '#6a5acd', 'Faith and hope'),
  f('iris-yellow', 'Yellow Iris', 'I', 'BLOOM', '#f0cf52', 'Passion'),
  f('ixia', 'Ixia', 'I', 'STEM', '#e0a0c0', 'Happiness'),

  // ── J ──
  f('jasmine', 'Jasmine', 'J', 'BLOOM', '#f6f1e7', 'Sweet love'),
  f('jonquil', 'Jonquil', 'J', 'STEM', '#f4c430', 'Desire for affection'),

  // ── K ──
  f('kangaroo-paw', 'Kangaroo Paw', 'K', 'STEM', '#e0707f', 'Playfulness'),
  f('kalmia', 'Kalmia', 'K', 'BLOOM', '#e8a0b8', 'Ambition'),

  // ── L ──
  f('lavender', 'Lavender', 'L', 'STEM', '#9a7bc0', 'Devotion and calm'),
  f('lilac', 'Lilac', 'L', 'STEM', '#b07fce', 'First love'),
  f('lily-white', 'White Lily', 'L', 'BLOOM', '#f6f1e7', 'Purity'),
  f('lily-pink', 'Pink Lily', 'L', 'BLOOM', '#e88aa6', 'Prosperity'),
  f('lily-of-the-valley', 'Lily of the Valley', 'L', 'STEM', '#f3eee4', 'Return of happiness'),
  f('lotus', 'Lotus', 'L', 'BLOOM', '#f0b8c8', 'Enlightenment'),
  f('lisianthus', 'Lisianthus', 'L', 'BLOOM', '#b07fce', 'Lasting bond'),

  // ── M ──
  f('magnolia', 'Magnolia', 'M', 'BLOOM', '#f3dde0', 'Dignity and nobility'),
  f('marigold', 'Marigold', 'M', 'STEM', '#f0852f', 'Warmth and creativity'),
  f('morning-glory', 'Morning Glory', 'M', 'BLOOM', '#7a6fc0', 'Affection'),
  f('mum-pink', 'Pink Mum', 'M', 'BLOOM', '#e88aa6', 'Cheer'),

  // ── N ──
  f('narcissus', 'Narcissus', 'N', 'STEM', '#f6e9b0', 'Self-renewal'),
  f('nigella', 'Nigella', 'N', 'BLOOM', '#6f9fd6', 'Delicate charm'),

  // ── O ──
  f('orchid-purple', 'Purple Orchid', 'O', 'BLOOM', '#9a5fc0', 'Refined beauty'),
  f('orchid-white', 'White Orchid', 'O', 'BLOOM', '#f6f1e7', 'Elegance'),
  f('oleander', 'Oleander', 'O', 'BLOOM', '#e88aa6', 'Charm'),

  // ── P ──
  f('pansy', 'Pansy', 'P', 'BLOOM', '#7a5fc0', 'Loving thoughts'),
  f('peony-pink', 'Pink Peony', 'P', 'BLOOM', '#f0a8c0', 'Romance and prosperity'),
  f('peony-white', 'White Peony', 'P', 'BLOOM', '#f6f1e7', 'Bashfulness'),
  f('poppy-red', 'Red Poppy', 'P', 'BLOOM', '#d92d3a', 'Remembrance'),
  f('protea', 'Protea', 'P', 'BLOOM', '#e07090', 'Courage and transformation'),
  f('petunia', 'Petunia', 'P', 'STEM', '#b07fce', 'Soothing presence'),

  // ── Q ──
  f('queen-annes-lace', "Queen Anne's Lace", 'Q', 'STEM', '#f6f1e7', 'Sanctuary'),

  // ── R ──
  f('rose-red', 'Red Rose', 'R', 'BLOOM', '#c1272d', 'Deep romantic love'),
  f('rose-pink', 'Pink Rose', 'R', 'BLOOM', '#e88aa6', 'Admiration and gratitude'),
  f('rose-white', 'White Rose', 'R', 'BLOOM', '#f6f1e7', 'New beginnings'),
  f('rose-yellow', 'Yellow Rose', 'R', 'BLOOM', '#f4c430', 'Friendship and joy'),
  f('rose-stem', 'Rose', 'R', 'STEM', '#d97a93', 'Love'),
  f('ranunculus', 'Ranunculus', 'R', 'BLOOM', '#f0a8c0', 'Radiant charm'),

  // ── S ──
  f('snapdragon', 'Snapdragon', 'S', 'STEM', '#e8a0b8', 'Grace and strength'),
  f('sunflower', 'Sunflower', 'S', 'BLOOM', '#f4c430', 'Adoration and loyalty'),
  f('sweet-pea', 'Sweet Pea', 'S', 'STEM', '#e0a0c0', 'Blissful pleasure'),
  f('statice', 'Statice', 'S', 'STEM', '#8a6fc0', 'Remembrance'),
  f('scabiosa', 'Scabiosa', 'S', 'BLOOM', '#9a7bc0', 'Unfortunate love made tender'),
  f('stock', 'Stock', 'S', 'STEM', '#e8859a', 'Lasting beauty'),

  // ── T ──
  f('tulip-red', 'Red Tulip', 'T', 'BLOOM', '#d92d3a', 'Declaration of love'),
  f('tulip-pink', 'Pink Tulip', 'T', 'BLOOM', '#e88aa6', 'Affection'),
  f('tulip-yellow', 'Yellow Tulip', 'T', 'BLOOM', '#f4c430', 'Cheerful thoughts'),
  f('tulip-white', 'White Tulip', 'T', 'BLOOM', '#f6f1e7', 'Forgiveness'),
  f('thistle', 'Thistle', 'T', 'STEM', '#9a7bc0', 'Resilience'),

  // ── U ──
  f('ursinia', 'Ursinia', 'U', 'BLOOM', '#f0852f', 'Bright spirit'),

  // ── V ──
  f('violet', 'Violet', 'V', 'STEM', '#7a5fc0', 'Faithfulness'),
  f('verbena', 'Verbena', 'V', 'STEM', '#b07fce', 'Healing and protection'),
  f('viburnum', 'Viburnum', 'V', 'BLOOM', '#f6f1e7', 'Pride'),

  // ── W ──
  f('wisteria', 'Wisteria', 'W', 'STEM', '#9a7bc0', 'Steadfast devotion'),
  f('waterlily', 'Water Lily', 'W', 'BLOOM', '#f3dde0', 'Purity of heart'),
  f('wallflower', 'Wallflower', 'W', 'STEM', '#f0852f', 'Fidelity in adversity'),

  // ── X ──
  f('xeranthemum', 'Xeranthemum', 'X', 'BLOOM', '#b07fce', 'Cheerfulness under adversity'),

  // ── Y ──
  f('yarrow', 'Yarrow', 'Y', 'STEM', '#f6f1e7', 'Healing and courage'),
  f('yellow-bell', 'Yellow Bell', 'Y', 'BLOOM', '#f4c430', 'Good cheer'),

  // ── Z ──
  f('zinnia-pink', 'Pink Zinnia', 'Z', 'BLOOM', '#e88aa6', 'Lasting affection'),
  f('zinnia-red', 'Red Zinnia', 'Z', 'BLOOM', '#d92d3a', 'Constancy'),
  f('zantedeschia', 'Calla (Zantedeschia)', 'Z', 'STEM', '#f6f1e7', 'Magnificent beauty'),
];

// Total flowers in this curated set.
export const flowerCount = flowers.length;

// Group by first letter for the alphabetical picker.
export const flowersByLetter = flowers.reduce((acc, flower) => {
  (acc[flower.letter] = acc[flower.letter] || []).push(flower);
  return acc;
}, {});

// Sorted list of letters that actually have flowers.
export const flowerLetters = Object.keys(flowersByLetter).sort();

// Fast lookup by id.
export const flowersById = flowers.reduce((acc, flower) => {
  acc[flower.id] = flower;
  return acc;
}, {});

export function getFlower(id) {
  return flowersById[id] || null;
}

export function searchFlowers(query) {
  const q = query.trim().toLowerCase();
  if (!q) return flowers;
  return flowers.filter(
    (fl) => fl.name.toLowerCase().includes(q) || fl.description.toLowerCase().includes(q)
  );
}
