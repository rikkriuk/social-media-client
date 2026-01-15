"use client";

import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import useLanguage from "@/zustand/useLanguage";
import i18next from "i18next";
import { languages, type ListLangType } from "@/i18n/settings";
import { LANGUAGES } from "@/const/languages";

export default function LanguageSwitcher() {
   const { lng, setLng } = useLanguage();
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

   const handleSelect = (newLng: string) => {
      setLng(newLng as ListLangType);
      try {
         i18next.changeLanguage(newLng);
      } catch (e) {
         // ignore
      }
      setIsOpen(false);
   };

   const renderLanguageOptions = () => (
      LANGUAGES.map((lang) => (
         <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
               lng === lang.code
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
         >
            {lang.label}
         </button>
      ))
   );

   return (
      <div ref={ref} className="relative">
         <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="Change language"
         >
            <Globe className="w-5 h-5" />
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
               {renderLanguageOptions()}
            </div>
         )}
      </div>
   );
}
