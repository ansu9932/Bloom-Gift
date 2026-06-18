import { useId } from 'react';

// A premium, hand-illustrated kraft paper cone wrap with paper-grain texture,
// natural creases/folds, an organic (slightly asymmetric) shape, and a soft
// sage/teal ribbon tied in a bow. Scales to its parent via viewBox.
export default function WrappedBouquet({ style = 'classic', className = '', width = '100%', height = '100%' }) {
  const raw = useId();
  const id = `wb${raw.replace(/[^a-zA-Z0-9]/g, '')}`;

  // The cone outline (front face + curved rim). Intentionally not symmetric.
  const cone =
    'M44 158 C 30 252, 104 342, 150 390 C 200 344, 292 254, 276 150 A 122 36 0 0 1 44 158 Z';

  return (
    <svg
      viewBox="0 0 320 412"
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="kraft paper bouquet wrap"
    >
      <defs>
        {/* Kraft paper body shading */}
        <linearGradient id={`${id}paper`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#e0bd8a" />
          <stop offset="42%" stopColor="#c8a06a" />
          <stop offset="100%" stopColor="#9a7038" />
        </linearGradient>
        {/* Inner rim (paper opening) */}
        <radialGradient id={`${id}rim`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#8a6536" />
          <stop offset="100%" stopColor="#5f4523" />
        </radialGradient>
        {/* Ribbon */}
        <linearGradient id={`${id}ribbon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8c7b3" />
          <stop offset="100%" stopColor="#6b8e7b" />
        </linearGradient>
        {/* Paper grain noise */}
        <filter id={`${id}grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0.5 0"
          />
        </filter>
        <clipPath id={`${id}clip`}>
          <path d={cone} />
        </clipPath>
      </defs>

      {/* Back rim of the opening (so flowers read as emerging from the wrap) */}
      <ellipse cx="160" cy="150" rx="122" ry="36" fill={`url(#${id}rim)`} />

      {/* Paper cone body */}
      <path d={cone} fill={`url(#${id}paper)`} stroke="#7d5a30" strokeWidth="1.4" strokeOpacity="0.5" />

      {/* Grain texture, clipped to the cone */}
      <g clipPath={`url(#${id}clip)`}>
        <rect x="0" y="120" width="320" height="300" filter={`url(#${id}grain)`} opacity="0.5" />

        {/* Soft side shading for volume */}
        <path d="M150 168 C 150 280, 150 340, 150 388 C 210 344, 286 256, 274 156 C 230 184, 190 184, 150 168 Z" fill="#7d5a30" opacity="0.22" />
        <path d="M150 168 C 150 280, 150 340, 150 388 C 96 340, 32 252, 46 158 C 92 184, 120 184, 150 168 Z" fill="#f0d6a8" opacity="0.18" />

        {/* Natural creases / folds converging toward the tip */}
        {[
          { d: 'M74 168 Q 112 282 150 386', s: '#6e4f29' },
          { d: 'M110 174 Q 132 286 150 386', s: '#6e4f29' },
          { d: 'M160 172 Q 156 286 150 386', s: '#6e4f29' },
          { d: 'M210 170 Q 184 284 150 386', s: '#6e4f29' },
          { d: 'M250 162 Q 200 282 150 386', s: '#6e4f29' },
        ].map((c, i) => (
          <g key={i}>
            <path d={c.d} fill="none" stroke={c.s} strokeWidth="2" strokeOpacity="0.28" strokeLinecap="round" />
            <path
              d={c.d}
              fill="none"
              stroke="#f3dcb0"
              strokeWidth="1.2"
              strokeOpacity="0.3"
              strokeLinecap="round"
              transform="translate(3 0)"
            />
          </g>
        ))}

        {/* extra fold lines for the crisp 'paper' look */}
        {style === 'paper' &&
          [88, 132, 178, 224].map((x) => (
            <path key={x} d={`M${x} 170 L150 386`} stroke="#5f4523" strokeWidth="0.8" strokeOpacity="0.25" />
          ))}
      </g>

      {/* Ribbon band wrapping the narrowing of the cone */}
      <path d="M118 296 C 140 308, 180 308, 198 296 C 196 312, 188 322, 168 326 C 150 330, 132 326, 120 318 Z" fill={`url(#${id}ribbon)`} opacity="0.95" />

      {/* Bow */}
      <g>
        {/* left loop */}
        <path d="M152 304 C 118 286, 96 300, 104 322 C 110 340, 140 332, 152 312 Z" fill={`url(#${id}ribbon)`} stroke="#5f8472" strokeWidth="1" />
        {/* right loop */}
        <path d="M152 304 C 186 286, 208 300, 200 322 C 194 340, 164 332, 152 312 Z" fill={`url(#${id}ribbon)`} stroke="#5f8472" strokeWidth="1" />
        {/* loop inner shadow */}
        <path d="M150 308 C 128 300, 114 308, 118 320" fill="none" stroke="#5f8472" strokeWidth="1" strokeOpacity="0.6" />
        <path d="M152 308 C 174 300, 188 308, 184 320" fill="none" stroke="#5f8472" strokeWidth="1" strokeOpacity="0.6" />
        {/* tails */}
        <path d="M146 314 C 138 344, 146 360, 132 380 L142 372 L150 382 L150 316 Z" fill={`url(#${id}ribbon)`} stroke="#5f8472" strokeWidth="0.8" />
        <path d="M156 314 C 166 344, 160 360, 176 380 L164 372 L156 382 L150 316 Z" fill={`url(#${id}ribbon)`} stroke="#5f8472" strokeWidth="0.8" />
        {/* knot */}
        <ellipse cx="152" cy="310" rx="11" ry="9" fill="#7fa18d" stroke="#5f8472" strokeWidth="1" />
        <ellipse cx="149" cy="307" rx="4" ry="3" fill="#bcd6c6" opacity="0.7" />
      </g>
    </svg>
  );
}
