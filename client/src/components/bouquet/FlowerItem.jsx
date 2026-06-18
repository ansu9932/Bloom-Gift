import { useRef } from 'react';
import { getFlower } from '../../data/flowers';
import FlowerGlyph from '../flowers/FlowerGlyph';

// A single placed flower on the canvas. Supports pointer dragging to reposition.
// Scaling/rotation are driven from the editing toolbar (BouquetComposer).
export default function FlowerItem({ flower, selected, onSelect, onMove, canvasRef }) {
  const data = getFlower(flower.id);
  const dragging = useRef(false);

  const onPointerDown = (e) => {
    e.stopPropagation();
    onSelect(flower.uid);
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current || !canvasRef?.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onMove(flower.uid, {
      x: Math.max(2, Math.min(98, x)),
      y: Math.max(2, Math.min(98, y)),
    });
  };

  const endDrag = (e) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const size = 90 * (flower.scale || 1);

  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`absolute cursor-grab touch-none select-none active:cursor-grabbing ${
        selected ? 'z-50' : ''
      }`}
      style={{
        left: `${flower.x}%`,
        top: `${flower.y}%`,
        zIndex: flower.zIndex || 1,
        transform: `translate(-50%, -50%) rotate(${flower.rotation || 0}deg) scaleX(${
          flower.flip ? -1 : 1
        })`,
      }}
    >
      <div
        className={`rounded-full transition ${
          selected ? 'ring-2 ring-bloom-gold ring-offset-2 ring-offset-transparent' : ''
        }`}
      >
        <FlowerGlyph
          flower={data}
          color={data?.color}
          type={data?.type}
          size={size}
          withStem
        />
      </div>
    </div>
  );
}
