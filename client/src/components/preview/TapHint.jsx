import { motion } from 'framer-motion';

// Subtle "tap to continue" hint shown at the bottom of advanceable screens.
export default function TapHint({ label = 'Tap anywhere to continue', light = true }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.3, 0.85, 0.3] }}
      transition={{ duration: 2.4, repeat: Infinity }}
      className={`pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs tracking-[0.25em] ${
        light ? 'text-white/80' : 'text-bloom-green/60'
      }`}
    >
      {label.toUpperCase()}
    </motion.div>
  );
}
