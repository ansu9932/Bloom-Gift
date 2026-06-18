// Note textarea for a step, with a delete-note link.
export default function NoteEditor({ value, onChange }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-bloom-green">Note</p>
          <p className="text-xs text-bloom-green/50">Extra message for this surface</p>
        </div>
        {value ? (
          <button onClick={() => onChange('')} className="text-xs text-red-500 hover:text-red-600">
            Delete note
          </button>
        ) : null}
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Write a note for this step…"
        className="input-field resize-none"
      />
    </div>
  );
}
