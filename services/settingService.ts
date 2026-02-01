import { AIProvider, AISettings } from "@/types";

const SETTINGS_KEY = "dear_me_settings";

const defaultSettings: AISettings = {
  provider: AIProvider.GEMINI,
  geminiApiKey: "",
  geminiModel: "gemini-3-flash-preview",
  openaiApiKey: "",
  openaiModel: "gpt-4o-mini",
  openaiEndpoint: "",
};

export const loadSettings = (): AISettings => {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved settings", e);
    }
  }
  return defaultSettings;
};
export const saveSettings = (settings: AISettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
