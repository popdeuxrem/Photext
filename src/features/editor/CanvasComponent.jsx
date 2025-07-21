import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const CanvasComponent = ({ setFabricCanvas, setActiveObject }) => {
    const canvasEl = useRef(null);

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasEl.current, {
            width: 800,
            height: 600,
            backgroundColor: '#e0e0e0',
            preserveObjectStacking: true,
        });
        setFabricCanvas(canvas);

        const handleSelection = (e) => {
            setActiveObject(e.selected ? e.selected[0] : null);
        };

        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);
        canvas.on('selection:cleared', () => setActiveObject(null));

        // Add keyboard delete functionality
        const handleKeyDown = (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const activeObject = canvas.getActiveObject();
                if (activeObject) {
                    canvas.remove(activeObject);
                    canvas.discardActiveObject().renderAll();
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            canvas.dispose();
        };
    }, [setFabricCanvas, setActiveObject]);

    return <canvas ref={canvasEl} />;
};

export default CanvasComponent;
