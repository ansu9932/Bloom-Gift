import { useRef, useState } from 'react';
import { UploadAPI } from '../../lib/api';

const MAX_PHOTOS = 43;

// Uploads photos/video to the backend and stores returned {url,type,size} on the step.
// If the backend is unreachable, falls back to local object URLs so the
// experience still previews (those URLs are session-only).
export default function MediaUploader({ media = [], onChange }) {
  const photoInput = useRef(null);
  const videoInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const photos = media.filter((m) => m.type === 'photo');
  const videos = media.filter((m) => m.type === 'video');

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setError('');
    setUploading(true);
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    try {
      const { files: uploaded } = await UploadAPI.files(form);
      onChange([...media, ...uploaded]);
    } catch (e) {
      // Fallback: preview locally without a server.
      const local = files.map((f) => ({
        url: URL.createObjectURL(f),
        type: f.type.startsWith('video') ? 'video' : 'photo',
        size: f.size,
        local: true,
      }));
      onChange([...media, ...local]);
      setError('Saved locally (upload server not reachable).');
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (url) => onChange(media.filter((m) => m.url !== url));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => photoInput.current?.click()} className="btn-ghost py-2 text-sm" disabled={uploading}>
          Add photos
        </button>
        <button onClick={() => videoInput.current?.click()} className="btn-ghost py-2 text-sm" disabled={uploading}>
          Add video
        </button>
        <input
          ref={photoInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        <input
          ref={videoInput}
          type="file"
          accept="video/mp4"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <p className="mt-2 text-xs text-bloom-green/50">
        Up to {MAX_PHOTOS} page photos · JPG, PNG, or WebP · up to 50 MB each
      </p>
      <p className="text-xs text-bloom-green/50">Video: 1 MP4 · up to ~10s · 20 MB max</p>
      <p className="mt-1 text-xs font-medium text-bloom-green/70">
        {photos.length} / {MAX_PHOTOS} photos selected
        {photos.length < MAX_PHOTOS ? ` · add ${MAX_PHOTOS - photos.length} more` : ''}
      </p>

      {uploading && <p className="mt-1 text-xs text-bloom-gold">Uploading…</p>}
      {error && <p className="mt-1 text-xs text-amber-600">{error}</p>}

      {media.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {photos.map((p) => (
            <div key={p.url} className="group relative aspect-square overflow-hidden rounded-lg bg-bloom-green/10">
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => removeAt(p.url)}
                className="absolute right-1 top-1 hidden h-5 w-5 place-items-center rounded-full bg-black/60 text-xs text-white group-hover:grid"
              >
                ✕
              </button>
            </div>
          ))}
          {videos.map((v) => (
            <div key={v.url} className="group relative aspect-square overflow-hidden rounded-lg bg-bloom-green/10">
              <video src={v.url} className="h-full w-full object-cover" muted />
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] text-white">VIDEO</span>
              <button
                onClick={() => removeAt(v.url)}
                className="absolute right-1 top-1 hidden h-5 w-5 place-items-center rounded-full bg-black/60 text-xs text-white group-hover:grid"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
