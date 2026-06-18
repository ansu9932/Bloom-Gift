import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import GiftPreview from '../components/preview/GiftPreview';
import ErrorBoundary from '../components/ErrorBoundary';
import { GiftAPI } from '../lib/api';
import { decodeSequence } from '../utils/encode';

// Full-screen, on-brand fallback if the gift experience itself crashes.
function GiftError({ message }) {
  return (
    <div className="fullscreen grid place-items-center bg-bloom-green text-bloom-cream">
      <div className="px-6 text-center">
        <p className="font-display text-2xl">This gift couldn't be opened</p>
        <p className="mt-2 text-sm text-bloom-cream/70">{message}</p>
        <a href="/compose" className="btn-gold mt-4 inline-block">Compose your own →</a>
      </div>
    </div>
  );
}

// Recipient view. Supports:
//   /gift?seq=:base64      → decode the gift straight from the URL (NO backend)
//   /gift?bouquetId=:slug  → fetch a saved gift from the API by slug
// The seq path is checked first and never touches the network, so shared links
// work for anyone, logged in or not, even if the backend is down.
export default function Gift() {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, sequence: null, error: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const seq = params.get('seq');
    const slug = params.get('bouquetId') || params.get('slug');

    // 1) Self-contained URL gift — fully decoded client-side, no API call.
    if (seq) {
      const decoded = decodeSequence(seq);
      setState({
        loading: false,
        sequence: decoded,
        error: decoded ? '' : 'This gift link looks broken.',
      });
      return;
    }

    // 2) Saved gift — requires the backend.
    if (!slug) {
      setState({ loading: false, sequence: null, error: 'No gift specified.' });
      return;
    }

    let active = true;
    GiftAPI.bySlug(slug)
      .then(({ gift }) => {
        if (active) setState({ loading: false, sequence: gift.sequence_data, error: '' });
      })
      .catch((e) => {
        if (active) setState({ loading: false, sequence: null, error: e.message });
      });
    return () => {
      active = false;
    };
  }, [location.search]);

  if (state.loading) {
    return (
      <div className="fullscreen grid place-items-center bg-bloom-green text-bloom-cream">
        <p className="animate-pulse font-display text-xl">Unwrapping your gift…</p>
      </div>
    );
  }

  if (state.error || !state.sequence) {
    return (
      <div className="fullscreen grid place-items-center bg-bloom-green text-bloom-cream">
        <div className="px-6 text-center">
          <p className="font-display text-2xl">{state.error || 'Gift not found'}</p>
          <a href="/compose" className="btn-gold mt-4 inline-block">Compose your own →</a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={({ message }) => <GiftError message={message} />}>
      <GiftPreview sequence={state.sequence} shareUrl={window.location.href} />
    </ErrorBoundary>
  );
}
