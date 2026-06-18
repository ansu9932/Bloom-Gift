// Two-option segmented toggle, e.g. [Include] [None] or [Classic] [Paper].
export default function Toggle({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-full border border-bloom-green/20 bg-white/60 p-1">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active
                ? 'bg-bloom-green text-bloom-cream shadow'
                : 'text-bloom-green/70 hover:text-bloom-green'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
