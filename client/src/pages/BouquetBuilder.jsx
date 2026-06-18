import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBouquet } from '../hooks/useBouquet';
import { useAuth } from '../lib/AuthContext';
import { BouquetAPI } from '../lib/api';
import BouquetComposer from '../components/bouquet/BouquetComposer';

const STORAGE_KEY = 'bloomgift_bouquet';

export default function BouquetBuilder() {
  const navigate = useNavigate();
  const { isAuthed } = useAuth();
  const bouquet = useBouquet();
  const [palette, setPalette] = useState('pink');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Restore any existing draft bouquet.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.flowers)) bouquet.loadFlowers(data.flowers);
        if (data.style) bouquet.setStyle(data.style);
        if (data.palette) setPalette(data.palette);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistLocal = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ style: bouquet.style, flowers: bouquet.flowers, palette })
    );
  };

  const handleContinue = async () => {
    setError('');
    persistLocal();
    // Best-effort save to backend when signed in.
    if (isAuthed) {
      setSaving(true);
      try {
        await BouquetAPI.create({
          name: 'Classic Bouquet',
          style: bouquet.style,
          flowers: bouquet.flowers,
        });
      } catch (e) {
        // Non-fatal: the bouquet still lives in localStorage for the sequence.
        setError(e.message);
      } finally {
        setSaving(false);
      }
    }
    navigate('/compose');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.3em] text-bloom-gold">— STEP ONE OF THREE</p>
        <h1 className="font-display text-3xl text-bloom-green sm:text-4xl">
          Compose <span className="italic">a bouquet</span>
        </h1>
        <p className="mt-1 text-sm text-bloom-green/60">
          Pick your blooms — arrange as many as you like, completely free.
        </p>
      </div>

      <BouquetComposer bouquet={bouquet} palette={palette} onPaletteChange={setPalette} />

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex items-center justify-between">
        <button onClick={() => bouquet.clearAll()} className="btn-ghost py-2 text-sm">
          Clear
        </button>
        <button onClick={handleContinue} disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Continue to gift design →'}
        </button>
      </div>
    </div>
  );
}
