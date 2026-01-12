"use client";

import React, { useEffect, useRef, useState } from "react";
import useTheme, { type Theme } from "@/zustand/useTheme";

const THEME_META: Record<Theme, { label: string; icon: string }> = {
  light: { label: "Light", icon: "☀️" },
  dark: { label: "Dark", icon: "🌙" },
  system: { label: "System", icon: "💻" },
};

const themes: Theme[] = ["light", "dark", "system"];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme === "dark");
    }
  }, [theme]);

  const handleSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-label="Toggle theme"
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition"
      >
        <span className="text-lg leading-none">{THEME_META[theme].icon}</span>
        <span className="text-sm font-medium hidden sm:inline-block">
          {THEME_META[theme].label}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-20">
          <div className="py-1">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => handleSelect(t)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <span className="text-lg leading-none">{THEME_META[t].icon}</span>
                <span className="flex-1">{THEME_META[t].label}</span>
                {t === theme && <span className="text-xs text-blue-600">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
