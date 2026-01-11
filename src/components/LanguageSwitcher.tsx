"use client";

import React, { useEffect, useRef, useState } from "react";
import useLanguage from "@/zustand/useLanguage";
import i18next from "i18next";
import { languages, type ListLangType } from "@/i18n/settings";

const LANG_META: Record<ListLangType, { label: string; flag: string }> = {
  en: { label: "English", flag: "EN" },
  id: { label: "Bahasa Indonesia", flag: "ID" },
  su: { label: "Basa Sunda", flag: "SU" },
};

export default function LanguageSwitcher() {
   const { lng, setLng } = useLanguage();
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

   const handleSelect = (newLng: ListLangType) => {
      setLng(newLng);
      try {
         i18next.changeLanguage(newLng);
      } catch (e) {
         // ignore
      }
      setOpen(false);
   };

   return (
      <div ref={ref} className="relative inline-block text-left">
         <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition"
         >
            <span className="text-lg font-bold leading-none">{LANG_META[lng].flag}</span>
            <span className="text-sm font-medium hidden sm:inline-block">{LANG_META[lng].label}</span>
         </button>

         {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-20">
               <div className="py-1">
                  {languages.map((l) => (
                  <button
                     key={l}
                     onClick={() => handleSelect(l as ListLangType)}
                     className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                     <span className="text-lg leading-none">{LANG_META[l as ListLangType].flag}</span>
                     <span className="flex-1">{LANG_META[l as ListLangType].label}</span>
                     {l === lng && <span className="text-xs text-blue-600">✓</span>}
                  </button>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}
