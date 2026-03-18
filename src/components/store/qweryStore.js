import { create } from 'zustand';

export const useQueryStore = create((set) => ({
  currentResult: null,
  history: [],
  isLoading: false,
  error: null,

  setResult: (result) => set({ currentResult: result, error: null }),
  setLoading: (v) => set({ isLoading: v }),
  setError: (e) => set({ error: e, isLoading: false }),
  clearResult: () => set({ currentResult: null, error: null }),
  setHistory: (history) => set({ history }),
  prependHistory: (item) =>
    set((state) => ({ history: [item, ...state.history] })),
}));