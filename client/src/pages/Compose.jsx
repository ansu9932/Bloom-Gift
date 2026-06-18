import { Link } from 'react-router-dom';
import ComposeStudio from '../components/compose/ComposeStudio';

export default function Compose() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl text-bloom-green">Compose your gift</h1>
            <p className="text-sm text-bloom-green/60">
              Build a sequence of surfaces. Add a bouquet, notes, photos & music — all free.
            </p>
          </div>
          <Link to="/compose/bouquet" className="btn-gold py-2 text-sm">
            💐 Compose a bouquet
          </Link>
        </div>
      </div>
      <ComposeStudio />
    </div>
  );
}
