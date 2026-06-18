import { useMemo, useState } from 'react';

// Extracts a Spotify track id from a share URL.
function spotifyId(url) {
  const m = String(url || '').match(/track\/([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

// Extracts a YouTube video id from common URL shapes.
function youtubeId(url) {
  const m = String(url || '').match(
    /(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

function startSeconds(startAt) {
  if (!startAt) return 0;
  if (String(startAt).includes(':')) {
    const [min, sec] = String(startAt).split(':').map(Number);
    return (min || 0) * 60 + (sec || 0);
  }
  return Number(startAt) || 0;
}

// Hidden-audio music player with a small animated indicator.
// Spotify embeds cannot truly autoplay (browser policy) so we surface a small
// control; YouTube audio autoplays muted-then-unmuted is unreliable, so we also
// expose a toggle.
export default function MusicPlayer({ music }) {
  const [playing, setPlaying] = useState(true);
  const sId = useMemo(() => spotifyId(music?.spotify), [music]);
  const yId = useMemo(() => youtubeId(music?.youtube), [music]);
  const start = startSeconds(music?.startAt);

  if (!sId && !yId) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setPlaying((p) => !p)}
        className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 text-white backdrop-blur"
        title={playing ? 'Pause music' : 'Play music'}
      >
        <span className="flex items-end gap-0.5" style={{ height: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-0.5 rounded bg-white"
              style={{
                height: playing ? 6 + (i % 3) * 4 : 4,
                animation: playing ? `eq 0.9s ease-in-out ${i * 0.12}s infinite alternate` : 'none',
              }}
            />
          ))}
        </span>
        <span className="text-xs">{playing ? 'Music' : 'Muted'}</span>
      </button>

      {/* Hidden embeds */}
      <div className="absolute h-0 w-0 overflow-hidden opacity-0">
        {playing && sId && (
          <iframe
            title="spotify"
            src={`https://open.spotify.com/embed/track/${sId}?autoplay=1`}
            allow="autoplay; encrypted-media"
          />
        )}
        {playing && yId && (
          <iframe
            title="youtube"
            src={`https://www.youtube.com/embed/${yId}?autoplay=1&start=${start}&controls=0`}
            allow="autoplay; encrypted-media"
          />
        )}
      </div>

      <style>{`@keyframes eq { from { transform: scaleY(0.5); } to { transform: scaleY(1.4); } }`}</style>
    </div>
  );
}
