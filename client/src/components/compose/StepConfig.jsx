import { getSurface, kindBadge } from '../../data/surfaces';
import Toggle from '../ui/Toggle';
import ColorPalette from '../ui/ColorPalette';
import NoteEditor from './NoteEditor';
import MediaUploader from './MediaUploader';
import FlowerGlyph from '../flowers/FlowerGlyph';

const includeNoneOptions = [
  { value: true, label: 'Include' },
  { value: false, label: 'None' },
];

function Section({ title, sub, children, right }) {
  return (
    <div className="border-t border-bloom-green/10 py-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-display text-base text-bloom-green">{title}</p>
          {sub && <p className="text-xs text-bloom-green/50">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

// Right panel: configures the currently selected step.
export default function StepConfig({ step, savedBouquet, onChange, onRemove }) {
  if (!step) {
    return (
      <div className="grid h-full place-items-center rounded-2xl border border-dashed border-bloom-green/20 p-8 text-center text-bloom-green/50">
        Select a step on the left to configure it, or add a surface.
      </div>
    );
  }

  const surface = getSurface(step.surfaceId);
  const set = (patch) => onChange(step.id, patch);

  const hasBouquet = savedBouquet && Array.isArray(savedBouquet.flowers) && savedBouquet.flowers.length > 0;

  return (
    <div className="rounded-2xl border border-bloom-green/10 bg-white/60 p-5">
      {/* Surface header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="rounded bg-bloom-green/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-bloom-green/60">
            {kindBadge[step.kind] || step.kind.toUpperCase()}
          </span>
          <h2 className="mt-1 font-display text-2xl text-bloom-green">{surface?.name || step.kind}</h2>
          <p className="text-xs text-bloom-green/50">Swap surface via + on the timeline</p>
        </div>
        <button onClick={() => onRemove(step.id)} className="text-sm font-medium text-red-500 hover:text-red-600">
          Remove
        </button>
      </div>

      {/* Palette */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold tracking-widest text-bloom-green/50">PALETTE</p>
        <ColorPalette value={step.palette} onChange={(p) => set({ palette: p })} size="sm" />
      </div>

      {/* Lock-specific */}
      {step.kind === 'lock' && (
        <Section title="PIN lock" sub="4-digit code the recipient enters to open the gift">
          <input
            value={step.lockPin || ''}
            onChange={(e) => set({ lockPin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            inputMode="numeric"
            placeholder="e.g. 2005"
            className="input-field max-w-[160px] tracking-[0.4em]"
          />
        </Section>
      )}

      {/* Intro-specific */}
      {step.kind === 'intro' && (
        <Section title="Intro animation" sub="The opening burst the recipient sees">
          <Toggle
            value={step.introId || 'xoxo'}
            onChange={(v) => set({ introId: v })}
            options={[
              { value: 'xoxo', label: 'XOXO Burst' },
              { value: 'love-letter', label: 'Love Letter' },
              { value: 'garden', label: 'Garden' },
            ]}
          />
        </Section>
      )}

      {/* Bouquet */}
      {step.kind !== 'lock' && step.kind !== 'intro' && (
        <Section
          title="Bouquet"
          sub="Attach your composed bouquet to this surface"
          right={
            <Toggle
              value={!!step.includeBouquet}
              onChange={(v) => set({ includeBouquet: v, bouquet: v && hasBouquet ? savedBouquet : null })}
              options={includeNoneOptions}
            />
          }
        >
          {step.includeBouquet &&
            (hasBouquet ? (
              <div className="flex items-center gap-3 rounded-xl border-2 border-bloom-gold bg-white/70 p-3">
                <div className="flex -space-x-3">
                  {savedBouquet.flowers.slice(0, 4).map((fl, i) => (
                    <FlowerGlyph key={i} flowerId={fl.id} size={36} withStem={false} />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-bloom-green">
                    Picked: {savedBouquet.style === 'paper' ? 'Paper' : 'Classic'} Bouquet
                  </p>
                  <p className="text-xs text-bloom-green/50">{savedBouquet.flowers.length} blooms</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-bloom-green/20 p-3 text-sm text-bloom-green/60">
                No saved bouquet yet.{' '}
                <a href="/compose/bouquet" className="font-medium text-bloom-gold underline">
                  Compose one →
                </a>
              </div>
            ))}
        </Section>
      )}

      {/* Message */}
      {step.kind !== 'lock' && step.kind !== 'intro' && (
        <Section title="Message">
          <NoteEditor value={step.note} onChange={(v) => set({ note: v })} />
        </Section>
      )}

      {/* Media (notebook / card / misc / letter) */}
      {['notebook', 'card', 'misc', 'letter'].includes(step.kind) && (
        <>
          <Section
            title="Media"
            sub="Photos & video for this surface"
            right={
              <Toggle
                value={!!step.scratchReveal}
                onChange={(v) => set({ scratchReveal: v })}
                options={includeNoneOptions}
              />
            }
          >
            <MediaUploader media={step.media} onChange={(m) => set({ media: m })} />
            <p className="mt-2 text-xs text-bloom-green/50">
              Scratch reveal: {step.scratchReveal ? 'on — photo is hidden until scratched' : 'off'}
            </p>
          </Section>

          <Section title="Music" sub="Plays when this surface appears">
            <input
              value={step.music?.spotify || ''}
              onChange={(e) => set({ music: { ...step.music, spotify: e.target.value } })}
              placeholder="https://open.spotify.com/track/…"
              className="input-field mb-2 text-sm"
            />
            <input
              value={step.music?.youtube || ''}
              onChange={(e) => set({ music: { ...step.music, youtube: e.target.value } })}
              placeholder="https://youtube.com/watch?v=…"
              className="input-field mb-2 text-sm"
            />
            <input
              value={step.music?.startAt || ''}
              onChange={(e) => set({ music: { ...step.music, startAt: e.target.value } })}
              placeholder="Start at: 1:30 or 90"
              className="input-field max-w-[180px] text-sm"
            />
          </Section>
        </>
      )}
    </div>
  );
}
