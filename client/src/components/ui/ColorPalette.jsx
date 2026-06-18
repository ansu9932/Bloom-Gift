import { paletteList } from '../../data/themes';

// Row of palette color dots used to theme a step / the whole gift.
export default function ColorPalette({ value, onChange, size = 'md' }) {
  const dot = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {paletteList.map((p) => {
        const active = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            title={p.label}
            onClick={() => onChange(p.id)}
            className={`${dot} rounded-full border-2 transition ${
              active ? 'scale-110 border-bloom-green' : 'border-white/70 hover:scale-105'
            }`}
            style={{ backgroundColor: p.dot }}
            aria-label={p.label}
          />
        );
      })}
    </div>
  );
}
