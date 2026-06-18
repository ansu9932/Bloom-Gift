import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPalette } from '../../data/themes';
import Starfield from './Starfield';
import PetalField from './PetalField';
import TapHint from './TapHint';

// Background renderers keyed by cardId. Falls back to a soft palette gradient.
function CardBackground({ cardId, palette }) {
  const pal = getPalette(palette);
  switch (cardId) {
    case 'love-galaxy':
    case 'starlit-souvenir':
    case 'midnight-bloom':
      return (
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, #1b1438, #060312 80%)' }}>
          <Starfield count={180} seed={42} />
        </div>
      );
    case 'sapphire-vineyard':
      return <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#0a1430,#1b2a55)' }}><Starfield count={90} seed={9} shootingStars={1} /></div>;
    case 'seaside-reverie':
      return <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#7fb6c9,#cfe8ee)' }} />;
    case 'pastel-daydream':
    case 'rose-quartz':
    case 'blush-love-letters':
      return <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#f7d9e3,#fbeef0)' }}><PetalField palette="pink" count={18} /></div>;
    case 'golden-hour':
      return <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#f6c66a,#f3e3b0)' }} />;
    case 'forest-whisper':
    case 'meadow-light':
      return <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#1f3a23,#3a6b40)' }} />;
    case 'soft-nostalgia':
    case 'vintage-postcard':
      return <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#e8dcc2,#d8c4a0)' }} />;
    default:
      return <div className="absolute inset-0" style={{ background: pal.bg }}><PetalField palette={palette} count={14} /></div>;
  }
}

export default function CardScreen({ step, onNext }) {
  const palette = step.palette || 'pink';
  const pal = getPalette(palette);
  const [expanded, setExpanded] = useState(false);
  const note = step.note || 'Thinking of you, always.';
  const sender = step.senderName || 'Someone';
  const recipient = step.recipientName || 'You';

  return (
    <div className="fullscreen overflow-hidden text-white" onClick={onNext}>
      <CardBackground cardId={step.cardId} palette={palette} />

      {/* Floating note popup, bottom-right */}
      <motion.button
        initial={{ opacity: 0, y: 40, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 22 }}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(true);
        }}
        className="absolute bottom-24 right-5 z-20 max-w-[78%] rounded-2xl bg-white/90 p-5 text-left shadow-2xl backdrop-blur sm:right-10 sm:max-w-xs"
      >
        <p className="text-[10px] font-semibold tracking-[0.2em] text-bloom-green/50">{recipient.toUpperCase()}</p>
        <p className="mt-1 font-display text-lg text-bloom-green">A little note</p>
        <p className="mt-2 line-clamp-3 text-sm italic text-bloom-green/80">{note}</p>
        <p className="mt-3 text-right font-display text-sm text-bloom-green/70">— {sender}</p>
      </motion.button>

      {/* Expanded full-screen note */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-6 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              className="max-w-md rounded-3xl bg-bloom-cream p-8 text-center shadow-2xl"
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-bloom-green/50">A NOTE FOR {recipient.toUpperCase()}</p>
              <p className="mt-4 whitespace-pre-wrap font-display text-xl leading-relaxed text-bloom-green">{note}</p>
              <p className="mt-6 font-display text-lg text-bloom-green/70">With love, {sender}</p>
              <p className="mt-4 text-[11px] tracking-widest text-bloom-green/40">TAP TO CLOSE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-1/2 top-16 z-10 -translate-x-1/2 text-center" style={{ color: pal.text }}>
        <p className="font-display text-3xl sm:text-4xl" style={{ textShadow: '0 2px 18px rgba(0,0,0,0.4)' }}>
          For {recipient}
        </p>
      </div>

      <TapHint />
    </div>
  );
}
