import { create } from "zustand";
import { useMessageStore } from "./messageStore";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  users: [],
  token: localStorage.getItem("authToken") || null,

  login: (userData) => {
    set({ user: userData.data, token: userData.token });

    localStorage.setItem("user", JSON.stringify(userData.data));
    localStorage.setItem("authToken", userData.token);

    const messageStore = useMessageStore.getState();
    messageStore.setMessages([]);
  },
  logout: () => {
    set({ user: null, token: null });

    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    // 👉 Clear message store on logout
    useMessageStore.getState().setMessages([]);
    useMessageStore.getState().setSelectedUser(null);
  },
}));
