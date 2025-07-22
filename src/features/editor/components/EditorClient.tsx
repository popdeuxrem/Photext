'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { Header } from './Header';
import { JobStatusPanel } from './JobStatusPanel';

type ProjectData = {
  id: string;
  name: string;
  canvas_data: object;
};

type EditorClientProps = {
  projectId: string;
  initialProjectData: ProjectData | null;
};

export function EditorClient({ projectId, initialProjectData }: EditorClientProps) {
  const { fabricCanvas, saveState } = useAppStore();

  useEffect(() => {
    if (fabricCanvas && initialProjectData) {
      fabricCanvas.loadFromJSON(initialProjectData.canvas_data, () => {
        fabricCanvas.renderAll();
        saveState('initial-load');
      });
    }
  }, [fabricCanvas, initialProjectData, saveState]);

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <Header projectId={projectId} />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <main className="flex-1 p-4 flex items-center justify-center bg-gray-800/50">
          <div className="shadow-2xl"><Canvas /></div>
        </main>
      </div>
      <JobStatusPanel />
    </div>
  );
}
