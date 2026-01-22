export interface LanguageOptionProps {
   lang: { code: string; label: string };
   isActive: boolean;
   onSelect: (code: string) => void;
}

export interface LanguageDropdownProps {
   isOpen: boolean;
   currentLng: string;
   onSelect: (code: string) => void;
}
