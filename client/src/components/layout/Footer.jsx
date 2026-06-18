import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-bloom-green/10 bg-bloom-green text-bloom-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-semibold">BloomGift</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-bloom-cream/70">
            Send flowers that last forever. Compose a private animated gift and share a link — no app needed.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg">Create</h4>
          <ul className="mt-3 space-y-2 text-sm text-bloom-cream/70">
            <li><Link to="/compose" className="hover:text-bloom-gold">Compose a gift</Link></li>
            <li><Link to="/compose/bouquet" className="hover:text-bloom-gold">Bouquet composer</Link></li>
            <li><Link to="/flowers" className="hover:text-bloom-gold">Browse flowers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-bloom-cream/70">
            <li><Link to="/register" className="hover:text-bloom-gold">Create account</Link></li>
            <li><Link to="/login" className="hover:text-bloom-gold">Log in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg">Follow</h4>
          <div className="mt-3 flex gap-3">
            {['Instagram', 'TikTok', 'Pinterest'].map((s) => (
              <span
                key={s}
                className="grid h-9 w-9 place-items-center rounded-full bg-bloom-cream/10 text-xs"
                title={s}
              >
                {s[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-bloom-cream/10 px-4 py-5 text-center text-xs text-bloom-cream/50">
        © {year} BloomGift · Made with love · All code is original
      </div>
    </footer>
  );
}
