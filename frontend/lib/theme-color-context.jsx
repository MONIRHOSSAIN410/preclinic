"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// Each preset stores raw "H S% L%" triplets so they can be dropped straight
// into the CSS custom properties Tailwind reads (hsl(var(--primary)) etc.)
export const COLOR_PRESETS = [
  { name: "Indigo", value: "indigo", primary: "243 75% 59%", accent: "243 75% 96%" },
  { name: "Blue", value: "blue", primary: "217 91% 55%", accent: "217 91% 95%" },
  { name: "Teal", value: "teal", primary: "173 80% 36%", accent: "173 60% 94%" },
  { name: "Emerald", value: "emerald", primary: "152 60% 40%", accent: "152 60% 94%" },
  { name: "Amber", value: "amber", primary: "38 92% 50%", accent: "38 92% 94%" },
  { name: "Rose", value: "rose", primary: "347 77% 50%", accent: "347 77% 95%" },
  { name: "Violet", value: "violet", primary: "262 83% 58%", accent: "262 83% 96%" },
  { name: "Slate", value: "slate", primary: "215 25% 27%", accent: "215 25% 94%" },
];

const ThemeColorContext = createContext(null);
const STORAGE_KEY = "preclinic_brand_color";

export function ThemeColorProvider({ children }) {
  const [color, setColorState] = useState("indigo");

  const applyColor = useCallback((value) => {
    const preset = COLOR_PRESETS.find((c) => c.value === value) || COLOR_PRESETS[0];
    const root = document.documentElement;
    root.style.setProperty("--primary", preset.primary);
    root.style.setProperty("--ring", preset.primary);
    root.style.setProperty("--sidebar-accent", preset.accent);
    const isDark = root.classList.contains("dark");
    root.style.setProperty("--accent", isDark ? preset.accent.replace(/9[4-6]%$/, "18%") : preset.accent);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored || "indigo";
    setColorState(initial);
    applyColor(initial);
  }, [applyColor]);

  const setColor = useCallback(
    (value) => {
      setColorState(value);
      localStorage.setItem(STORAGE_KEY, value);
      applyColor(value);
    },
    [applyColor]
  );

  return (
    <ThemeColorContext.Provider value={{ color, setColor, presets: COLOR_PRESETS }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export const useThemeColor = () => {
  const ctx = useContext(ThemeColorContext);
  if (!ctx) throw new Error("useThemeColor must be used within ThemeColorProvider");
  return ctx;
};
