import { useState } from 'react';
import { motion } from 'framer-motion';
import { getPalette } from '../../data/themes';
import FlowerGlyph from '../flowers/FlowerGlyph';
import { seededRandom } from '../../utils/animations';

// Scattered botanical backdrop, palette-aware.
function ScatteredBotanicals({ palette }) {
  const pal = getPalette(palette);
  const rand = seededRandom(palette.length * 13 + 5);
  const items = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: rand() * 100,
    top: rand() * 100,
    size: rand() * 50 + 40,
    rotate: rand() * 360,
    color: pal.petal[i % pal.petal.length],
    type: i % 3 === 0 ? 'BLOOM' : 'STEM',
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it) => (
        <div
          key={it.id}
          className="absolute opacity-40"
          style={{ left: `${it.left}%`, top: `${it.top}%`, transform: `rotate(${it.rotate}deg)` }}
        >
          <FlowerGlyph color={it.color} type={it.type} size={it.size} withStem={false} />
        </div>
      ))}
    </div>
  );
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export default function LockScreen({ step, onUnlock }) {
  const palette = step.palette || 'pink';
  const pal = getPalette(palette);
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('idle'); // idle | opening | wrong
  const recipient = step.recipientName || 'You';
  const expected = step.lockPin || '';

  const handleDigit = (d) => {
    if (status === 'opening') return;
    if (d === '⌫') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (d === '') return;
    const next = (pin + d).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      // If no PIN was set, any 4 digits unlock.
      if (!expected || next === expected) {
        setStatus('opening');
        setTimeout(onUnlock, 850);
      } else {
        setStatus('wrong');
        setTimeout(() => {
          setPin('');
          setStatus('idle');
        }, 650);
      }
    }
  };

  return (
    <div className="fullscreen flex items-center justify-center" style={{ background: pal.bg }}>
      <ScatteredBotanicals palette={palette} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-[88%] max-w-sm rounded-3xl border border-white/20 bg-white/15 p-7 text-center backdrop-blur-xl ${
          status === 'wrong' ? 'animate-shake' : ''
        }`}
        style={{ color: pal.text }}
      >
        <motion.div
          animate={status === 'opening' ? { rotate: [0, -8, 0], y: [0, -4, 0] } : {}}
          className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6">
            {status === 'opening' ? (
              <path d="M7 11V7a5 5 0 0 1 9.9-1M5 11h14v9H5z" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M7 11V7a5 5 0 0 1 10 0v4M5 11h14v9H5z" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </motion.div>

        <h1 className="font-display text-2xl">Welcome, {recipient}</h1>
        <p className="mt-1 text-sm italic opacity-80">a little secret…</p>

        <div className="my-5 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-full border transition"
              style={{
                borderColor: pal.text,
                backgroundColor: i < pin.length ? pal.text : 'transparent',
              }}
            />
          ))}
        </div>

        <p className="mb-4 h-5 text-xs tracking-widest opacity-80">
          {status === 'opening' ? 'OPENING…' : status === 'wrong' ? 'TRY AGAIN' : ''}
        </p>

        <div className="mx-auto grid max-w-[240px] grid-cols-3 gap-3">
          {KEYS.map((k, idx) => (
            <button
              key={idx}
              type="button"
              disabled={k === ''}
              onClick={() => handleDigit(k)}
              className={`grid h-14 place-items-center rounded-2xl text-xl font-medium transition ${
                k === ''
                  ? 'cursor-default opacity-0'
                  : 'bg-white/15 hover:bg-white/25 active:scale-95'
              }`}
              style={{ color: pal.text }}
            >
              {k}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
