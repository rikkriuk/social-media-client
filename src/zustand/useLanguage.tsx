import { create } from "zustand";
import { ListLangType } from "../i18n/settings";
import Cookies from "js-cookie";
import { persist, createJSONStorage } from "zustand/middleware";

type Language = {
  lng: ListLangType;
  setLng: (newLng: ListLangType) => void;
};

const useLanguage = create(
  persist<Language>(
    (set) => ({
      lng: (Cookies.get("i18next") as ListLangType) || "en",
      setLng: (newLng: ListLangType) => {
        Cookies.set("i18next", newLng);
        set({ lng: newLng });
      },
    }),
    {
      name: "language",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useLanguage;
