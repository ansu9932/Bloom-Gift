import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Persistent heart button, bottom-right of the gift experience.
// Opens a small popup with Save / Share / Open actions.
export default function HeartButton({ shareUrl }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be blocked */
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'A gift for you 🌸', url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    copy();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-52 rounded-2xl bg-white/95 p-3 shadow-2xl backdrop-blur"
          >
            <p className="px-1 pb-2 font-display text-sm text-bloom-green">Loved this gift?</p>
            <button onClick={share} className="mb-1 w-full rounded-xl px-3 py-2 text-left text-sm text-bloom-green hover:bg-bloom-green/5">
              📤 Share
            </button>
            <button onClick={copy} className="mb-1 w-full rounded-xl px-3 py-2 text-left text-sm text-bloom-green hover:bg-bloom-green/5">
              {copied ? '✓ Link copied' : '🔗 Copy link'}
            </button>
            <a href="/compose" className="block w-full rounded-xl px-3 py-2 text-left text-sm text-bloom-green hover:bg-bloom-green/5">
              🌷 Make your own
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-bloom-rose to-[#d97a93] text-2xl shadow-xl"
        style={{ animation: 'heartPulse 1.6s ease-in-out infinite' }}
        aria-label="Gift actions"
      >
        <span>💗</span>
      </button>
    </div>
  );
}
