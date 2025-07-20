import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // =================================================================
  // AI Job Queue State
  // =================================================================
  jobs: [], // e.g., [{ id, text, status }]
  
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),

  updateJobStatus: (jobId, status) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === jobId ? { ...job, status } : job
      ),
    }));
  },

  removeJob: (jobId) => {
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== jobId),
    }));
  },

  // =================================================================
  // Undo/Redo History State
  // =================================================================
  history: [],
  historyIndex: -1,

  addHistory: (canvasState) => {
    set((state) => {
      // When a new action happens after an undo, clear the "redo" history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(canvasState);
      
      // Keep history capped at a reasonable number, e.g., 50 steps
      const finalHistory = newHistory.slice(-50); 
      
      return {
        history: finalHistory,
        historyIndex: finalHistory.length - 1,
      };
    });
  },

  undo: (canvas) => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevState = history[newIndex];
      canvas.loadFromJSON(prevState, canvas.renderAll.bind(canvas));
      set({ historyIndex: newIndex });
    }
  },

  redo: (canvas) => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      canvas.loadFromJSON(nextState, canvas.renderAll.bind(canvas));
      set({ historyIndex: newIndex });
    }
  },

  // Action to clear history, e.g., on new image upload
  clearHistory: () => set({ history: [], historyIndex: -1 }),

}));
