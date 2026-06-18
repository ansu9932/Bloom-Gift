// Botanical SVG flower renderer.
// Produces detailed, layered, gradient-shaded illustrations (rose / daisy / lily /
// tulip / cluster / default archetypes) chosen from the flower's name, so the
// platform shows delicate hand-illustrated flowers without external image assets.
// If a real image is dropped at flower.image, callers can swap it in; this is the
// always-available, artistic fallback.

import { useId } from 'react';
import { getFlower } from '../../data/flowers';

function clamp(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function parseHex(hex) {
  const c = String(hex || '#e8859a').replace('#', '');
  const full = c.length === 3 ? c.replace(/(.)/g, '$1$1') : c;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function lighten(hex, amt = 0.25) {
  const { r, g, b } = parseHex(hex);
  return `rgb(${clamp(r + (255 - r) * amt)}, ${clamp(g + (255 - g) * amt)}, ${clamp(b + (255 - b) * amt)})`;
}
function darken(hex, amt = 0.25) {
  const { r, g, b } = parseHex(hex);
  return `rgb(${clamp(r * (1 - amt))}, ${clamp(g * (1 - amt))}, ${clamp(b * (1 - amt))})`;
}
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h);
}

// Decide which botanical shape to draw from the flower name.
function archetypeFor(name = '', type = 'STEM') {
  const n = name.toLowerCase();
  if (/rose|peony|peonies|ranunculus|camellia|dahlia|carnation|gardenia|begonia/.test(n)) return 'rose';
  if (/daisy|sunflower|gerbera|cosmos|aster|chamomile|echinacea|zinnia|marigold|chrysanth|mum|crocus|ursinia/.test(n)) return 'daisy';
  if (/lily|magnolia|iris|orchid|amaryllis|narcissus|daffodil|jonquil|frangipani|hibiscus|poppy|anemone|clematis|waterlily|calla|zantedeschia/.test(n)) return 'lily';
  if (/tulip|buttercup|lotus|bluebell|kalmia/.test(n)) return 'tulip';
  if (/lavender|hyacinth|allium|agapanthus|delphinium|snapdragon|foxglove|wisteria|lilac|statice|heather|bugloss|forget|grape|stock|hollyhock|bird of paradise|kangaroo|gladiolus|thistle|lace|nigella|gypsoph|baby|queen/.test(n)) return 'cluster';
  return 'default';
}

