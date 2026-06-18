import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LockScreen from './LockScreen';
import IntroScreen from './IntroScreen';
import CardScreen from './CardScreen';
import NotebookScreen from './NotebookScreen';
import LetterScreen from './LetterScreen';
import BouquetDisplay from './BouquetDisplay';
import MiscScreen from './MiscScreen';
import HeartButton from './HeartButton';
import MusicPlayer from './MusicPlayer';

// Map a step kind to its screen renderer. Each screen receives onNext and calls
// it when the recipient should advance (single-tap screens immediately,
// multi-phase screens after their final phase).
function renderScreen(step, onNext) {
  switch (step.kind) {
    case 'intro':
      return <IntroScreen step={step} onNext={onNext} />;
    case 'card':
      return <CardScreen step={step} onNext={onNext} />;
    case 'notebook':
      return <NotebookScreen step={step} onNext={onNext} />;
    case 'letter':
      return <LetterScreen step={step} onNext={onNext} />;
    case 'bouquet':
      return <BouquetDisplay step={step} onNext={onNext} />;
    case 'misc':
      return <MiscScreen step={step} onNext={onNext} />;
    default:
      return <CardScreen step={step} onNext={onNext} />;
  }
}

export default function GiftPreview({ sequence, shareUrl }) {
  const steps = Array.isArray(sequence) ? sequence : [];
  const lockStep = steps.find((s) => s.kind === 'lock');
  const playSteps = steps.filter((s) => s.kind !== 'lock');

  const [unlocked, setUnlocked] = useState(!lockStep);
  const [index, setIndex] = useState(0);

  if (steps.length === 0) {
    return (
      <div className="fullscreen grid place-items-center bg-bloom-green text-bloom-cream">
        <div className="text-center">
          <p className="font-display text-2xl">This gift is empty</p>
          <a href="/compose" className="btn-gold mt-4 inline-block">Compose one →</a>
        </div>
      </div>
    );
  }

  if (lockStep && !unlocked) {
    return (
      <>
        <LockScreen step={lockStep} onUnlock={() => setUnlocked(true)} />
        <HeartButton shareUrl={shareUrl} />
      </>
    );
  }

  // index can run one past the last play step to show the "end" card.
  const current = playSteps[index];

  const advance = () => {
    setIndex((i) => Math.min(i + 1, playSteps.length));
  };

  return (
    <div className="fullscreen bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current?.id || index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          {current ? renderScreen(current, advance) : (
            <div className="fullscreen grid place-items-center bg-bloom-green text-bloom-cream">
              <div className="text-center">
                <p className="font-display text-3xl">The end 🌸</p>
                <p className="mt-2 opacity-80">Made with love on BloomGift</p>
                <a href="/compose" className="btn-gold mt-5 inline-block">Make your own →</a>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      {playSteps.length > 1 && (
        <div className="pointer-events-none fixed left-1/2 top-3 z-50 flex -translate-x-1/2 gap-1.5">
          {playSteps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      )}

      {current?.music && <MusicPlayer music={current.music} />}
      <HeartButton shareUrl={shareUrl} />
    </div>
  );
}
