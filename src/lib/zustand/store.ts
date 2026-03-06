import { create } from 'zustand';
interface User {
  name: string;
}

export const useAuth = create((set) => ({
  authUser: {
    name: '',
  },
  setAuthuser: (user: User) => set({ authUser: user }),
}));
