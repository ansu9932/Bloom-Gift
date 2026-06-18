import { useRef } from 'react';
import { getFlower } from '../../data/flowers';
import FlowerCanvas from './FlowerCanvas';
import FlowerPanel from './FlowerPanel';
import Toggle from '../ui/Toggle';
import ColorPalette from '../ui/ColorPalette';

function ToolbarButton({ onClick, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-lg bg-white/70 px-2.5 py-1.5 text-xs font-medium text-bloom-green transition hover:bg-white active:scale-95"
    >
      {children}
    </button>
  );
}

// Presentational composer. All state comes from a useBouquet() instance passed
// in via `bouquet`, plus palette controls.
export default function BouquetComposer({ bouquet, palette, onPaletteChange }) {
  const canvasRef = useRef(null);
  const {
    flowers,
    style,
    setStyle,
    selectedId,
    selected,
    setSelectedId,
    addFlower,
    updateFlower,
    removeFlower,
    duplicateFlower,
    bringToFront,
    sendToBack,
    resetFlower,
    undo,
    redo,
    maxBlooms,
  } = bouquet;

  const selectedData = selected ? getFlower(selected.id) : null;

  const scaleBy = (factor) =>
    selected && updateFlower(selected.uid, { scale: Math.max(0.4, Math.min(2.4, (selected.scale || 1) * factor)) });
  const rotateBy = (deg) =>
    selected && updateFlower(selected.uid, { rotation: (selected.rotation || 0) + deg });

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      {/* Left: canvas + controls */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <Toggle
            value={style}
            onChange={setStyle}
            options={[
              { value: 'classic', label: 'Classic Bouquet' },
              { value: 'paper', label: 'Paper Bouquet' },
            ]}
          />
          <div className="flex items-center gap-2">
            <ToolbarButton onClick={undo} title="Undo">↩ Undo</ToolbarButton>
            <ToolbarButton onClick={redo} title="Redo">↪ Redo</ToolbarButton>
            <ToolbarButton onClick={() => selected && duplicateFlower(selected.uid)} title="Duplicate">⧉ Duplicate</ToolbarButton>
          </div>
        </div>

        <FlowerCanvas
          ref={canvasRef}
          flowers={flowers}
          palette={palette}
          style={style}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onMove={updateFlower}
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-bloom-green/60">
            Flowers placed: {flowers.length}
          </span>
          <ColorPalette value={palette} onChange={onPaletteChange} size="sm" />
        </div>

        {/* Editing toolbar for the selected flower */}
        {selected && (
          <div className="mt-3 rounded-2xl border border-bloom-green/10 bg-white/70 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-bloom-green">
                EDITING: {selectedData?.name || 'Flower'}
              </span>
              <button
                onClick={() => removeFlower(selected.uid)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                🗑 Remove
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <ToolbarButton onClick={() => updateFlower(selected.uid, { flip: !selected.flip })}>↔ Flip</ToolbarButton>
              <ToolbarButton onClick={() => scaleBy(0.85)}>⊖ Out</ToolbarButton>
              <ToolbarButton onClick={() => scaleBy(1.18)}>⊕ In</ToolbarButton>
              <ToolbarButton onClick={() => rotateBy(-15)}>↺ Left</ToolbarButton>
              <ToolbarButton onClick={() => rotateBy(15)}>↻ Right</ToolbarButton>
              <ToolbarButton onClick={() => bringToFront(selected.uid)}>↑ Front</ToolbarButton>
              <ToolbarButton onClick={() => sendToBack(selected.uid)}>↓ Back</ToolbarButton>
              <ToolbarButton onClick={() => resetFlower(selected.uid)}>⟲ Reset</ToolbarButton>
            </div>
            <p className="mt-2 text-[11px] tracking-wide text-bloom-green/40">
              SELECTED · DRAG TO MOVE · USE THE BAR TO SCALE + ROTATE
            </p>
          </div>
        )}
      </div>

      {/* Right: flower picker panel */}
      <div className="h-[70vh] rounded-2xl border border-bloom-green/10 bg-bloom-cream/60 p-3 lg:h-[78vh]">
        <FlowerPanel onAdd={addFlower} count={flowers.length} maxBlooms={maxBlooms} />
      </div>
    </div>
  );
}
