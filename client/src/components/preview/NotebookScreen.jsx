import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPalette } from '../../data/themes';
import Starfield from './Starfield';
import TapHint from './TapHint';

const LETTERS = 'ABCDEFGH'.split('');

// 3D rotating globe of alphabet tiles using CSS transforms (spherical layout).
function LetterGlobe({ onComplete }) {
  const tiles = [];
  const radius = 130;
  const count = 36;
  for (let i = 0; i < count; i += 1) {
    // Distribute points on a sphere (Fibonacci-ish).
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    tiles.push({ x, y, z, letter: LETTERS[i % LETTERS.length] });
  }

  useEffect(() => {
    const t = setTimeout(onComplete, 3200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="scene-3d grid h-full w-full place-items-center">
      <motion.div
        className="relative"
        style={{ transformStyle: 'preserve-3d', width: 1, height: 1 }}
        animate={{ rotateY: 360, rotateX: 18 }}
        transition={{ duration: 3.4, ease: 'easeInOut' }}
      >
        {tiles.map((t, i) => (
          <motion.div
            key={i}
            className="absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md bg-white/90 font-display text-lg text-bloom-green shadow"
            style={{ transform: `translate3d(${t.x}px, ${t.y}px, ${t.z}px)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.2, times: [0, 0.2, 0.8, 1] }}
          >
            {t.letter}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Scratchbook collage: alphabet polaroids, photo slots, film strip, love phrase.
function Scratchbook({ step }) {
  const photos = (step.media || []).filter((m) => m.type === 'photo');
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 mx-auto h-[78vh] w-[92%] max-w-md overflow-hidden rounded-2xl bg-[#f3ead9] p-4 shadow-2xl"
      style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
    >
      {/* Film strip down the left edge */}
      <div className="absolute left-0 top-0 flex h-full w-6 flex-col justify-around bg-bloom-green/80">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="mx-auto h-2 w-3 rounded-sm bg-bloom-cream" />
        ))}
      </div>

      <div className="ml-7">
        <p className="font-display text-2xl text-bloom-green">I ♥ AMO</p>

        {/* Alphabet polaroid tiles */}
        <div className="mt-3 flex flex-wrap gap-2">
          {LETTERS.map((l, i) => (
            <motion.div
              key={l}
              initial={{ rotate: -8, opacity: 0, y: 8 }}
              animate={{ rotate: (i % 2 ? 1 : -1) * 4, opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="grid h-12 w-10 place-items-center rounded-sm bg-white pb-2 font-display text-lg text-bloom-green shadow"
            >
              {l}
            </motion.div>
          ))}
        </div>

        {/* Photo slots */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(photos.length ? photos.slice(0, 4) : [null, null]).map((p, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-md border-4 border-white bg-bloom-green/10 shadow"
              style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
            >
              {p ? (
                <img src={p.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-3xl">📷</div>
              )}
            </div>
          ))}
        </div>

        {step.note && (
          <p className="mt-4 font-display text-base italic text-bloom-green/80">“{step.note}”</p>
        )}

        <div className="mt-3 flex gap-2 text-xl">
          <span>💛</span><span>✶</span><span>🌼</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function NotebookScreen({ step, onNext }) {
  const palette = step.palette || 'pink';
  const pal = getPalette(palette);
  const [phase, setPhase] = useState('globe'); // globe → book

  return (
    <div
      className="fullscreen flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(circle at 50% 30%, #1b1438, #060312 80%)' }}
      onClick={phase === 'book' ? onNext : undefined}
    >
      <Starfield count={120} seed={21} />
      {phase === 'globe' ? (
        <LetterGlobe onComplete={() => setPhase('book')} />
      ) : (
        <>
          <Scratchbook step={step} />
          <TapHint />
        </>
      )}
      {phase === 'globe' && (
        <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-white/70">
          A MEMORY IS UNFOLDING…
        </p>
      )}
    </div>
  );
}
