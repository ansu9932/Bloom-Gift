import { useMemo } from 'react';
import { seededRandom } from '../../utils/animations';

// CSS-driven starfield with twinkling stars + periodic shooting stars.
export default function Starfield({ count = 140, seed = 7, shootingStars = 3 }) {
  const stars = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 2.4 + 0.6,
      delay: rand() * 3,
      duration: rand() * 2 + 1.5,
    }));
  }, [count, seed]);

  const shots = useMemo(
    () =>
      Array.from({ length: shootingStars }, (_, i) => ({
        id: i,
        top: 5 + i * 22 + Math.random() * 10,
        left: 60 + Math.random() * 35,
        delay: i * 2.6 + Math.random() * 2,
      })),
    [shootingStars]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: 0.6,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {shots.map((s) => (
        <span
          key={`shot-${s.id}`}
          className="shooting-star"
          style={{ top: `${s.top}%`, left: `${s.left}%`, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}
