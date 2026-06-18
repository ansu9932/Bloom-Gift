import { useCallback, useEffect, useState } from 'react';
import { getSurface } from '../data/surfaces';

const STORAGE_KEY = 'bloomgift_draft_sequence';
const MAX_STEPS = 30;

function uid() {
  return `step-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Build a step object from a surface definition.
function stepFromSurface(surface, defaults = {}) {
  const base = {
    id: uid(),
    surfaceId: surface.id,
    kind: surface.kind,
    palette: defaults.palette || 'pink',
    note: '',
    bouquetId: null,
    includeBouquet: surface.kind === 'bouquet',
    media: [],
    music: { spotify: '', youtube: '', startAt: '' },
    scratchReveal: false,
    voiceNote: null,
  };
  if (surface.kind === 'lock') {
    base.lockPin = defaults.lockPin || '';
    base.recipientName = defaults.recipientName || 'You';
  }
  if (surface.kind === 'intro') base.introId = surface.introId || 'xoxo';
  if (surface.cardStyle) base.cardId = surface.cardStyle;
  if (surface.miscStyle) base.miscId = surface.miscStyle;
  if (surface.variant) base.notebookId = surface.id;
  return base;
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useGiftBuilder() {
  const draft = loadDraft();
  const [steps, setSteps] = useState(draft?.steps || []);
  const [senderName, setSenderName] = useState(draft?.senderName || 'Someone');
  const [recipientName, setRecipientName] = useState(draft?.recipientName || 'You');
  const [selectedId, setSelectedId] = useState(draft?.steps?.[0]?.id || null);

  // Persist the draft to localStorage on change.
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ steps, senderName, recipientName })
    );
  }, [steps, senderName, recipientName]);

  const addSurface = useCallback(
    (surfaceId, palette = 'pink') => {
      const surface = getSurface(surfaceId);
      if (!surface) return null;
      const step = stepFromSurface(surface, { palette, recipientName });
      setSteps((prev) => {
        if (prev.length >= MAX_STEPS) return prev;
        return [...prev, step];
      });
      setSelectedId(step.id);
      return step;
    },
    [recipientName]
  );

  const removeStep = useCallback(
    (id) => {
      setSteps((prev) => prev.filter((s) => s.id !== id));
      setSelectedId((cur) => (cur === id ? null : cur));
    },
    []
  );

  const updateStep = useCallback((id, patch) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  }, []);

  const moveStep = useCallback((id, direction) => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const target = idx + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSteps([]);
    setSelectedId(null);
  }, []);

  const selectedStep = steps.find((s) => s.id === selectedId) || null;

  return {
    steps,
    setSteps,
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
    moveStep,
    clearAll,
    maxSteps: MAX_STEPS,
  };
}