// A single teardrop petal pointing up, base at (50,50), tip at (50, 50-len).
function petalPath(len, wid) {
  const t = 50 - len;
  return `M50 50 C ${50 - wid} ${50 - len * 0.35}, ${50 - wid} ${t + len * 0.12}, 50 ${t} C ${50 + wid} ${t + len * 0.12}, ${50 + wid} ${50 - len * 0.35}, 50 50 Z`;
}
function pointedPetalPath(len, wid) {
  const t = 50 - len;
  return `M50 50 C ${50 - wid} ${50 - len * 0.4}, ${50 - wid * 0.6} ${t + len * 0.2}, 50 ${t} C ${50 + wid * 0.6} ${t + len * 0.2}, ${50 + wid} ${50 - len * 0.4}, 50 50 Z`;
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
  const name = data?.name || '';
  const seed = hashString(String(data?.id || flowerId || name || color));
  const archetype = archetypeFor(name, type);

  const raw = useId();
  const gid = `fg${raw.replace(/[^a-zA-Z0-9]/g, '')}`;

  const hasStem = withStem;
  const R = type === 'BLOOM' ? 32 : 26;
  // With a stem, the head sits high so the stem + leaves show below it.
  // Without a stem (picker tiles, decorations), centre the head in a square tile.
  const headCY = hasStem ? (type === 'BLOOM' ? 44 : 40) : 50;
  const dy = headCY - 50; // translate the head group vertically
  const viewBox = hasStem ? '0 0 100 132' : '14 14 72 72';
  const svgW = size;
  const svgH = hasStem ? size * 1.32 : size;

  const stroke = darken(color, 0.28);
  const centerCore = /rose|tulip|lily/.test(archetype) ? darken(color, 0.22) : '#caa23f';

  // ── Head archetypes (drawn around 50,50) ──────────────────────
  function Rose() {
    const rings = [
      { n: 7, len: R, wid: R * 0.46, rot: 0 },
      { n: 6, len: R * 0.74, wid: R * 0.42, rot: 26 },
      { n: 5, len: R * 0.5, wid: R * 0.38, rot: 52 },
    ];
    return (
      <g>
        {rings.map((ring, ri) =>
          Array.from({ length: ring.n }).map((_, i) => (
            <path
              key={`${ri}-${i}`}
              d={petalPath(ring.len, ring.wid)}
              transform={`rotate(${ring.rot + (360 / ring.n) * i} 50 50)`}
              fill={`url(#${gid}p)`}
              stroke={stroke}
              strokeWidth="0.4"
              strokeOpacity="0.45"
            />
          ))
        )}
        <circle cx="50" cy="50" r={R * 0.16} fill={darken(color, 0.18)} />
      </g>
    );
  }

  function Daisy() {
    const n = 14 + (seed % 4);
    return (
      <g>
        {Array.from({ length: n }).map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy={50 - R * 0.66}
            rx={R * 0.11}
            ry={R * 0.52}
            transform={`rotate(${(360 / n) * i} 50 50)`}
            fill={`url(#${gid}p)`}
            stroke={stroke}
            strokeWidth="0.3"
            strokeOpacity="0.4"
          />
        ))}
        <circle cx="50" cy="50" r={R * 0.34} fill={`url(#${gid}c)`} />
        {/* stipple seeds */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const rr = R * 0.18;
          return <circle key={`d${i}`} cx={50 + Math.cos(a) * rr} cy={50 + Math.sin(a) * rr} r="0.9" fill={darken(centerCore, 0.25)} />;
        })}
      </g>
    );
  }

  function Lily() {
    const n = 6;
    return (
      <g>
        {Array.from({ length: n }).map((_, i) => (
          <path
            key={i}
            d={pointedPetalPath(R * 1.08, R * 0.42)}
            transform={`rotate(${(360 / n) * i + (i % 2 ? 30 : 0)} 50 50)`}
            fill={`url(#${gid}p)`}
            stroke={stroke}
            strokeWidth="0.4"
            strokeOpacity="0.4"
          />
        ))}
        {/* vein lines */}
        {Array.from({ length: n }).map((_, i) => (
          <line
            key={`v${i}`}
            x1="50"
            y1="50"
            x2="50"
            y2={50 - R * 0.95}
            transform={`rotate(${(360 / n) * i} 50 50)`}
            stroke={darken(color, 0.25)}
            strokeWidth="0.4"
            strokeOpacity="0.35"
          />
        ))}
        {/* stamens */}
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const len = R * 0.5;
          return (
            <g key={`s${i}`}>
              <line x1="50" y1="50" x2={50 + Math.cos(a) * len} y2={50 + Math.sin(a) * len} stroke={lighten(centerCore, 0.1)} strokeWidth="0.7" />
              <circle cx={50 + Math.cos(a) * len} cy={50 + Math.sin(a) * len} r="1.5" fill={centerCore} />
            </g>
          );
        })}
        <circle cx="50" cy="50" r={R * 0.12} fill={darken(color, 0.2)} />
      </g>
    );
  }

  function Tulip() {
    const L = R * 1.05;
    const w = R * 0.62;
    return (
      <g>
        {/* back petals */}
        <path d={petalPath(L, w)} transform="rotate(-22 50 50)" fill={darken(color, 0.08)} stroke={stroke} strokeWidth="0.4" strokeOpacity="0.4" />
        <path d={petalPath(L, w)} transform="rotate(22 50 50)" fill={darken(color, 0.08)} stroke={stroke} strokeWidth="0.4" strokeOpacity="0.4" />
        {/* front cup petal */}
        <path d={petalPath(L * 1.02, w * 1.05)} fill={`url(#${gid}p)`} stroke={stroke} strokeWidth="0.4" strokeOpacity="0.45" />
        {/* central cleft highlight */}
        <path d={`M50 50 L50 ${50 - L * 0.9}`} stroke={lighten(color, 0.3)} strokeWidth="1" strokeOpacity="0.5" />
      </g>
    );
  }

  function Cluster() {
    // Small florets distributed along a tapering spike.
    const florets = 16;
    return (
      <g>
        {Array.from({ length: florets }).map((_, i) => {
          const t = i / florets;
          const y = 50 - R * 1.05 + t * (R * 1.55);
          const spread = R * 0.5 * (0.4 + t); // wider toward the bottom
          const x = 50 + (i % 2 ? spread * 0.5 : -spread * 0.5) * (0.6 + (i % 3) * 0.2);
          const fr = R * (0.16 + t * 0.06);
          return (
            <g key={i} transform={`rotate(${i % 2 ? 12 : -12} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx={fr} ry={fr * 1.25} fill={`url(#${gid}p)`} stroke={stroke} strokeWidth="0.3" strokeOpacity="0.4" />
              <circle cx={x} cy={y} r={fr * 0.32} fill={lighten(color, 0.35)} />
            </g>
          );
        })}
      </g>
    );
  }

  function Default() {
    const outer = 6;
    const inner = 5;
    return (
      <g>
        {Array.from({ length: outer }).map((_, i) => (
          <path
            key={`o${i}`}
            d={petalPath(R, R * 0.5)}
            transform={`rotate(${(360 / outer) * i} 50 50)`}
            fill={`url(#${gid}p)`}
            stroke={stroke}
            strokeWidth="0.4"
            strokeOpacity="0.4"
          />
        ))}
        {Array.from({ length: inner }).map((_, i) => (
          <path
            key={`i${i}`}
            d={petalPath(R * 0.62, R * 0.4)}
            transform={`rotate(${(360 / inner) * i + 36} 50 50)`}
            fill={lighten(color, 0.16)}
            stroke={stroke}
            strokeWidth="0.3"
            strokeOpacity="0.35"
          />
        ))}
        <circle cx="50" cy="50" r={R * 0.26} fill={`url(#${gid}c)`} />
      </g>
    );
  }

  const head =
    archetype === 'rose' ? <Rose />
    : archetype === 'daisy' ? <Daisy />
    : archetype === 'lily' ? <Lily />
    : archetype === 'tulip' ? <Tulip />
    : archetype === 'cluster' ? <Cluster />
    : <Default />;

  return (
    <svg
      viewBox={viewBox}
      width={svgW}
      height={svgH}
      className={className}
      role="img"
      aria-label={name || 'flower'}
    >
      <defs>
        <radialGradient id={`${gid}p`} cx="50%" cy="78%" r="78%">
          <stop offset="0%" stopColor={lighten(color, 0.42)} />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor={darken(color, 0.16)} />
        </radialGradient>
        <radialGradient id={`${gid}c`} cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor={lighten(centerCore, 0.4)} />
          <stop offset="60%" stopColor={centerCore} />
          <stop offset="100%" stopColor={darken(centerCore, 0.3)} />
        </radialGradient>
        <linearGradient id={`${gid}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6f9e63" />
          <stop offset="100%" stopColor="#33502f" />
        </linearGradient>
        <radialGradient id={`${gid}lf`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#7fb56f" />
          <stop offset="100%" stopColor="#3c6a36" />
        </radialGradient>
      </defs>

      {/* Stem + leaves (behind the head) */}
      {hasStem && archetype !== 'cluster' && (
        <g>
          <path
            d={`M50 ${headCY + R * 0.45} C 47 ${headCY + 30}, 53 ${headCY + 55}, 50 128`}
            stroke={`url(#${gid}s)`}
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          <path d={`M50 ${headCY + 38} C 34 ${headCY + 34}, 28 ${headCY + 48}, 33 ${headCY + 58} C 43 ${headCY + 54}, 49 ${headCY + 48}, 50 ${headCY + 40} Z`} fill={`url(#${gid}lf)`} />
          <path d={`M50 ${headCY + 52} C 66 ${headCY + 48}, 72 ${headCY + 62}, 67 ${headCY + 72} C 57 ${headCY + 68}, 51 ${headCY + 60}, 50 ${headCY + 54} Z`} fill={`url(#${gid}lf)`} opacity="0.92" />
        </g>
      )}
      {hasStem && archetype === 'cluster' && (
        <g>
          <path d={`M50 ${headCY} C 48 ${headCY + 26}, 52 ${headCY + 52}, 50 128`} stroke={`url(#${gid}s)`} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={`M50 ${headCY + 40} C 36 ${headCY + 38}, 31 ${headCY + 50}, 36 ${headCY + 60} C 45 ${headCY + 55}, 49 ${headCY + 49}, 50 ${headCY + 42} Z`} fill={`url(#${gid}lf)`} />
        </g>
      )}

      {/* Flower head */}
      <g transform={`translate(0 ${dy})`}>{head}</g>
    </svg>
  );
}
