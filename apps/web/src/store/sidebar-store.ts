import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SidebarState {
  collapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleSidebar: () =>
        set((state) => ({
          collapsed: !state.collapsed,
        })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    {
      name: "finpilot-sidebar",
      partialize: (state) => ({
        collapsed: state.collapsed,
      }),
    },
  ),
);
