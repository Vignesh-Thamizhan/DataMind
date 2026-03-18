import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,

      login: (data) => set({ token: data.token, user: data.user, error: null }),
      logout: () => set({ token: null, user: null }),
      setLoading: (v) => set({ isLoading: v }),
      setError: (e) => set({ error: e }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'datamind-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);