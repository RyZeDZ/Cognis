import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "@/types";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthActions = {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) =>
      set(() => {
        return { user, isAuthenticated: !!user };
      }),

    setLoading: (loading) => set(() => ({ isLoading: loading })),
  }))
);
