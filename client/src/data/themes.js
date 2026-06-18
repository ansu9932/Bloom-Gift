// Color palette definitions for the gift experience.
// Each palette drives backgrounds, flower colors, ribbons, and accents.

export const palettes = {
  yellow: {
    id: 'yellow',
    label: 'Golden',
    dot: '#f4c430',
    bg: 'linear-gradient(160deg, #2a2410 0%, #4a3d12 100%)',
    soft: '#fdf6e3',
    accent: '#f4c430',
    petal: ['#f4c430', '#f6d365', '#e8a317', '#fff3c4'],
    ribbon: '#c9a84c',
    wrap: '#f6e7b8',
    text: '#fdf6e3',
  },
  brown: {
    id: 'brown',
    label: 'Earth',
    dot: '#8b5e3c',
    bg: 'linear-gradient(160deg, #2b1f16 0%, #4a3527 100%)',
    soft: '#f3e9df',
    accent: '#c08552',
    petal: ['#c08552', '#a9744f', '#d9a878', '#e8c9a0'],
    ribbon: '#8b5e3c',
    wrap: '#d8c4ad',
    text: '#f3e9df',
  },
  white: {
    id: 'white',
    label: 'Pure',
    dot: '#f5f5f0',
    bg: 'linear-gradient(160deg, #e9e4d8 0%, #f6f1e7 100%)',
    soft: '#ffffff',
    accent: '#d8cdb5',
    petal: ['#ffffff', '#f7f3ea', '#efe7d6', '#fbf6ec'],
    ribbon: '#d8cdb5',
    wrap: '#f3ead9',
    text: '#3a3a32',
  },
  red: {
    id: 'red',
    label: 'Passion',
    dot: '#c1272d',
    bg: 'linear-gradient(160deg, #1c0a0c 0%, #3a1216 100%)',
    soft: '#fbe8e8',
    accent: '#e0454b',
    petal: ['#c1272d', '#e0454b', '#9b1c22', '#f06b70'],
    ribbon: '#8e1c1f',
    wrap: '#d98a8c',
    text: '#fbe8e8',
  },
  blue: {
    id: 'blue',
    label: 'Twilight',
    dot: '#3a6ea5',
    bg: 'linear-gradient(160deg, #0a1226 0%, #16294d 100%)',
    soft: '#e7eefb',
    accent: '#5b8fd4',
    petal: ['#5b8fd4', '#7aa7e0', '#3a6ea5', '#aecbf0'],
    ribbon: '#2f5685',
    wrap: '#b8cdeb',
    text: '#e7eefb',
  },
  green: {
    id: 'green',
    label: 'Garden',
    dot: '#3a7d44',
    bg: 'linear-gradient(160deg, #0d1a0d 0%, #1f3a23 100%)',
    soft: '#e9f3e9',
    accent: '#5fa66a',
    petal: ['#5fa66a', '#7cbf86', '#3a7d44', '#a9d8b0'],
    ribbon: '#2c5e34',
    wrap: '#b8d6bc',
    text: '#e9f3e9',
  },
  pink: {
    id: 'pink',
    label: 'Romance',
    dot: '#e8b4b8',
    bg: 'linear-gradient(160deg, #2a1620 0%, #4d2738 100%)',
    soft: '#fbeef0',
    accent: '#e8859a',
    petal: ['#e8b4b8', '#f3c9d4', '#d97a93', '#f9e0e6'],
    ribbon: '#c98a9c',
    wrap: '#f3d6dd',
    text: '#fbeef0',
  },
};

export const paletteList = Object.values(palettes);

export const defaultPalette = 'pink';

export function getPalette(id) {
  return palettes[id] || palettes[defaultPalette];
}
