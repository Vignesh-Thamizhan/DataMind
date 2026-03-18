import { create } from 'zustand';

export const useDatasetStore = create((set) => ({
  datasets: [],
  activeDataset: null,
  uploadProgress: 0,
  uploadStatus: null, // 'uploading' | 'processing' | 'ready' | 'error'

  setDatasets: (datasets) => set({ datasets }),
  setActive: (dataset) => set({ activeDataset: dataset }),
  setProgress: (progress) => set({ uploadProgress: progress }),
  setUploadStatus: (status) => set({ uploadStatus: status }),
  clearUpload: () => set({ uploadProgress: 0, uploadStatus: null }),
  removeDataset: (id) =>
    set((state) => ({
      datasets: state.datasets.filter((d) => d._id !== id),
      activeDataset: state.activeDataset?._id === id ? null : state.activeDataset,
    })),
}));