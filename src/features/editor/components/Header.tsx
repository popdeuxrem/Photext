'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Home, Save, Undo, Redo } from 'lucide-react';
import { useAppStore } from '@/shared/store/useAppStore';
import { useToast } from '@/shared/components/ui/use-toast';
import { ExportModal } from './ExportModal';

type HeaderProps = {
  projectId: string;
};

export function Header({ projectId }: HeaderProps) {
  const { undo, redo, canUndo, canRedo } = useAppStore();
  const { toast } = useToast();

  const handleSave = async () => {
      // TODO: Implement server action to save project data to Supabase
      toast({ title: "Save Clicked", description: "Project save functionality to be implemented." });
  }

  return (
    <header className="flex items-center justify-between p-2 bg-white shadow-md z-10 border-b">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard"><Home className="h-5 w-5" /></Link>
        </Button>
        <div className="h-6 border-l border-gray-200 mx-2"></div>
        <Button variant="ghost" size="icon" disabled={!canUndo()} onClick={undo} aria-label="Undo">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled={!canRedo()} onClick={redo} aria-label="Redo">
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-sm font-medium text-gray-500">
        Editing: {projectId === 'new' ? 'New Project' : projectId}
      </div>

      <div className="flex items-center gap-2">
        <ExportModal />
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save Project
        </Button>
      </div>
    </header>
  );
}
