import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

type ThemeStore = {
  theme: Theme;
  setTheme: (newTheme: Theme) => void;
};

const useTheme = create(
  persist<ThemeStore>(
    (set) => ({
      theme: "system",
      setTheme: (newTheme: Theme) => {
        set({ theme: newTheme });
      },
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTheme;
export type { Theme };
