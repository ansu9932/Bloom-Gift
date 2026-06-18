import { getPalette } from '../../data/themes';

// SVG wrapping-paper cone + ribbon. `style` = 'classic' | 'paper'.
// Used as the bouquet backdrop in the composer and the reveal screen.
export default function WrappedBouquet({ palette = 'pink', style = 'classic', width = 240 }) {
  const pal = getPalette(palette);
  const wrap = pal.wrap;
  const ribbon = pal.ribbon;
  const height = width * 1.1;

  return (
    <svg width={width} height={height} viewBox="0 0 240 264" aria-hidden="true">
      <defs>
        <linearGradient id={`wrap-${palette}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={wrap} stopOpacity="0.95" />
          <stop offset="100%" stopColor={ribbon} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {style === 'paper' ? (
        // Crisp folded paper cone
        <>
          <path d="M120 110 L40 250 L200 250 Z" fill={`url(#wrap-${palette})`} />
          <path d="M120 110 L70 250 L120 250 Z" fill={wrap} opacity="0.4" />
          <path d="M120 110 L170 250 L120 250 Z" fill={ribbon} opacity="0.3" />
          <path d="M120 110 L40 250" stroke={ribbon} strokeWidth="2" opacity="0.5" />
          <path d="M120 110 L200 250" stroke={ribbon} strokeWidth="2" opacity="0.5" />
        </>
      ) : (
        // Soft rounded classic wrap
        <>
          <path d="M120 120 C70 150 55 210 70 252 L170 252 C185 210 170 150 120 120 Z" fill={`url(#wrap-${palette})`} />
          <path d="M120 130 C95 160 90 210 100 250 L120 250 Z" fill={wrap} opacity="0.45" />
        </>
      )}

      {/* Ribbon knot */}
      <ellipse cx="120" cy="196" rx="16" ry="11" fill={ribbon} />
      <path d="M104 196 q-26 -10 -34 6 q22 8 34 2" fill={ribbon} opacity="0.85" />
      <path d="M136 196 q26 -10 34 6 q-22 8 -34 2" fill={ribbon} opacity="0.85" />
      <circle cx="120" cy="196" r="5" fill={pal.accent} />
    </svg>
  );
}
