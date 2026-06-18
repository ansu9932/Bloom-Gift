import { motion } from 'framer-motion';
import { getPalette } from '../../data/themes';
import { getFlower } from '../../data/flowers';
import FlowerGlyph from '../flowers/FlowerGlyph';
import WrappedBouquet from '../bouquet/WrappedBouquet';
import TapHint from './TapHint';

// Reveal the composed bouquet. Reads inline `step.bouquet` ({ style, flowers })
// so it works from a URL-encoded gift without a DB lookup.
export default function BouquetDisplay({ step, onNext }) {
  const palette = step.palette || 'pink';
  const pal = getPalette(palette);
  const bouquet = step.bouquet || { style: 'classic', flowers: [] };
  const flowers = Array.isArray(bouquet.flowers) ? bouquet.flowers : [];

  return (
    <div className="fullscreen flex items-center justify-center overflow-hidden" style={{ background: pal.bg }} onClick={onNext}>
      <div className="relative h-[70vh] w-[90%] max-w-md">
        {/* Paper wrap cone behind the flowers */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <WrappedBouquet palette={palette} style={bouquet.style} width={260} />
        </div>

        {/* Flowers bloom in one by one */}
        <div className="absolute inset-0">
          {flowers.length === 0 && (
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2 text-center" style={{ color: pal.text }}>
              <FlowerGlyph color={pal.petal[0]} type="BLOOM" size={120} withStem={false} />
              <p className="mt-2 font-display text-lg">A bouquet, just for you</p>
            </div>
          )}
          {flowers.map((fl, i) => {
            const data = getFlower(fl.id);
            return (
              <motion.div
                key={fl.uid || i}
                className="absolute"
                style={{
                  left: `${fl.x}%`,
                  top: `${fl.y}%`,
                  zIndex: fl.zIndex || i,
                  transform: `translate(-50%, -50%)`,
                }}
                initial={{ scale: 0, rotate: (fl.rotation || 0) - 40, opacity: 0 }}
                animate={{ scale: fl.scale || 1, rotate: fl.rotation || 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.18, type: 'spring', stiffness: 200, damping: 12 }}
              >
                <div style={{ transform: fl.flip ? 'scaleX(-1)' : 'none' }}>
                  <FlowerGlyph
                    color={data?.color}
                    type={data?.type}
                    flowerId={fl.id}
                    size={90}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + flowers.length * 0.18 }}
          className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-2xl"
          style={{ color: pal.text }}
        >
          For you, with love
        </motion.p>
      </div>

      <TapHint />
    </div>
  );
}
