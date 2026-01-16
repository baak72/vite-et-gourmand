import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  
  user: null,

setUser: (userData) => set({ user: userData }),
clearUser: () => set({ user: null }),

}));