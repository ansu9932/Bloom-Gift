import { useState } from 'react';
import { motion } from 'framer-motion';
import { getPalette } from '../../data/themes';
import Starfield from './Starfield';
import FlowerGlyph from '../flowers/FlowerGlyph';

// Envelope opens → letter slides out → tap to flip and read the note on the back.
export default function LetterScreen({ step, onNext }) {
  const palette = step.palette || 'pink';
  const pal = getPalette(palette);
  const [phase, setPhase] = useState('closed'); // closed → open → reading → flipped
  const note = step.note || 'Every petal here is a thought of you.';
  const sender = step.senderName || 'Someone';

  const advance = () => {
    setPhase((p) => {
      if (p === 'closed') return 'open';
      if (p === 'open') return 'reading';
      if (p === 'reading') return 'flipped';
      onNext?.(); // already flipped → move to next step
      return 'flipped';
    });
  };

  return (
    <div
      className="fullscreen flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(circle at 50% 30%, #1b1438, #060312 80%)' }}
      onClick={advance}
    >
      <Starfield count={110} seed={33} />

      <div className="relative z-10 h-[60vh] w-[88%] max-w-sm" style={{ perspective: 1200 }}>
        {/* The letter */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[300px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-bloom-cream p-6 shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ y: 60, opacity: 0 }}
          animate={{
            y: phase === 'closed' ? 60 : phase === 'open' ? -30 : -50,
            opacity: phase === 'closed' ? 0 : 1,
            rotateY: phase === 'flipped' ? 180 : 0,
          }}
          transition={{ duration: 0.7 }}
        >
          {/* Front of letter */}
          <div style={{ backfaceVisibility: 'hidden' }}>
            <p className="font-display text-lg text-bloom-green">To my love,</p>
            <p className="mt-3 line-clamp-6 text-sm leading-relaxed text-bloom-green/80">{note}</p>
            <p className="mt-4 font-display text-base text-bloom-green/70">With all my love,<br />{sender}</p>
            {phase === 'reading' && (
              <p className="mt-3 text-[10px] tracking-widest text-bloom-green/40">TAP TO FLIP →</p>
            )}
          </div>
          {/* Back of letter */}
          <div
            className="absolute inset-0 rounded-md bg-bloom-cream p-6"
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
          >
            <p className="text-[10px] font-semibold tracking-[0.2em] text-bloom-green/50">A NOTE ON THE BACK</p>
            <p className="mt-3 whitespace-pre-wrap font-display text-base italic leading-relaxed text-bloom-green">{note}</p>
          </div>
        </motion.div>

        {/* Envelope */}
        <div className="absolute bottom-6 left-1/2 h-[150px] w-[260px] -translate-x-1/2">
          <div className="absolute inset-0 rounded-md bg-[#caa46f] shadow-xl" />
          <div className="absolute inset-x-0 bottom-0 h-[110px] rounded-b-md bg-[#b8915c]" />
          {/* Flap */}
          <motion.div
            className="absolute left-0 top-0 h-0 w-0"
            style={{
              borderLeft: '130px solid transparent',
              borderRight: '130px solid transparent',
              borderTop: '78px solid #d8b884',
              transformOrigin: 'top',
            }}
            animate={{ rotateX: phase === 'closed' ? 0 : 180 }}
            transition={{ duration: 0.6 }}
          />
          {/* Bouquet decoration on the envelope */}
          <div className="absolute -right-3 -top-8">
            <FlowerGlyph color={pal.petal[0]} type="BLOOM" size={56} withStem={false} />
          </div>
        </div>
      </div>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.25em] text-white/70">
        {phase === 'closed'
          ? 'TAP TO OPEN THE ENVELOPE'
          : phase === 'flipped'
          ? 'YOUR NOTE IS ON THE BACK'
          : 'TAP TO CONTINUE'}
      </p>
    </div>
  );
}
