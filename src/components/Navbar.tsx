"use client"

import { Search, LogOut } from "lucide-react";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { usePathname } from "next/navigation";
import { useProgressRouter } from "./ProgressLink";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { Home, User, MessageCircle, Bell, Settings } from "lucide-react";
import type { NavItem } from "../types/navbar";
import useAuth from "@/zustand/useAuth";

const NAV_ITEMS: NavItem[] = [
   { id: "home", icon: <Home className="w-5 h-5" />, path: "home" },
   { id: "messages", icon: <MessageCircle className="w-5 h-5" />, path: "messages", badge: 3 },
   { id: "notifications", icon: <Bell className="w-5 h-5" />, path: "notifications", badge: 5 },
   { id: "profile", icon: <User className="w-5 h-5" />, path: "profile" },
   { id: "settings", icon: <Settings className="w-5 h-5" />, path: "settings" },
];

const Navbar = () => {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "navbar");
   const pathname = usePathname();
   const router = useProgressRouter();
   const { doLogout } = useAuth();

   const currentPage = pathname === "/" ? "home" : pathname.split("/")[1];

   const onNavigate = (path: string) => {
      if (path === "home") {
         router.push("/");
      } else {
         router.push(`/${path}`);
      }
   };

   const renderNavItems = (isMobile = false) =>
      NAV_ITEMS.map((item) => {
         const isActive = currentPage === (item.path === "home" ? "" : item.path);
         const Component = isMobile ? MobileNavLink : NavLink;
         const iconSize = isMobile ? "w-6 h-6" : "w-5 h-5";

         return (
            <Component
               key={item.id}
               onClick={() => onNavigate(item.path)}
               active={isActive}
               badge={item.badge}
            >
               {typeof item.icon === "string" ? (
                  <span className={iconSize}>{item.icon}</span>
               ) : (
                  item.icon
               )}
            </Component>
         );
      });

   return (
      <nav className="sticky top-0 z-50 border-b bg-white dark:bg-gray-900 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
               <div className="flex items-center gap-8">
                  <div 
                     className="cursor-pointer flex items-center gap-2"
                     onClick={() => onNavigate("home")}
                  >
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white">S</span>
                     </div>
                     <span className="hidden md:block text-gray-900 dark:text-white">SocialHub</span>
                  </div>

                  {/* Desktop Search */}
                  <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-64">
                     <Search className="w-4 h-4 text-gray-400 mr-2" />
                     <input
                        type="text"
                        placeholder={t("search")}
                        className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-white placeholder:text-gray-400"
                     />
                  </div>
               </div>

               {/* Desktop Navigation */}
               <div className="hidden md:flex items-center gap-2">
                  {renderNavItems(false)}
                  
                  <div className="border-l border-gray-200 dark:border-gray-700 mx-2 h-6" />
               </div>

               <div className="flex items-center gap-2">
                  <ThemeSwitcher />
                  <LanguageSwitcher />
                  <button
                     onClick={doLogout}
                     className="p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                     title="Logout"
                  >
                     <LogOut className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </div>

         {/* Mobile Bottom Navigation */}
         <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 px-4 py-2 flex items-center justify-around">
            {renderNavItems(true)}
         </div>
      </nav>
   );
}

const NavLink = ({ onClick, active, badge, children }: any) => (
   <button
      onClick={onClick}
      className={`relative p-3 rounded-xl transition-all ${
         active
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
   >
      {children}
      {badge && (
         <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
         </span>
      )}
   </button>
);

const MobileNavLink = ({ onClick, active, badge, children }: any) => (
   <button
      onClick={onClick}
      className={`relative p-2 rounded-xl transition-all ${
         active
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400"
      }`}
   >
      {children}
      {badge && (
         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
         </span>
      )}
   </button>
);

const NavButton = ({ icon, active, badge }: any) => {
   return (
      <button
         className={`relative p-3 rounded-xl transition-all ${
         active
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
         }`}
      >
         {icon}
         {badge && (
         <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
         </span>
         )}
      </button>
   );
}

const MobileNavButton = ({ icon, active, badge }: any) => {
   return (
      <button
         className={`relative p-2 rounded-xl transition-all ${
         active
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400"
         }`}
      >
         {icon}
         {badge && (
         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
         </span>
         )}
      </button>
   );
}

export default Navbar;