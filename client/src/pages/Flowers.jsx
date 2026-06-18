import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { flowers, flowerCount, searchFlowers } from '../data/flowers';
import FlowerGlyph from '../components/flowers/FlowerGlyph';

export default function Flowers() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL'); // ALL | STEM | BLOOM

  const list = useMemo(() => {
    let base = query.trim() ? searchFlowers(query) : flowers;
    if (type !== 'ALL') base = base.filter((f) => f.type === type);
    return base;
  }, [query, type]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-bloom-green">The flower library</h1>
          <p className="mt-1 text-bloom-green/60">
            {flowerCount} blooms, each with its own meaning. Build a bouquet from any of them.
          </p>
        </div>
        <Link to="/compose/bouquet" className="btn-gold py-2 text-sm">💐 Compose a bouquet</Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${flowerCount} blooms…`}
          className="input-field max-w-xs py-2"
        />
        <div className="inline-flex rounded-full border border-bloom-green/20 bg-white/60 p-1">
          {['ALL', 'STEM', 'BLOOM'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                type === t ? 'bg-bloom-green text-bloom-cream' : 'text-bloom-green/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="text-sm text-bloom-green/50">{list.length} shown</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {list.map((f) => (
          <div key={f.id} className="card-surface flex flex-col items-center p-3 text-center">
            <FlowerGlyph flower={f} size={64} />
            <p className="mt-1 text-sm font-medium text-bloom-green">{f.name}</p>
            <span
              className={`mt-0.5 rounded-full px-1.5 text-[9px] font-semibold ${
                f.type === 'BLOOM' ? 'bg-orange-100 text-orange-600' : 'bg-bloom-green/10 text-bloom-green/70'
              }`}
            >
              {f.type}
            </span>
            <p className="mt-1 text-xs italic text-bloom-green/50">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
