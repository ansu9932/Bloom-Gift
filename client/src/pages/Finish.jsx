import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { GiftAPI } from '../lib/api';
import { buildPreviewUrl } from '../utils/encode';

const FINISH_KEY = 'bloomgift_finish_sequence';

export default function Finish() {
  const [draft, setDraft] = useState(null);
  const [gift, setGift] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FINISH_KEY);
      if (raw) setDraft(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // The shareable URL: a permanent slug URL once saved, else a self-contained
  // preview URL that embeds the whole gift. Guarded so an encoding hiccup can
  // never blank the page.
  const previewUrl = useMemo(() => {
    if (!draft?.sequence) return '';
    try {
      return buildPreviewUrl(draft.sequence);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to build preview URL:', e);
      return '';
    }
  }, [draft]);

  const shareUrl = useMemo(() => {
    if (gift?.slug) return `${window.location.origin}/gift?bouquetId=${gift.slug}`;
    return previewUrl;
  }, [gift, previewUrl]);

  const sequence = useMemo(() => {
    if (!draft?.sequence) return [];
    if (!anonymous) return draft.sequence;
    return draft.sequence.map((s) => ({ ...s, senderName: 'Someone' }));
  }, [draft, anonymous]);

  const palette = sequence.find((s) => s.palette)?.palette || 'pink';

  const handleSave = async () => {
    if (!draft?.sequence) return;
    setSaving(true);
    setError('');
    try {
      const { gift: created } = await GiftAPI.create({
        senderName: anonymous ? 'Someone' : draft.senderName || 'Someone',
        recipientName: draft.recipientName || 'You',
        sequenceData: sequence,
        palette,
      });
      setGift(created);
    } catch (e) {
      setError(`${e.message}. You can still share the preview link below.`);
    } finally {
      setSaving(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  if (!draft?.sequence?.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-bloom-green">Nothing to share yet</h1>
        <p className="mt-2 text-bloom-green/60">Compose a gift first, then come back to share it.</p>
        <Link to="/compose" className="btn-primary mt-6 inline-block">Compose a gift →</Link>
      </div>
    );
  }

  const waText = encodeURIComponent(`I made you something 🌸 ${shareUrl}`);
  const mailBody = encodeURIComponent(`I made you a little gift 🌸\n\n${shareUrl}`);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs font-semibold tracking-[0.3em] text-bloom-gold">— STEP THREE OF THREE</p>
      <h1 className="font-display text-3xl text-bloom-green sm:text-4xl">Your gift is ready 🌸</h1>
      <p className="mt-1 text-sm text-bloom-green/60">Share the link, scan the code, or send it on.</p>

      {/* Options */}
      <div className="card-surface mt-6 space-y-4 p-5">
        <label className="flex items-center justify-between">
          <span className="text-sm text-bloom-green">Send anonymously (hide sender name)</span>
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="h-5 w-5 accent-bloom-green" />
        </label>

        {!gift && (
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
            {saving ? 'Creating permanent link…' : 'Create permanent link'}
          </button>
        )}
        {error && <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">{error}</p>}
      </div>

      {/* Link + QR */}
      <div className="card-surface mt-5 p-5">
        <p className="text-xs font-semibold tracking-widest text-bloom-green/50">YOUR GIFT LINK</p>

        {shareUrl ? (
          <>
            <div className="mt-2 flex items-center gap-2">
              <input readOnly value={shareUrl} className="input-field flex-1 truncate py-2 text-sm" />
              <button onClick={copy} className="btn-gold py-2 text-sm">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div className="mt-5 flex flex-col items-center gap-3">
              <div className="rounded-2xl bg-white p-4 shadow">
                <QRCodeSVG value={shareUrl} size={168} fgColor="#1a2e1a" />
              </div>
              <p className="text-xs text-bloom-green/50">Scan to open the gift</p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer" className="btn-ghost py-2 text-sm">
                WhatsApp
              </a>
              <a href={`mailto:?subject=${encodeURIComponent('A gift for you')}&body=${mailBody}`} className="btn-ghost py-2 text-sm">
                Email
              </a>
              <a href={previewUrl || shareUrl} target="_blank" rel="noreferrer" className="btn-ghost py-2 text-sm">
                ▶ Open
              </a>
            </div>
          </>
        ) : (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            We couldn't build a share link for this gift. Try going back and re-composing it.
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Link to="/compose" className="btn-ghost py-2 text-sm">← Keep editing</Link>
        <Link to="/dashboard" className="text-sm font-medium text-bloom-green/60 hover:text-bloom-green">
          View my gifts →
        </Link>
      </div>
    </div>
  );
}
