import { useState } from 'react';
import Modal from '../ui/Modal';
import { surfaceSections, kindBadge } from '../../data/surfaces';
import { paletteList } from '../../data/themes';
import FlowerGlyph from '../flowers/FlowerGlyph';

// Small visual thumbnail standing in for each surface preview.
function SurfaceThumb({ surface }) {
  const tone =
    surface.kind === 'lock'
      ? 'from-slate-700 to-slate-900'
      : surface.kind === 'intro'
      ? 'from-rose-300 to-rose-500'
      : surface.kind === 'card'
      ? 'from-indigo-300 to-purple-500'
      : surface.kind === 'notebook'
      ? 'from-amber-200 to-amber-400'
      : surface.kind === 'letter'
      ? 'from-orange-200 to-amber-300'
      : surface.kind === 'bouquet'
      ? 'from-pink-200 to-rose-400'
      : 'from-teal-300 to-cyan-500';
  const icon =
    surface.kind === 'lock'
      ? '🔒'
      : surface.kind === 'intro'
      ? '✨'
      : surface.kind === 'notebook'
      ? '📓'
      : surface.kind === 'letter'
      ? '💌'
      : surface.kind === 'bouquet'
      ? '💐'
      : surface.kind === 'misc'
      ? '🌌'
      : '💌';
  return (
    <div className={`grid aspect-[4/3] place-items-center rounded-lg bg-gradient-to-br ${tone} text-2xl`}>
      {surface.kind === 'bouquet' ? <FlowerGlyph color="#e8859a" type="BLOOM" size={40} withStem={false} /> : icon}
    </div>
  );
}

export default function SurfacePicker({ open, onClose, onPick }) {
  const [colorFilter, setColorFilter] = useState(null);
  const [openSections, setOpenSections] = useState(() => new Set(['special', 'card']));

  const toggleSection = (key) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const handlePick = (surface) => {
    onPick(surface.id, colorFilter || 'pink');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Choose a surface" fullScreen>
      <div className="px-5 py-4">
        {/* Palette filter (drives the new step's palette) */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-semibold tracking-widest text-bloom-green/50">PALETTE</span>
          {paletteList.map((p) => (
            <button
              key={p.id}
              onClick={() => setColorFilter(colorFilter === p.id ? null : p.id)}
              className={`h-6 w-6 rounded-full border-2 transition ${
                colorFilter === p.id ? 'scale-110 border-bloom-green' : 'border-white/70'
              }`}
              style={{ backgroundColor: p.dot }}
              title={p.label}
            />
          ))}
        </div>

        {surfaceSections.map((section) => {
          const isOpen = openSections.has(section.key);
          return (
            <div key={section.key} className="mb-4">
              <button
                onClick={() => toggleSection(section.key)}
                className="flex w-full items-center justify-between border-b border-bloom-green/10 py-2"
              >
                <span className="flex items-center gap-2">
                  <span className="font-display text-lg text-bloom-green">{section.label}</span>
                  {section.badges.map((b) => (
                    <span key={b} className="rounded-full bg-bloom-green/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-bloom-green/70">
                      {b}
                    </span>
                  ))}
                </span>
                <span className="text-sm text-bloom-green/50">
                  {section.items.length} {isOpen ? '▾' : '▸'}
                </span>
              </button>

              {isOpen && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {section.items.map((surface) => (
                    <button
                      key={surface.id}
                      onClick={() => handlePick(surface)}
                      className="rounded-xl border border-bloom-green/10 bg-white/70 p-2 text-left transition hover:border-bloom-gold hover:shadow"
                    >
                      <SurfaceThumb surface={surface} />
                      <p className="mt-2 line-clamp-1 text-sm font-medium text-bloom-green">{surface.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="rounded bg-bloom-green/10 px-1.5 text-[9px] font-semibold text-bloom-green/60">
                          {kindBadge[surface.kind]}
                        </span>
                        {(surface.tags || []).slice(0, 2).map((t) => (
                          <span key={t} className="rounded bg-bloom-gold/20 px-1.5 text-[9px] font-semibold text-bloom-gold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
