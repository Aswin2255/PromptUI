import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface User {
  name: string;
}
interface Model {
  modelname: string;
  url: string;
  apikey?: string;
  type: 'local' | 'cloud';
}

interface Message {
  message_id: string;
  role: 'user' | 'ai';
  content: string;
}

interface Authstore {
  authUser: User;
  setauthUser: (user: User) => void;
  logout: () => void;
}

interface Typingstore {
  isTyping: boolean;
  setistyping: (value: boolean) => void;
}

interface Modelstore {
  modelDetails: Model[];
  setModel: (model: Model) => void;
  clearModel: () => void;
}

interface Messagestore {
  messageDetails: Message[];
  setchatMessage: (message: Message) => void;
}

export const useAuthUser = create<Authstore>((set) => ({
  authUser: {
    name: '',
  },
  setauthUser(user) {
    set({ authUser: user });
  },
  logout() {
    set({ authUser: { name: '' } });
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

export const useMessage = create<Messagestore>((set) => ({
  messageDetails: [],
  setchatMessage(message: Message) {
    set((state) => ({ messageDetails: [...state.messageDetails, message] }));
  },
}));

export const useTyping = create<Typingstore>((set) => ({
  isTyping: false,
  setistyping(value: boolean) {
    set({ isTyping: value });
  },
}));
