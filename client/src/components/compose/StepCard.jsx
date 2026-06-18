import { getSurface, kindBadge } from '../../data/surfaces';
import { getPalette } from '../../data/themes';

// A single step card in the timeline.
export default function StepCard({ step, index, active, onSelect }) {
  const surface = getSurface(step.surfaceId);
  const pal = getPalette(step.palette);
  const num = String(index + 1).padStart(2, '0');

  return (
    <button
      onClick={() => onSelect(step.id)}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
        active
          ? 'border-bloom-gold bg-white shadow'
          : 'border-bloom-green/10 bg-white/60 hover:border-bloom-green/30'
      }`}
    >
      <span className="font-display text-lg text-bloom-green/40">{num}</span>
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg"
        style={{ background: pal.bg, color: pal.text }}
      >
        {step.kind === 'lock'
          ? '🔒'
          : step.kind === 'intro'
          ? '✨'
          : step.kind === 'notebook'
          ? '📓'
          : step.kind === 'letter'
          ? '💌'
          : step.kind === 'bouquet'
          ? '💐'
          : step.kind === 'misc'
          ? '🌌'
          : '🎴'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-bloom-green">
          {surface?.name || step.kind}
        </span>
        <span className="mt-0.5 inline-block rounded bg-bloom-green/10 px-1.5 text-[9px] font-semibold tracking-wide text-bloom-green/60">
          {kindBadge[step.kind] || step.kind.toUpperCase()}
        </span>
      </span>
    </button>
  );
}
