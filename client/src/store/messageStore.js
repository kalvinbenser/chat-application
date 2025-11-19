import { create } from "zustand";
import api from "../api/axios";
import { useAuthStore } from "./authStore";

export const useMessageStore = create((set, get) => ({
  selectedUser: null,
  messages: [],

  setSelectedUser: async (user) => {
    set({ selectedUser: user, messages: [] });

    try {
      const res = await api.get(`/user/message/${user._id}`);
      set({ messages: res.data.data || [] });
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  },

  receiveMessage: (msg) =>
    set((state) => {
      const authStore = useAuthStore.getState();

      const currentUserId = authStore.user?._id;
      const selectedUserId = state.selectedUser?._id;

      if (!selectedUserId) return {};

      const isValid =
        (msg.fromUserId === currentUserId && msg.toUserId === selectedUserId) ||
        (msg.fromUserId === selectedUserId && msg.toUserId === currentUserId);
      console.log({ msg, isValid });
      if (!isValid) return {};

      return {
        messages: [...state.messages, msg],
      };
    }),
  setLocalMessage: (msg) =>
    set((state) => {
      return {
        messages: [...state.messages, msg],
      };
    }),
  setMessages: (messages) => {
    set({ messages });
  },
}));
