// Gift sequence URL encoding.
// The entire gift can live in the URL as base64 JSON — no database required for
// basic gifts. Uses a URL-safe, UTF-8-aware base64 so emoji in notes survive.

function toBase64Unicode(str) {
  // Encode UTF-8 safely (btoa only handles latin1).
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function fromBase64Unicode(b64) {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function toUrlSafe(b64) {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromUrlSafe(s) {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return b64;
}

export function encodeSequence(steps) {
  const json = JSON.stringify(steps);
  return toUrlSafe(toBase64Unicode(json));
}

export function decodeSequence(encoded) {
  try {
    const json = fromBase64Unicode(fromUrlSafe(encoded));
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

// Generate a gift slug, e.g. "starter-v1-nghile-pink".
export function generateSlug(tier, version, senderName, palette) {
  const name = String(senderName || 'someone')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const pal = String(palette || 'pink').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${tier}-v${version}-${name || 'someone'}-${pal}`;
}

// Build the shareable preview URL from a sequence array.
export function buildPreviewUrl(steps, origin) {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/preview?sequence=1&seq=${encodeSequence(steps)}`;
}

// Read the sequence from the current URL's `seq` query param.
export function readSequenceFromLocation(search) {
  const params = new URLSearchParams(search || (typeof window !== 'undefined' ? window.location.search : ''));
  const seq = params.get('seq');
  if (!seq) return null;
  return decodeSequence(seq);
}
