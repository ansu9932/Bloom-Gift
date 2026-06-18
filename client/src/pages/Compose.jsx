import { Link } from 'react-router-dom';
import ComposeStudio from '../components/compose/ComposeStudio';
import { useAuth } from '../lib/AuthContext';

export default function Compose() {
  const { plan } = useAuth();
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl text-bloom-green">Compose your gift</h1>
            <p className="text-sm text-bloom-green/60">
              Build a sequence of surfaces. Add a bouquet, notes, photos & music.
            </p>
          </div>
          <Link to="/compose/bouquet" className="btn-gold py-2 text-sm">
            💐 Compose a bouquet
          </Link>
        </div>
        {plan === 'free' && (
          <p className="mt-3 rounded-xl bg-bloom-gold/15 px-4 py-2 text-sm text-bloom-green/80">
            You're on the free plan (max 2 steps).{' '}
            <Link to="/pricing" className="font-semibold text-bloom-gold underline">
              Upgrade to Blooming
            </Link>{' '}
            for 30 steps, 12 blooms, scratch reveal & more.
          </p>
        )}
      </div>
      <ComposeStudio />
    </div>
  );
}
