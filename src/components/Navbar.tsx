"use client"

import { Home, User, MessageCircle, Bell, Settings, Search, Globe } from "lucide-react";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";

const Navbar = () => {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "navbar");

   const currentPage: string = "home"
   const onNavigate = (page: string) => {};

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
                  <NavButton
                     icon={<Home className="w-5 h-5" />}
                     active={currentPage === "home"}
                     onClick={() => onNavigate("home")}
                  />
                  <NavButton
                     icon={<MessageCircle className="w-5 h-5" />}
                     active={currentPage === "messages"}
                     onClick={() => onNavigate("messages")}
                     badge={3}
                  />
                  <NavButton
                     icon={<Bell className="w-5 h-5" />}
                     active={currentPage === "notifications"}
                     onClick={() => onNavigate("notifications")}
                     badge={5}
                  />
                  <NavButton
                     icon={<User className="w-5 h-5" />}
                     active={currentPage === "profile"}
                     onClick={() => onNavigate("profile")}
                  />
                  <NavButton
                     icon={<Settings className="w-5 h-5" />}
                     active={currentPage === "settings"}
                     onClick={() => onNavigate("settings")}
                  />
               </div>
            </div>
         </div>

         {/* Mobile Bottom Navigation */}
         <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 px-4 py-2 flex items-center justify-around">
            <MobileNavButton
               icon={<Home className="w-6 h-6" />}
               active={currentPage === "home"}
               onClick={() => onNavigate("home")}
            />
            <MobileNavButton
               icon={<MessageCircle className="w-6 h-6" />}
               active={currentPage === "messages"}
               onClick={() => onNavigate("messages")}
               badge={3}
            />
            <MobileNavButton
               icon={<Bell className="w-6 h-6" />}
               active={currentPage === "notifications"}
               onClick={() => onNavigate("notifications")}
               badge={5}
            />
            <MobileNavButton
               icon={<User className="w-6 h-6" />}
               active={currentPage === "profile"}
               onClick={() => onNavigate("profile")}
            />
            <MobileNavButton
               icon={<Settings className="w-6 h-6" />}
               active={currentPage === "settings"}
               onClick={() => onNavigate("settings")}
            />
         </div>
      </nav>
   );
}

const NavButton = ({ icon, active, onClick, badge }: any) => {
   return (
      <button
         onClick={onClick}
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

const MobileNavButton = ({ icon, active, onClick, badge }: any) => {
   return (
      <button
         onClick={onClick}
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