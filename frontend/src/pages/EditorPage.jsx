import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { AuthContext } from '@/App';
import CanvasComponent from '@/components/editor/CanvasComponent';
import Toolbar from '@/components/editor/Toolbar';
import EditorHeader from '@/components/editor/EditorHeader';
import { useToast } from "@/components/ui/use-toast";
import { processImageWithOCR, detectTextStyle } from '@/api/ai';
import { fabric } from 'fabric';
import { useAppStore } from '@/lib/store'; // <-- IMPORT ZUSTAND STORE

export default function EditorPage() {
    const { session } = useContext(AuthContext);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { projectId } = useParams();

    // Zustand store integration
    const { addJob, updateJobStatus, addHistory, clearHistory } = useAppStore();

    const [fabricCanvas, setFabricCanvas] = useState(null);
    const [activeObject, setActiveObject] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Effect to set up history saving on canvas modifications
    useEffect(() => {
        if (!fabricCanvas) return;

        const saveState = () => {
            const canvasState = fabricCanvas.toJSON();
            addHistory(canvasState);
        };
        
        // Save history after an object is modified or added
        fabricCanvas.on('object:modified', saveState);
        fabricCanvas.on('object:added', saveState);

        return () => {
            fabricCanvas.off('object:modified', saveState);
            fabricCanvas.off('object:added', saveState);
        };
    }, [fabricCanvas, addHistory]);


    const handleImageUpload = async (file) => {
        // ... (this function remains largely the same, but should clear history)
        clearHistory(); // Clear history for the new image
        // ... rest of the upload logic
        // After fabricCanvas.renderAll(), add the initial state to history:
        addHistory(fabricCanvas.toJSON());
    };

    const handleMagicEdit = async () => {
        if (!fabricCanvas || !activeObject) return;

        const jobId = Date.now();
        const jobText = `Magic Edit for "${activeObject.text.substring(0, 20)}..."`;
        addJob({ id: jobId, text: jobText, status: 'processing' });
        
        try {
            const originalImageUrl = fabricCanvas.backgroundImage.getSrc();
            const boundingBox = {
                left: activeObject.left,
                top: activeObject.top,
                width: activeObject.width * activeObject.scaleX,
                height: activeObject.height * activeObject.scaleY,
            };
            
            const styleInfo = await detectTextStyle(originalImageUrl, boundingBox);
            // In a real app, you would now call the inpainting function and wait for it.
            // ... inpainting logic ...

            // Remove the old object and add the new, styled one
            fabricCanvas.remove(activeObject);
            
            // ... logic to load font and create the new Textbox (from previous response) ...
            
            const newTextbox = new fabric.Textbox(styleInfo.text, {
                // ... style properties from styleInfo ...
            });
            fabricCanvas.add(newTextbox);
            fabricCanvas.setActiveObject(newTextbox);
            fabricCanvas.renderAll();

            // When done, update the job and save the new state to history
            updateJobStatus(jobId, 'completed');
            addHistory(fabricCanvas.toJSON());

        } catch (error) {
            updateJobStatus(jobId, 'failed');
            toast({ title: "Magic Edit Failed", description: error.message, variant: "destructive" });
        }
    };
    
    // ... useEffect for loading projects from cloud/localStorage ...
    
    return (
        <div className="flex flex-col h-screen bg-gray-200">
            <EditorHeader fabricCanvas={fabricCanvas} imageUrl={imageUrl} isLoading={isLoading} />
            <div className="flex flex-1 overflow-hidden">
                <Toolbar
                    fabricCanvas={fabricCanvas}
                    activeObject={activeObject}
                    handleImageUpload={handleImageUpload}
                    handleMagicEdit={handleMagicEdit}
                    isMagicEditLoading={false} // Loading state is now managed by the job queue
                />
                <main className="flex-1 p-4 flex items-center justify-center overflow-auto">
                   {isLoading && <div className="text-xl animate-pulse">Loading Image...</div>}
                   <CanvasComponent
                        setFabricCanvas={setFabricCanvas}
                        setActiveObject={setActiveObject}
                    />
                </main>
            </div>
        </div>
    );
}
