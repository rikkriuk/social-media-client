"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import useLanguage from "@/zustand/useLanguage";
import i18next from "i18next";
import { type ListLangType } from "@/i18n/settings";
import { LANGUAGES } from "@/const/languages";
import { LanguageDropdownProps, LanguageOptionProps } from "@/types/lang";

const BUTTON_CLASS = "flex items-center p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all";
const DROPDOWN_CLASS = "absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50";

const useClickOutside = (ref: RefObject<HTMLDivElement | null>, callback: () => void) => {
   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (ref.current && !(e.target instanceof Node && ref.current.contains(e.target))) {
            callback();
         }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
   }, [ref, callback]);
};

function LanguageOption({ lang, isActive, onSelect }: LanguageOptionProps) {
   const baseClass = "w-full text-left px-4 py-2.5 text-sm transition-all";
   const activeClass = isActive
      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50";

   return (
      <button
         key={lang.code}
         onClick={() => onSelect(lang.code)}
         className={`${baseClass} ${activeClass}`}
      >
         {lang.label}
      </button>
   );
}

function LanguageDropdown({ isOpen, currentLng, onSelect }: LanguageDropdownProps) {
   if (!isOpen) return null;

   return (
      <div className={DROPDOWN_CLASS}>
         {LANGUAGES.map((lang) => (
            <LanguageOption
               key={lang.code}
               lang={lang}
               isActive={currentLng === lang.code}
               onSelect={onSelect}
            />
         ))}
      </div>
   );
}

export default function LanguageSwitcher() {
   const { lng, setLng } = useLanguage();
   const [isOpen, setIsOpen] = useState(false);
   const ref = useRef<HTMLDivElement | null>(null);

   useClickOutside(ref, () => setIsOpen(false));

   const handleSelect = (newLng: string) => {
      setLng(newLng as ListLangType);
      try {
         i18next.changeLanguage(newLng);
      } catch (e) {
         // ignore
      }
      setIsOpen(false);
   };

   const toggleOpen = () => setIsOpen(!isOpen);

   return (
      <div ref={ref} className="relative">
         <button
            type="button"
            onClick={toggleOpen}
            className={BUTTON_CLASS}
            title="Change language"
         >
            <Globe className="w-5 h-5" />
            <ChevronDown
               className={`w-3.5 h-3.5 ml-0.5 opacity-60 transition-transform ${
                  isOpen ? "rotate-180" : ""
               }`}
            />
         </button>

         <LanguageDropdown
            isOpen={isOpen}
            currentLng={lng}
            onSelect={handleSelect}
         />
      </div>
   );
}
