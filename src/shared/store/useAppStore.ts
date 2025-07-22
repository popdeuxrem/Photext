import { create } from 'zustand';
import { fabric } from 'fabric';

// Define types for our state
type JobStatus = 'processing' | 'completed' | 'failed';

type Job = {
  id: number;
  text: string;
  status: JobStatus;
};

type AppState = {
  fabricCanvas: fabric.Canvas | null;
  activeObject: fabric.Object | null;
  history: string[];
  historyIndex: number;
  jobs: Job[];
};

type AppActions = {
  setFabricCanvas: (canvas: fabric.Canvas) => void;
  setActiveObject: (object: fabric.Object | null) => void;
  saveState: (source?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  addJob: (job: Job) => void;
  updateJob: (jobId: number, status: JobStatus, text?: string) => void;
  removeJob: (jobId: number) => void;
  clearCompletedJobs: () => void;
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  fabricCanvas: null,
  activeObject: null,
  history: [],
  historyIndex: -1,
  jobs: [],

  setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),
  setActiveObject: (object) => set({ activeObject: object }),

  saveState: () => {
    const canvas = get().fabricCanvas;
    if (!canvas) return;
    const currentState = get().history[get().historyIndex];
    const newState = JSON.stringify(canvas.toJSON());
    if (currentState === newState) return;

    const newHistory = get().history.slice(0, get().historyIndex + 1);
    newHistory.push(newState);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const canvas = get().fabricCanvas;
    if (get().canUndo()) {
      const newIndex = get().historyIndex - 1;
      const prevState = JSON.parse(get().history[newIndex]);
      canvas?.loadFromJSON(prevState, () => {
        canvas.renderAll();
        const bgImage = canvas.backgroundImage;
        if (bgImage && typeof bgImage !== 'string' && bgImage.src) {
            canvas.setBackgroundImage(bgImage.src, canvas.renderAll.bind(canvas));
        }
      });
      set({ historyIndex: newIndex });
    }
  },

  redo: () => {
    const canvas = get().fabricCanvas;
    if (get().canRedo()) {
      const newIndex = get().historyIndex + 1;
      const nextState = JSON.parse(get().history[newIndex]);
      canvas?.loadFromJSON(nextState, () => {
        canvas.renderAll();
        const bgImage = canvas.backgroundImage;
        if (bgImage && typeof bgImage !== 'string' && bgImage.src) {
            canvas.setBackgroundImage(bgImage.src, canvas.renderAll.bind(canvas));
        }
      });
      set({ historyIndex: newIndex });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (jobId, status, text) => {
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, status, text: text || j.text } : j)),
    }));
  },
  removeJob: (jobId) => set((state) => ({ jobs: state.jobs.filter((j) => j.id !== jobId) })),
  clearCompletedJobs: () => set((state) => ({ jobs: state.jobs.filter((j) => j.status === 'processing') })),
}));
