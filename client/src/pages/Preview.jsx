import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import GiftPreview from '../components/preview/GiftPreview';
import { decodeSequence } from '../utils/encode';

// Preview mode: reads the entire gift from the URL (?seq=base64). No DB needed.
export default function Preview() {
  const location = useLocation();
  const sequence = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const seq = params.get('seq');
    return seq ? decodeSequence(seq) : null;
  }, [location.search]);

  if (!sequence) {
    return (
      <div className="fullscreen grid place-items-center bg-bloom-green text-bloom-cream">
        <div className="text-center">
          <p className="font-display text-2xl">This preview link looks broken</p>
          <a href="/compose" className="btn-gold mt-4 inline-block">Compose a gift →</a>
        </div>
      </div>
    );
  }

  return <GiftPreview sequence={sequence} />;
}
