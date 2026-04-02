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

export interface Message {
  chatsession_id: string;
  role: 'user' | 'ai';
  message: string;
  model: string;
  createdAt?: string;
  typing: boolean;
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
  updateMessage: (chatsession_id: string, message: string) => void;
  setTyping: (chatsession_id: string, typing: boolean) => void;
}

export interface ChatItem {
  _id: string;
  title: string;
  createdAt: Date;
}

interface ChatHistoryStore {
  chats: ChatItem[];
  setChats: (chats: ChatItem[]) => void;
  addChat: (chat: ChatItem) => void;
  removeChat: (id: string) => void;
  clearChats: () => void;
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
  // Update message text while streaming
  updateMessage: (chatsession_id, message) =>
    set((state) => ({
      messageDetails: state.messageDetails.map((msg) =>
        msg.chatsession_id === chatsession_id ? { ...msg, message } : msg,
      ),
    })),

  // Update typing status
  setTyping: (chatsession_id, typing) =>
    set((state) => ({
      messageDetails: state.messageDetails.map((msg) =>
        msg.chatsession_id === chatsession_id ? { ...msg, typing } : msg,
      ),
    })),
}));

export const useTyping = create<Typingstore>((set) => ({
  isTyping: false,
  setistyping(value: boolean) {
    set({ isTyping: value });
  },
}));

export const useChatHistory = create<ChatHistoryStore>((set) => ({
  chats: [],

  setChats: (chats) => set({ chats }),

  addChat: (chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),

  removeChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat._id !== id),
    })),

  clearChats: () => set({ chats: [] }),
}));
