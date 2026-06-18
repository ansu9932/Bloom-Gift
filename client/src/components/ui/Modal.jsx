import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Accessible-ish overlay modal. `fullScreen` makes it cover the viewport
// (used by the surface picker).
export default function Modal({ open, onClose, title, children, fullScreen = false }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bloom-dark/60 p-0 backdrop-blur-sm sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative flex flex-col overflow-hidden bg-bloom-cream shadow-2xl ${
              fullScreen
                ? 'h-full w-full sm:h-[92vh] sm:max-w-5xl sm:rounded-3xl'
                : 'max-h-[88vh] w-full max-w-lg rounded-3xl'
            }`}
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || onClose) && (
              <div className="flex items-center justify-between border-b border-bloom-green/10 px-6 py-4">
                <h3 className="font-display text-xl text-bloom-green">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full text-bloom-green/60 transition hover:bg-bloom-green/10"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
