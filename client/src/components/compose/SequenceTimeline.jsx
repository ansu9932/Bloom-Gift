import StepCard from './StepCard';

// Left panel: vertical timeline of steps connected by a line, with an add button.
export default function SequenceTimeline({
  steps,
  selectedId,
  onSelect,
  onAdd,
  onClear,
  maxSteps,
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-bloom-green/50">
          SEQUENCE {steps.length}/{maxSteps}
        </span>
        {steps.length > 0 && (
          <button onClick={onClear} className="text-xs font-semibold text-red-500 hover:text-red-600">
            CLEAR
          </button>
        )}
      </div>

      <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {steps.length === 0 && (
          <p className="rounded-2xl border border-dashed border-bloom-green/20 p-6 text-center text-sm text-bloom-green/50">
            No steps yet. Tap + to add your first surface.
          </p>
        )}

        {steps.map((step, i) => (
          <div key={step.id} className="relative">
            {i < steps.length - 1 && (
              <span className="absolute left-[26px] top-[60px] h-3 w-px bg-bloom-green/20" />
            )}
            <StepCard step={step} index={i} active={selectedId === step.id} onSelect={onSelect} />
          </div>
        ))}

        <button
          onClick={onAdd}
          disabled={steps.length >= maxSteps}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-bloom-green/30 py-3 text-sm font-medium text-bloom-green transition hover:border-bloom-gold hover:text-bloom-gold disabled:opacity-40"
        >
          ＋ Add surface
        </button>
      </div>

      {steps.length > 0 && (
        <p className="mt-3 text-center text-xs text-bloom-green/40">
          Ends on a surface — ready to finish
        </p>
      )}
    </div>
  );
}
