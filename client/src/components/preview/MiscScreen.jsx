import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getPalette } from '../../data/themes';
import Starfield from './Starfield';
import PetalField from './PetalField';
import FlowerGlyph from '../flowers/FlowerGlyph';
import { seededRandom } from '../../utils/animations';
import TapHint from './TapHint';

function Fireflies() {
  const dots = useMemo(() => {
    const rand = seededRandom(99);
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      delay: rand() * 3,
    }));
  }, []);
  return (
    <div className="absolute inset-0">
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute h-2 w-2 rounded-full bg-yellow-200"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            boxShadow: '0 0 8px 2px rgba(255,240,150,0.8)',
            animation: `twinkle ${1.5 + d.delay}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function MiscScreen({ step, onNext }) {
  const palette = step.palette || 'pink';
  const pal = getPalette(palette);
  const style = step.miscId || 'glass-heart-orbit';
  const note = step.note;
  const recipient = step.recipientName || 'You';

  const dark = ['glass-heart-orbit', 'heart-beat-love', 'aurora-veil', 'fireflies', 'moonlit-garden'].includes(style);
  const bg =
    style === 'aurora-veil'
      ? 'linear-gradient(160deg,#0b1f2b,#1b4a4a,#3a2a5a)'
      : style === 'moonlit-garden'
      ? 'linear-gradient(180deg,#0a142b,#1b2a55)'
      : dark
      ? 'radial-gradient(circle at 50% 35%, #2a1438, #070313 80%)'
      : pal.bg;

  return (
    <div className="fullscreen flex items-center justify-center overflow-hidden text-white" style={{ background: bg }} onClick={onNext}>
      {(style === 'glass-heart-orbit' || style === 'heart-beat-love' || style === 'moonlit-garden') && (
        <Starfield count={130} seed={style.length * 7} />
      )}
      {style === 'fireflies' && <Fireflies />}
      {(style === 'petal-rain' || style === 'confetti-heart') && <PetalField palette={palette} count={36} />}

      <div className="relative z-10 text-center">
        <motion.div
          animate={
            style === 'heart-beat-love'
              ? { scale: [1, 1.18, 1] }
              : style === 'glass-heart-orbit'
              ? { rotate: 360 }
              : { y: [0, -8, 0] }
          }
          transition={{
            duration: style === 'glass-heart-orbit' ? 14 : 1.4,
            repeat: Infinity,
            ease: style === 'glass-heart-orbit' ? 'linear' : 'easeInOut',
          }}
          className="mx-auto text-7xl"
        >
          {style === 'confetti-heart' || style === 'heart-beat-love' || style === 'glass-heart-orbit' ? '💗' : '🌸'}
        </motion.div>

        <p className="mt-5 font-display text-3xl" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}>
          For {recipient}
        </p>

        {note && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-4 max-w-xs px-6 font-display text-lg italic opacity-90"
          >
            “{note}”
          </motion.p>
        )}

        <div className="mt-6 flex justify-center gap-3 opacity-80">
          {pal.petal.slice(0, 3).map((c, i) => (
            <FlowerGlyph key={i} color={c} type="BLOOM" size={44} withStem={false} />
          ))}
        </div>
      </div>

      <TapHint />
    </div>
  );
}
