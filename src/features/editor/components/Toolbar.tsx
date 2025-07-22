'use client';

import { useState, useRef } from 'react';
import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/shared/store/useAppStore';
import { fabric } from 'fabric';
import { AiToolsModal } from './AiToolsModal';
import { Upload, Type, Wand2, Bot } from 'lucide-react';
import { useToast } from '@/shared/components/ui/use-toast';
import imageCompression from 'browser-image-compression';
import { TextProperties } from './TextProperties';

export function Toolbar() {
    const { fabricCanvas, activeObject, saveState, addJob, updateJob, removeJob } = useAppStore();
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !fabricCanvas) return;
        const jobId = Date.now();
        addJob({ id: jobId, text: 'Compressing...', status: 'processing' });
        try {
            const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
            updateJob(jobId, 'processing', 'Uploading...');
            const imageUrl = URL.createObjectURL(compressedFile);
            fabricCanvas.clear();
            fabric.Image.fromURL(imageUrl, (img) => {
                fabricCanvas.setWidth(img.width || 800);
                fabricCanvas.setHeight(img.height || 600);
                fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), { crossOrigin: 'anonymous' });
                saveState('image-upload');
                updateJob(jobId, 'completed', 'Image ready!');
            }, { crossOrigin: 'anonymous' });
        } catch (error) {
            updateJob(jobId, 'failed', 'Upload failed.');
        } finally {
            setTimeout(() => removeJob(jobId), 3000);
        }
    };

    const addText = () => {
        if (!fabricCanvas) return;
        const text = new fabric.Textbox('New Text', { left: 50, top: 50, width: 150, fontSize: 24, fill: '#000' });
        fabricCanvas.add(text).setActiveObject(text);
    };
    
    return (
        <>
            <aside className="w-72 bg-white p-4 space-y-6 overflow-y-auto flex flex-col border-r">
                <div>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full"><Upload className="mr-2 h-4 w-4" /> Upload Image</Button>
                </div>
                <div className="border-t pt-4"><Button onClick={addText} className="w-full" variant="outline"><Type className="mr-2 h-4 w-4" /> Add Text</Button></div>
                <div className="border-t pt-4"><h3 className="font-semibold mb-2 text-sm">Smart Editing</h3><Button className="w-full" disabled={!activeObject}><Wand2 className="mr-2 h-4 w-4" /> Magic Edit</Button></div>
                <TextProperties />
                <div className="border-t pt-4"><Button onClick={() => setIsAiModalOpen(true)} className="w-full"><Bot className="mr-2 h-4 w-4" /> AI Assistant</Button></div>
            </aside>
            <AiToolsModal isOpen={isAiModalOpen} setIsOpen={setIsAiModalOpen} />
        </>
    );
}
