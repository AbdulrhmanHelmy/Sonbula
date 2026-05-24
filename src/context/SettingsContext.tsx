"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { translations, Language } from "./translations";

type Theme = "light" | "dark" | "system";
type FontSize = "small" | "medium" | "large";

interface SettingsState {
  language: Language;
  theme: Theme;
  fontSize: FontSize;
}

interface SettingsContextValue extends SettingsState {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "sonbula-settings-v2";

const defaults: SettingsState = {
  language: "ar",
  theme: "dark",
  fontSize: "medium",
};

const SettingsContext = createContext<SettingsContextValue>({
  ...defaults,
  setLanguage: () => {},
  setTheme: () => {},
  setFontSize: () => {},
  t: (key) => key,
});

// ─── DOM Applier ─────────────────────────────────────────────────────────────

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.removeAttribute("data-theme");
  } else if (theme === "light") {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  } else {
    // system
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      root.classList.add("dark");
      root.removeAttribute("data-theme");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }
}

function applyLanguage(lang: Language) {
  const root = document.documentElement;
  root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  root.setAttribute("lang", lang === "ar" ? "ar" : "en");
}

function applyFontSize(size: FontSize) {
  document.documentElement.setAttribute("data-font-size", size);
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(defaults);

  // Load from localStorage and apply on mount (client only)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved: Partial<SettingsState> = raw ? JSON.parse(raw) : {};
    const merged: SettingsState = { ...defaults, ...saved };
    setSettings(merged);
    applyTheme(merged.theme);
    applyLanguage(merged.language);
    applyFontSize(merged.fontSize);
    setMounted(true);
  }, []);

  // System theme listener
  useEffect(() => {
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.theme]);

  const persist = useCallback((next: SettingsState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setLanguage = useCallback(
    (lang: Language) => {
      setSettings((prev) => {
        const next = { ...prev, language: lang };
        persist(next);
        applyLanguage(lang);
        return next;
      });
    },
    [persist]
  );

  const setTheme = useCallback(
    (theme: Theme) => {
      setSettings((prev) => {
        const next = { ...prev, theme };
        persist(next);
        applyTheme(theme);
        return next;
      });
    },
    [persist]
  );

  const setFontSize = useCallback(
    (fontSize: FontSize) => {
      setSettings((prev) => {
        const next = { ...prev, fontSize };
        persist(next);
        applyFontSize(fontSize);
        return next;
      });
    },
    [persist]
  );

  const t = useCallback(
    (key: string): string => {
      return translations[settings.language]?.[key] ?? key;
    },
    [settings.language]
  );

  // Prevent layout flash: render children invisibly until mounted
  return (
    <SettingsContext.Provider
      value={{ ...settings, setLanguage, setTheme, setFontSize, t }}
    >
      <div
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.15s ease" }}
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
