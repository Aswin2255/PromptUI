import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface User {
  name: string;
}
interface Model {
  modelname: string;
  url: string;
  apikey?: string;
}

interface Authstore {
  authUser: User;
  setauthUser: (user: User) => void;
}

interface Modelstore {
  modelDetails: Model[];
  setModel: (model: Model) => void;
  clearModel: () => void;
}

export const useAuthUser = create<Authstore>((set) => ({
  authUser: {
    name: '',
  },
  setauthUser(user) {
    set({ authUser: user });
  },
}));

export const useModel = create<Modelstore>()(
  persist(
    (set) => ({
      modelDetails: [],
      setModel(model: Model) {
        set((state) => ({ modelDetails: [...state.modelDetails, model] }));
      },
      clearModel() {
        set({ modelDetails: [] });
      },
    }),
    {
      name: 'model-storage',
    },
  ),
);
