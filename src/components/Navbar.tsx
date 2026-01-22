"use client"

import { Search, LogOut, Home, User, MessageCircle, Settings } from "lucide-react";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import type { NavItem } from "../types/navbar";
import useAuth from "@/zustand/useAuth";
import NotificationBadge from "./NotificationBadge";

const NAV_ITEMS: NavItem[] = [
   { id: "home", icon: <Home className="w-5 h-5" />, path: "home" },
   { id: "messages", icon: <MessageCircle className="w-5 h-5" />, path: "messages", badge: 3 },
   { id: "notifications", icon: "bell", path: "notifications" },
   { id: "profile", icon: <User className="w-5 h-5" />, path: "profile" },
   { id: "settings", icon: <Settings className="w-5 h-5" />, path: "settings" },
];

const DESKTOP_ICON_SIZE = "w-5 h-5";
const MOBILE_ICON_SIZE = "w-6 h-6";
const DESKTOP_NAV_LINK_CLASS = "relative p-3 rounded-xl transition-all";
const MOBILE_NAV_LINK_CLASS = "relative p-2 rounded-xl transition-all";
const ACTIVE_DESKTOP_CLASS = "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
const INACTIVE_DESKTOP_CLASS = "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800";
const ACTIVE_MOBILE_CLASS = "text-blue-600 dark:text-blue-400";
const INACTIVE_MOBILE_CLASS = "text-gray-600 dark:text-gray-400";
const BADGE_CLASS = "absolute bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center";

const useNavigation = () => {
   const pathname = usePathname();
   const router = useRouter();

   const currentPage = pathname === "/" ? "home" : pathname.split("/")[1];

   const navigate = (path: string) => {
      router.push(path === "home" ? "/" : `/${path}`);
   };

   const isActive = (itemPath: string) => {
      return currentPage === (itemPath === "home" ? "" : itemPath);
   };

   return { navigate, isActive };
};

interface NavIconProps {
   item: NavItem;
   isMobile?: boolean;
}

function NavIcon({ item, isMobile = false }: NavIconProps) {
   const iconSize = isMobile ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE;

   if (item.id === "notifications") {
      return <NotificationBadge className={iconSize} />;
   }

   if (typeof item.icon === "string") {
      return <span className={iconSize}>{item.icon}</span>;
   }

   return item.icon;
}

interface BadgeProps {
   count?: number;
   isMobile?: boolean;
}

function NavBadge({ count, isMobile = false }: BadgeProps) {
   if (!count) return null;

   const positionClass = isMobile ? "top-0 -right-1" : "top-1 right-1";

   return (
      <span className={`${BADGE_CLASS} ${positionClass}`}>
         {count}
      </span>
   );
}

interface NavLinkProps {
   item: NavItem;
   isActive: boolean;
   onClick: () => void;
   isMobile?: boolean;
}

function NavLink({ item, isActive, onClick, isMobile = false }: NavLinkProps) {
   const baseClass = isMobile ? MOBILE_NAV_LINK_CLASS : DESKTOP_NAV_LINK_CLASS;
   const activeClass = isMobile ? ACTIVE_MOBILE_CLASS : ACTIVE_DESKTOP_CLASS;
   const inactiveClass = isMobile ? INACTIVE_MOBILE_CLASS : INACTIVE_DESKTOP_CLASS;
   const statusClass = isActive ? activeClass : inactiveClass;

   return (
      <button
         key={item.id}
         onClick={onClick}
         className={`${baseClass} ${statusClass}`}
      >
         <NavIcon item={item} isMobile={isMobile} />
         <NavBadge count={item.badge} isMobile={isMobile} />
      </button>
   );
}

interface NavItemsListProps {
   isMobile?: boolean;
}

function NavItemsList({ isMobile = false }: NavItemsListProps) {
   const { navigate, isActive } = useNavigation();

   return (
      <>
         {NAV_ITEMS.map((item) => (
            <NavLink
               key={item.id}
               item={item}
               isActive={isActive(item.path)}
               onClick={() => navigate(item.path)}
               isMobile={isMobile}
            />
         ))}
      </>
   );
}

function Logo() {
   const { navigate } = useNavigation();

   return (
      <div
         className="cursor-pointer flex items-center gap-2"
         onClick={() => navigate("home")}
      >
         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white">S</span>
         </div>
         <span className="hidden md:block text-gray-900 dark:text-white">SocialHub</span>
      </div>
   );
}

function SearchBar() {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "navbar");

   return (
      <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-64">
         <Search className="w-4 h-4 text-gray-400 mr-2" />
         <input
            type="text"
            placeholder={t("search")}
            className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-white placeholder:text-gray-400"
         />
      </div>
   );
}

function LogoutButton() {
   const { doLogout } = useAuth();

   return (
      <button
         onClick={doLogout}
         className="p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
         title="Logout"
      >
         <LogOut className="w-5 h-5" />
      </button>
   );
}

export default function Navbar() {
   return (
      <nav className="sticky top-0 z-50 border-b bg-white dark:bg-gray-900 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
               <div className="flex items-center gap-8">
                  <Logo />
                  <SearchBar />
               </div>

               <div className="hidden md:flex items-center gap-2">
                  <NavItemsList />
                  <div className="border-l border-gray-200 dark:border-gray-700 mx-2 h-6" />
               </div>

               <div className="flex items-center gap-2">
                  <ThemeSwitcher />
                  <LanguageSwitcher />
                  <LogoutButton />
               </div>
            </div>
         </div>

         <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 px-4 py-2 flex items-center justify-around">
            <NavItemsList isMobile />
         </div>
      </nav>
   );
}