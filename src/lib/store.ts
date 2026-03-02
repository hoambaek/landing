import { create } from "zustand";

interface AppState {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSection: "the-void",
  setCurrentSection: (section) => set({ currentSection: section }),
}));
