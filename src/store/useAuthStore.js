import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  
  // --- 1. L'ÉTAT ---
  user: null,

  // --- 2. LES ACTIONS --- 
setUser: (userData) => set({ user: userData }),
clearUser: () => set({ user: null }),

}));