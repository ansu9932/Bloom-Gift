import { useMemo } from 'react';
import { getPalette } from '../../data/themes';
import { seededRandom } from '../../utils/animations';

// Soft falling petals layered behind a screen. Colors follow the palette.
export default function PetalField({ palette = 'pink', count = 26, seed = 11 }) {
  const pal = getPalette(palette);
  const petals = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      size: rand() * 16 + 10,
      delay: rand() * 6,
      duration: rand() * 5 + 6,
      color: pal.petal[i % pal.petal.length],
      rotate: rand() * 360,
    }));
  }, [count, seed, pal]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.3}px`,
            background: p.color,
            borderRadius: '60% 60% 60% 0',
            transform: `rotate(${p.rotate}deg)`,
            opacity: 0.75,
            animation: `petalFall ${p.duration}s ease-in ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
