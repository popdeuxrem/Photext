import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Save, Undo, Redo } from 'lucide-react'; // <-- IMPORT ICONS
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ExportModal from './ExportModal';
import { useAppStore } from '@/lib/store'; // <-- IMPORT ZUSTAND STORE

export default function EditorHeader({ fabricCanvas, imageUrl, isLoading }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    
    // <-- START: NEW UNDO/REDO LOGIC -->
    const { history, historyIndex, undo, redo } = useAppStore((state) => ({
        history: state.history,
        historyIndex: state.historyIndex,
        undo: state.undo,
        redo: state.redo,
    }));

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const handleUndo = () => {
        if (canUndo) {
            undo(fabricCanvas);
        }
    };

    const handleRedo = () => {
        if (canRedo) {
            redo(fabricCanvas);
        }
    };
    // <-- END: NEW UNDO/REDO LOGIC -->

    // ... handleSave function remains the same ...

    return (
        <header className="flex items-center justify-between p-2 bg-white shadow-md z-10">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <Home className="h-5 w-5" />
                </Button>
                {/* <-- START: ADDED UNDO/REDO BUTTONS --> */}
                <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo}>
                    <Undo className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo}>
                    <Redo className="h-5 w-5" />
                </Button>
                {/* <-- END: ADDED UNDO/REDO BUTTONS --> */}
            </div>

            <h1 className="text-lg font-semibold">PhoText Editor</h1>
            
            <div className="flex items-center gap-2">
                <Button onClick={() => { /* handleSave() */ }} disabled={isLoading || !imageUrl}>
                    <Save className="mr-2 h-4 w-4" /> Save Project
                </Button>
                <ExportModal fabricCanvas={fabricCanvas} disabled={isLoading || !imageUrl} />
            </div>
        </header>
    );
}
