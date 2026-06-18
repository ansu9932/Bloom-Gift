import { useCallback, useRef, useState } from 'react';

// No cap — every feature is free and unlimited.
const MAX_BLOOMS = Infinity;

function placedId() {
  return `pf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// Manage the flowers placed on the bouquet canvas with undo/redo history.
export function useBouquet(initial = []) {
  const [flowers, setFlowersState] = useState(initial);
  const [style, setStyle] = useState('classic');
  const [selectedId, setSelectedId] = useState(null);

  const past = useRef([]);
  const future = useRef([]);

  // Commit a new state, pushing the previous one onto the undo stack.
  const commit = useCallback(
    (updater) => {
      setFlowersState((prev) => {
        past.current.push(prev);
        future.current = [];
        return typeof updater === 'function' ? updater(prev) : updater;
      });
    },
    []
  );

  const addFlower = useCallback((flower) => {
    let added = null;
    commit((prev) => {
      if (prev.length >= MAX_BLOOMS) return prev;
      added = {
        uid: placedId(),
        id: flower.id,
        // Spread new flowers around the wrap opening (upper-centre) with jitter.
        x: 50 + (Math.random() * 16 - 8),
        y: 38 + (Math.random() * 14 - 7),
        scale: 1,
        rotation: Math.random() * 30 - 15,
        zIndex: prev.length + 1,
        flip: false,
      };
      return [...prev, added];
    });
    if (added) setSelectedId(added.uid);
    return added;
  }, [commit]);

  const updateFlower = useCallback((uid, patch) => {
    commit((prev) => prev.map((fl) => (fl.uid === uid ? { ...fl, ...patch } : fl)));
  }, [commit]);

  const removeFlower = useCallback((uid) => {
    commit((prev) => prev.filter((fl) => fl.uid !== uid));
    setSelectedId((cur) => (cur === uid ? null : cur));
  }, [commit]);

  const duplicateFlower = useCallback((uid) => {
    let dup = null;
    commit((prev) => {
      const src = prev.find((fl) => fl.uid === uid);
      if (!src || prev.length >= MAX_BLOOMS) return prev;
      dup = { ...src, uid: placedId(), x: src.x + 6, y: src.y + 6, zIndex: prev.length + 1 };
      return [...prev, dup];
    });
    if (dup) setSelectedId(dup.uid);
  }, [commit]);

  const bringToFront = useCallback((uid) => {
    commit((prev) => {
      const max = Math.max(0, ...prev.map((fl) => fl.zIndex));
      return prev.map((fl) => (fl.uid === uid ? { ...fl, zIndex: max + 1 } : fl));
    });
  }, [commit]);

  const sendToBack = useCallback((uid) => {
    commit((prev) => {
      const min = Math.min(0, ...prev.map((fl) => fl.zIndex));
      return prev.map((fl) => (fl.uid === uid ? { ...fl, zIndex: min - 1 } : fl));
    });
  }, [commit]);

  const resetFlower = useCallback((uid) => {
    updateFlower(uid, { scale: 1, rotation: 0, flip: false });
  }, [updateFlower]);

  const clearAll = useCallback(() => {
    commit([]);
    setSelectedId(null);
  }, [commit]);

  const undo = useCallback(() => {
    setFlowersState((prev) => {
      if (past.current.length === 0) return prev;
      const previous = past.current.pop();
      future.current.push(prev);
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setFlowersState((prev) => {
      if (future.current.length === 0) return prev;
      const next = future.current.pop();
      past.current.push(prev);
      return next;
    });
  }, []);

  const loadFlowers = useCallback((list) => {
    past.current = [];
    future.current = [];
    setFlowersState(Array.isArray(list) ? list : []);
  }, []);

  const selected = flowers.find((fl) => fl.uid === selectedId) || null;

  return {
    flowers,
    style,
    setStyle,
    selectedId,
    setSelectedId,
    selected,
    addFlower,
    updateFlower,
    removeFlower,
    duplicateFlower,
    bringToFront,
    sendToBack,
    resetFlower,
    clearAll,
    undo,
    redo,
    loadFlowers,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
    maxBlooms: MAX_BLOOMS,
  };
}
