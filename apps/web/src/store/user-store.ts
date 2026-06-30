import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

export interface UserState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setUser: (user: User, token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  reset: () => void;
}

const mockUser: User = {
  id: "user-001",
  nickname: "FinPilot User",
  email: "user@finpilot.ai",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FinPilot",
  role: "user",
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: mockUser,
      token: "mock-token-12345",
      isLoggedIn: true,
      setUser: (user, token) => set({ user, token, isLoggedIn: true }),
      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
      reset: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: "finpilot-user",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
