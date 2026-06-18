// Procedural SVG flower renderer.
// Draws a recognisable flower from a `color` + a stable variant derived from the
// flower id, so the platform works without external illustration assets.
// If a real image exists at `flower.image`, callers can swap it in; this is the
// always-available fallback.

import { getFlower } from '../../data/flowers';

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h);
}

function lighten(hex, amount = 0.25) {
  const c = hex.replace('#', '');
  const num = parseInt(c.length === 3 ? c.replace(/(.)/g, '$1$1') : c, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  r = Math.round(r + (255 - r) * amount);
  g = Math.round(g + (255 - g) * amount);
  b = Math.round(b + (255 - b) * amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function darken(hex, amount = 0.25) {
  const c = hex.replace('#', '');
  const num = parseInt(c.length === 3 ? c.replace(/(.)/g, '$1$1') : c, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  r = Math.round(r * (1 - amount));
  g = Math.round(g * (1 - amount));
  b = Math.round(b * (1 - amount));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function FlowerGlyph({
  flower,
  flowerId,
  color: colorProp,
  type: typeProp,
  size = 80,
  withStem = true,
  className = '',
}) {
  const data = flower || (flowerId ? getFlower(flowerId) : null);
  const color = colorProp || data?.color || '#e8859a';
  const type = typeProp || data?.type || 'STEM';
  const seedKey = data?.id || flowerId || color;
  const seed = hashString(String(seedKey));

  // Pick petal count + style from the seed.
  const petalCount = type === 'BLOOM' ? 8 + (seed % 5) : 5 + (seed % 3);
  const variant = seed % 3; // 0 rounded, 1 pointed, 2 layered
  const center = lighten(color, 0.05);
  const centerCore = type === 'BLOOM' ? darken(color, 0.2) : '#c9a84c';
  const petalLight = lighten(color, 0.18);
  const petalDark = darken(color, 0.12);

  const petals = [];
  const ringR = type === 'BLOOM' ? 16 : 18;
  for (let i = 0; i < petalCount; i += 1) {
    const angle = (360 / petalCount) * i;
    petals.push(
      <g key={i} transform={`rotate(${angle} 50 50)`}>
        {variant === 1 ? (
          <path
            d={`M50 50 L${50 - 7} ${50 - ringR} Q50 ${50 - ringR - 12} ${50 + 7} ${50 - ringR} Z`}
            fill={i % 2 === 0 ? color : petalDark}
            stroke={petalDark}
            strokeWidth="0.6"
          />
        ) : (
          <ellipse
            cx="50"
            cy={50 - ringR}
            rx={variant === 2 ? 7 : 9}
            ry={variant === 2 ? 16 : 13}
            fill={i % 2 === 0 ? color : petalLight}
            stroke={petalDark}
            strokeWidth="0.6"
          />
        )}
      </g>
    );
  }

  // Inner ring for BLOOM (layered, fuller look).
  const innerPetals = [];
  if (type === 'BLOOM') {
    const innerCount = Math.max(5, petalCount - 3);
    for (let i = 0; i < innerCount; i += 1) {
      const angle = (360 / innerCount) * i + 22;
      innerPetals.push(
        <g key={`in-${i}`} transform={`rotate(${angle} 50 50)`}>
          <ellipse cx="50" cy={50 - 9} rx="5" ry="9" fill={petalLight} stroke={petalDark} strokeWidth="0.4" />
        </g>
      );
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={data?.name || 'flower'}
    >
      {withStem && (
        <g>
          <path d="M50 58 q-3 22 0 40" stroke="#3a5a3a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M50 78 q-12 -4 -16 -14 q12 -1 16 8" fill="#4e7a4e" />
          <path d="M50 88 q12 -4 16 -14 q-12 -1 -16 8" fill="#5c8a5c" />
        </g>
      )}
      <g>
        {petals}
        {innerPetals}
        <circle cx="50" cy="50" r={type === 'BLOOM' ? 9 : 8} fill={center} />
        <circle cx="50" cy="50" r={type === 'BLOOM' ? 6 : 5} fill={centerCore} />
        {/* tiny stamen dots */}
        {[0, 72, 144, 216, 288].map((a) => (
          <circle
            key={a}
            cx={50 + Math.cos((a * Math.PI) / 180) * 3}
            cy={50 + Math.sin((a * Math.PI) / 180) * 3}
            r="1"
            fill={lighten(centerCore, 0.4)}
          />
        ))}
      </g>
    </svg>
  );
}
