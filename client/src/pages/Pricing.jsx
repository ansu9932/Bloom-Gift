import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    cadence: 'forever',
    features: [
      'Compose gifts',
      '2 gift steps max',
      '3 starter surfaces',
      'Classic bouquet (1 bloom)',
      'Permanent gift link',
    ],
    cta: 'Start free',
  },
  {
    id: 'blooming',
    name: 'Blooming',
    price: '₹299',
    cadence: '/month · or ₹2499/year',
    highlight: true,
    features: [
      'Everything in Free',
      '30 gift steps',
      'All 30+ surfaces unlocked',
      'Full bouquet (12 blooms)',
      'Browse all 400+ flowers',
      'Scratch reveal feature',
      'Voice note recording',
      'Photo & video upload (43 per step)',
      'Spotify & YouTube embeds',
      'Custom PIN lock',
      'Dual intro animations',
    ],
    cta: 'Go Blooming',
  },
];

export default function Pricing() {
  const { isAuthed, plan: currentPlan, upgrade } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState('');

  const choose = async (planId) => {
    if (!isAuthed) {
      navigate('/register');
      return;
    }
    setBusy(planId);
    try {
      await upgrade(planId);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="text-center">
        <h1 className="font-display text-4xl text-bloom-green">Simple, blooming pricing</h1>
        <p className="mt-2 text-bloom-green/60">Start free. Upgrade when you want the full garden.</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-3xl border p-7 ${
              p.highlight
                ? 'border-bloom-gold bg-white shadow-xl'
                : 'border-bloom-green/15 bg-white/60'
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-7 rounded-full bg-bloom-gold px-3 py-1 text-xs font-semibold text-bloom-dark">
                Most loved
              </span>
            )}
            <h2 className="font-display text-2xl text-bloom-green">{p.name}</h2>
            <p className="mt-2">
              <span className="font-display text-4xl text-bloom-green">{p.price}</span>{' '}
              <span className="text-sm text-bloom-green/50">{p.cadence}</span>
            </p>
            <ul className="mt-5 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-bloom-green/80">
                  <span className="text-bloom-gold">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => choose(p.id)}
              disabled={busy === p.id || currentPlan === p.id}
              className={`mt-6 w-full ${p.highlight ? 'btn-primary' : 'btn-ghost'}`}
            >
              {currentPlan === p.id ? 'Current plan' : busy === p.id ? 'Updating…' : p.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-bloom-green/50">
        Prices shown in INR — adjust for your market.{' '}
        <Link to="/compose" className="font-semibold text-bloom-gold">Or just start composing →</Link>
      </p>
    </div>
  );
}
