import { forwardRef } from 'react';
import WrappedBouquet from './WrappedBouquet';
import FlowerItem from './FlowerItem';

// The bouquet canvas: wrapped paper + all placed flowers.
const FlowerCanvas = forwardRef(function FlowerCanvas(
  { flowers, palette, style, selectedId, onSelect, onMove },
  ref
) {
  return (
    <div
      ref={ref}
      onPointerDown={() => onSelect(null)}
      className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-white/60 to-bloom-cream"
    >
      {/* Wrap sits at the bottom-center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-95">
        <WrappedBouquet palette={palette} style={style} width={300} />
      </div>

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
        <div className="pointer-events-none absolute inset-x-0 bottom-10 text-center text-xs tracking-[0.25em] text-bloom-green/50">
          TAP A FLOWER FROM THE RIGHT TO BEGIN
        </div>
      )}
    </div>
  );
});

export default FlowerCanvas;
