// frontend/store/sidebarStore.ts
import { create } from "zustand";

type SidebarState = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
