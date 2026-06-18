import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGiftBuilder } from '../../hooks/useGiftBuilder';
import { buildPreviewUrl } from '../../utils/encode';
import SequenceTimeline from './SequenceTimeline';
import StepConfig from './StepConfig';
import SurfacePicker from './SurfacePicker';

const BOUQUET_KEY = 'bloomgift_bouquet';
const FINISH_KEY = 'bloomgift_finish_sequence';

// Read the bouquet draft saved by the BouquetBuilder.
function readSavedBouquet() {
  try {
    const raw = localStorage.getItem(BOUQUET_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Inject sender/recipient names into each step so screens can display them,
// and ensure bouquet steps carry the bouquet inline.
export function buildSequence(steps, senderName, recipientName, savedBouquet) {
  return steps.map((s) => {
    const out = { ...s, senderName, recipientName };
    if (s.kind === 'bouquet' || s.includeBouquet) {
      if (savedBouquet && Array.isArray(savedBouquet.flowers)) {
        out.bouquet = { style: savedBouquet.style || 'classic', flowers: savedBouquet.flowers };
      }
    }
    return out;
  });
}

export default function ComposeStudio() {
  const navigate = useNavigate();
  const builder = useGiftBuilder();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [savedBouquet, setSavedBouquet] = useState(null);

  const {
    steps,
    senderName,
    setSenderName,
    recipientName,
    setRecipientName,
    selectedId,
    setSelectedId,
    selectedStep,
    addSurface,
    removeStep,
    updateStep,
    clearAll,
    maxSteps,
  } = builder;

  useEffect(() => {
    setSavedBouquet(readSavedBouquet());
  }, []);

  const sequence = useMemo(
    () => buildSequence(steps, senderName, recipientName, savedBouquet),
    [steps, senderName, recipientName, savedBouquet]
  );

  const handlePreview = () => {
    if (steps.length === 0) return;
    const url = buildPreviewUrl(sequence);
    window.open(url, '_blank', 'noopener');
  };

  const handleFinish = () => {
    if (steps.length === 0) return;
    localStorage.setItem(
      FINISH_KEY,
      JSON.stringify({ sequence, senderName, recipientName })
    );
    navigate('/compose/finish');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* From / For + actions */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <label className="block">
            <span className="text-xs font-semibold tracking-widest text-bloom-green/50">FROM</span>
            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="input-field mt-1 w-40 py-2"
              placeholder="Someone"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold tracking-widest text-bloom-green/50">FOR</span>
            <input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="input-field mt-1 w-40 py-2"
              placeholder="You"
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePreview} disabled={steps.length === 0} className="btn-ghost py-2 text-sm">
            ▶ Preview
          </button>
          <button onClick={handleFinish} disabled={steps.length === 0} className="btn-primary py-2 text-sm">
            Finish & share →
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* Left: timeline */}
        <div className="h-[72vh] rounded-2xl border border-bloom-green/10 bg-bloom-cream/60 p-4">
          <SequenceTimeline
            steps={steps}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={() => setPickerOpen(true)}
            onClear={clearAll}
            maxSteps={maxSteps}
          />
        </div>

        {/* Right: step config */}
        <div className="min-h-[72vh]">
          <StepConfig
            step={selectedStep}
            savedBouquet={savedBouquet}
            onChange={updateStep}
            onRemove={removeStep}
          />
        </div>
      </div>

      <SurfacePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(surfaceId, palette) => addSurface(surfaceId, palette)}
      />
    </div>
  );
}
