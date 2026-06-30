import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Settings {
  defaultModel: string;
  temperature: number;
  apiKey: string;
  language: string;
  fontSize: "small" | "medium" | "large";
}

export interface SettingState {
  settings: Settings;
  setDefaultModel: (model: string) => void;
  setTemperature: (temp: number) => void;
  setApiKey: (apiKey: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  defaultModel: "deepseek",
  temperature: 0.7,
  apiKey: "",
  language: "zh-CN",
  fontSize: "medium",
};

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      settings: { ...defaultSettings },
      setDefaultModel: (model) =>
        set((state) => ({
          settings: { ...state.settings, defaultModel: model },
        })),
      setTemperature: (temp) =>
        set((state) => ({
          settings: { ...state.settings, temperature: temp },
        })),
      setApiKey: (apiKey) =>
        set((state) => ({
          settings: { ...state.settings, apiKey },
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: { ...defaultSettings } }),
    }),
    {
      name: "finpilot-settings",
      partialize: (state) => ({
        settings: state.settings,
      }),
    },
  ),
);
