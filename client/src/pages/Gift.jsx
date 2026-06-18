import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import GiftPreview from '../components/preview/GiftPreview';
import { GiftAPI } from '../lib/api';
import { decodeSequence } from '../utils/encode';

// Recipient view. Supports:
//   /gift?bouquetId=:slug  → fetch the gift from the API by slug
//   /gift?seq=:base64      → decode the gift straight from the URL (no DB)
export default function Gift() {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, sequence: null, error: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get('bouquetId') || params.get('slug');
    const seq = params.get('seq');

    if (seq) {
      const decoded = decodeSequence(seq);
      setState({ loading: false, sequence: decoded, error: decoded ? '' : 'Invalid gift link' });
      return;
    }

    if (!slug) {
      setState({ loading: false, sequence: null, error: 'No gift specified' });
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
        <div className="text-center">
          <p className="font-display text-2xl">{state.error || 'Gift not found'}</p>
          <a href="/compose" className="btn-gold mt-4 inline-block">Compose your own →</a>
        </div>
      </div>
    );
  }

  return <GiftPreview sequence={state.sequence} shareUrl={window.location.href} />;
}
