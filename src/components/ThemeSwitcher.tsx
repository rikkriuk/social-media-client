"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import useTheme, { type Theme } from "@/zustand/useTheme";

const THEME_OPTIONS: { theme: Theme; label: string; icon: React.ReactNode }[] = [
  { theme: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
  { theme: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
  { theme: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !(e.target instanceof Node && ref.current.contains(e.target))) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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

  const currentOption = THEME_OPTIONS.find((opt) => opt.theme === theme);

  const renderThemeOptions = () =>
    THEME_OPTIONS.map((option) => (
      <button
        key={option.theme}
        onClick={() => {
          setTheme(option.theme);
          setIsOpen(false);
        }}
        className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center gap-2 ${
          theme === option.theme
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
      >
        {option.icon}
        {option.label}
      </button>
    ));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        title="Change theme"
      >
        {currentOption?.icon}
        <ChevronDown className={`w-3.5 h-3.5 ml-0.5 opacity-60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
          {renderThemeOptions()}
        </div>
      )}
    </div>
  );
}
