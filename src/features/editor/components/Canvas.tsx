'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useAppStore } from '@/shared/store/useAppStore';

const SNAP_THRESHOLD = 8; // Pixels

export function Canvas() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { setFabricCanvas, setActiveObject, saveState } = useAppStore();

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
      preserveObjectStacking: true,
      objectCaching: false,
    });

    const handleSelection = (e: fabric.IEvent) => {
        const selected = e.selected as fabric.Object[];
        setActiveObject(selected ? selected[0] : null);
    };

    const handleStateSave = () => saveState();
    
    const handleMoving = (e: fabric.IEvent) => {
      const target = e.target;
      if (!target) return;
      target.setCoords();

      canvas.forEachObject(obj => {
        if (obj === target) return;
        if (Math.abs(target.getCenterPoint().x - obj.getCenterPoint().x) < SNAP_THRESHOLD) {
          target.set({ left: obj.left }).setCoords();
        }
        if (Math.abs(target.getCenterPoint().y - obj.getCenterPoint().y) < SNAP_THRESHOLD) {
          target.set({ top: obj.top }).setCoords();
        }
      });
    };

    canvas.on({
      'selection:created': handleSelection,
      'selection:updated': handleSelection,
      'selection:cleared': () => setActiveObject(null),
      'object:modified': handleStateSave,
      'object:added': handleStateSave,
      'object:removed': handleStateSave,
      'object:moving': handleMoving,
    });

    setFabricCanvas(canvas);
    saveState('initial');

    return () => {
      canvas.dispose();
    };
  }, [setFabricCanvas, setActiveObject, saveState]);

  return <canvas ref={canvasEl} />;
}
