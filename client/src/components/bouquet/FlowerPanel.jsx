import { useMemo, useState } from 'react';
import { flowersByLetter, flowerLetters, searchFlowers, flowerCount } from '../../data/flowers';
import FlowerGlyph from '../flowers/FlowerGlyph';

function FlowerTile({ flower, onAdd, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onAdd(flower)}
      className="group flex flex-col items-center rounded-xl border border-bloom-green/10 bg-white/70 p-2 text-center transition hover:border-bloom-gold hover:shadow disabled:opacity-40"
      title={flower.description}
    >
      <FlowerGlyph flower={flower} size={48} withStem={false} />
      <span className="mt-1 line-clamp-1 text-[11px] font-medium text-bloom-green">{flower.name}</span>
      <span
        className={`mt-0.5 rounded-full px-1.5 text-[9px] font-semibold tracking-wide ${
          flower.type === 'BLOOM' ? 'bg-orange-100 text-orange-600' : 'bg-bloom-green/10 text-bloom-green/70'
        }`}
      >
        {flower.type}
      </span>
    </button>
  );
}

export default function FlowerPanel({ onAdd, count, maxBlooms }) {
  const [query, setQuery] = useState('');
  const [openLetters, setOpenLetters] = useState(() => new Set(['A']));
  const full = count >= maxBlooms;

  const searching = query.trim().length > 0;
  const results = useMemo(() => (searching ? searchFlowers(query) : []), [query, searching]);

  const toggle = (letter) =>
    setOpenLetters((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) next.delete(letter);
      else next.add(letter);
      return next;
    });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-1 pb-2">
        <h3 className="font-display text-lg text-bloom-green">Flowers</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            full ? 'bg-red-100 text-red-600' : 'bg-bloom-green/10 text-bloom-green'
          }`}
        >
          {count}/{maxBlooms}
        </span>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${flowerCount} blooms`}
        className="input-field mb-3 py-2 text-sm"
      />

      {full && (
        <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          Bouquet is full ({maxBlooms}). Remove a flower to add more.
        </p>
      )}

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
        {searching ? (
          <div className="grid grid-cols-3 gap-2">
            {results.map((fl) => (
              <FlowerTile key={fl.id} flower={fl} onAdd={onAdd} disabled={full} />
            ))}
            {results.length === 0 && (
              <p className="col-span-3 py-6 text-center text-sm text-bloom-green/50">No flowers found.</p>
            )}
          </div>
        ) : (
          flowerLetters.map((letter) => {
            const list = flowersByLetter[letter];
            const open = openLetters.has(letter);
            return (
              <div key={letter} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggle(letter)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm font-semibold text-bloom-green hover:bg-bloom-green/5"
                >
                  <span>
                    {letter} <span className="text-bloom-green/40">({list.length})</span>
                  </span>
                  <span className="text-bloom-green/40">{open ? '▾' : '▸'}</span>
                </button>
                {open && (
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    {list.map((fl) => (
                      <FlowerTile key={fl.id} flower={fl} onAdd={onAdd} disabled={full} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
