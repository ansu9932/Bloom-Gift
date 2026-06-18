import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { GiftAPI, BouquetAPI } from '../lib/api';
import FlowerGlyph from '../components/flowers/FlowerGlyph';

export default function Dashboard() {
  const { isAuthed, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [gifts, setGifts] = useState([]);
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthed) {
      navigate('/login');
      return;
    }
    let active = true;
    Promise.all([GiftAPI.mine().catch(() => ({ gifts: [] })), BouquetAPI.mine().catch(() => ({ bouquets: [] }))])
      .then(([g, b]) => {
        if (!active) return;
        setGifts(g.gifts || []);
        setBouquets(b.bouquets || []);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [isAuthed, authLoading, navigate]);

  const removeGift = async (id) => {
    await GiftAPI.remove(id).catch(() => {});
    setGifts((prev) => prev.filter((g) => g.id !== id));
  };

  if (authLoading || loading) {
    return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-bloom-green/60">Loading your garden…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-bloom-green">Hi, {user?.username} 🌿</h1>
          <p className="text-sm text-bloom-green/60">
            Plan: <span className="font-medium capitalize">{user?.plan}</span>
            {user?.plan === 'free' && (
              <>
                {' '}·{' '}
                <Link to="/pricing" className="font-semibold text-bloom-gold">Upgrade</Link>
              </>
            )}
          </p>
        </div>
        <Link to="/compose" className="btn-primary py-2 text-sm">Compose a gift →</Link>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {/* Gifts */}
      <h2 className="mt-10 font-display text-xl text-bloom-green">Your gifts</h2>
      {gifts.length === 0 ? (
        <p className="mt-2 text-sm text-bloom-green/50">No gifts yet. Compose your first one!</p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {gifts.map((g) => (
            <div key={g.id} className="card-surface p-4">
              <p className="font-display text-lg text-bloom-green">For {g.recipient_name}</p>
              <p className="text-xs text-bloom-green/50">from {g.sender_name} · {g.view_count} views</p>
              <div className="mt-3 flex gap-2">
                <a href={`/gift?bouquetId=${g.slug}`} target="_blank" rel="noreferrer" className="btn-ghost py-1.5 text-xs">
                  Open
                </a>
                <button onClick={() => removeGift(g.id)} className="text-xs text-red-500 hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouquets */}
      <h2 className="mt-10 font-display text-xl text-bloom-green">Your bouquets</h2>
      {bouquets.length === 0 ? (
        <p className="mt-2 text-sm text-bloom-green/50">No saved bouquets yet.</p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bouquets.map((b) => (
            <div key={b.id} className="card-surface flex items-center gap-3 p-4">
              <div className="flex -space-x-3">
                {(b.flowers || []).slice(0, 3).map((fl, i) => (
                  <FlowerGlyph key={i} flowerId={fl.id} size={34} withStem={false} />
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-bloom-green">{b.name}</p>
                <p className="text-xs text-bloom-green/50">{b.bloom_count} blooms</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
