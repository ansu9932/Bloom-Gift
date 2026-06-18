import { forwardRef } from 'react';
import WrappedBouquet from './WrappedBouquet';
import FlowerItem from './FlowerItem';
import FlowerGlyph from '../flowers/FlowerGlyph';

// The bouquet canvas: a rich, textured forest-green stage with a large centered
// kraft paper wrap and all placed flowers blooming from its opening.
const FlowerCanvas = forwardRef(function FlowerCanvas(
  { flowers, palette, style, selectedId, onSelect, onMove },
  ref
) {
  return (
    <div
      ref={ref}
      onPointerDown={() => onSelect(null)}
      className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl shadow-inner"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 18%, #2f5236 0%, #1f3a25 45%, #142a18 100%)',
      }}
    >
      {/* Painterly texture overlay */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true">
        <filter id="canvasGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="11" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#canvasGrain)" />
      </svg>

      {/* Faint blurred white flower for depth */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 opacity-[0.10] blur-[3px]">
        <FlowerGlyph color="#ffffff" type="BLOOM" size={300} withStem={false} />
      </div>
      <div className="pointer-events-none absolute left-[22%] top-[24%] opacity-[0.07] blur-[4px]">
        <FlowerGlyph color="#ffffff" type="BLOOM" size={150} withStem={false} />
      </div>

      {/* Large centered kraft wrap (fills ~68% of canvas height) */}
      <div className="pointer-events-none absolute left-1/2 top-[54%] aspect-[320/412] h-[68%] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
        <WrappedBouquet style={style} className="h-full w-full" />
      </div>

      {/* Placed flowers */}
      {flowers.map((fl) => (
        <FlowerItem
          key={fl.uid}
          flower={fl}
          selected={selectedId === fl.uid}
          onSelect={onSelect}
          onMove={onMove}
          canvasRef={ref}
        />
      ))}

      {flowers.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-xs tracking-[0.25em] text-bloom-cream/70">
          TAP A FLOWER FROM THE RIGHT TO BEGIN
        </div>
      )}
    </div>
  );
});

export default FlowerCanvas;
