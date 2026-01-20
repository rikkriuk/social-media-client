"use client"

import { useTranslationCustom } from "@/i18n/client";
import useLanguage from "@/zustand/useLanguage";
import { Users, TrendingUp, Calendar, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ProgressLink } from "./ProgressLink";

const LeftSidebar = () => {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "sidebar");

   const menuItems = [
      { icon: <Users className="w-5 h-5" />, label: t("friends"), badge: "124", link: "/friends" },
      { icon: <Bookmark className="w-5 h-5" />, label: t("saved"), badge: null, link: "/saved" },
      { icon: <Calendar className="w-5 h-5" />, label: t("events"), badge: "3", link: "/events" },
      { icon: <TrendingUp className="w-5 h-5" />, label: t("trending"), badge: null, link: "/trending" },
   ];

  return (
    <div className="hidden lg:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] p-4 overflow-y-auto">
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <ProgressLink
            href={item.link}
            key={index}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-gray-500 text-sm">{item.badge}</span>
            )}
          </ProgressLink>
        ))}
      </div>
    </div>
  );
}

const RightSidebar = () => {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "sidebar");

   const onlineFriends = [
      { name: "Sarah Johnson", avatar: undefined, status: "online" },
      { name: "Michael Chen", avatar: undefined, status: "online" },
      { name: "Emma Wilson", avatar: undefined, status: "online" },
      { name: "David Brown", avatar: undefined, status: "online" },
      { name: "Lisa Anderson", avatar: undefined, status: "online" },
   ];

   const _renderAvatar = (friend: any, index: number) => (
      <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all">
         <div className="relative">
            <Avatar>
               <AvatarImage src={friend.avatar} />
               <AvatarFallback>{friend.name[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
         </div>
         <span className="text-gray-900 dark:text-white text-sm">{friend.name}</span>
      </div>
   )

   return (
      <div className="hidden xl:block w-72 fixed right-0 top-16 h-[calc(100vh-4rem)] p-4 overflow-y-auto border-l border-gray-100 dark:border-gray-800">
         <div className="mb-4">
         <h3 className="text-gray-500 mb-3">{t("online")} {t("friends")}</h3>
         <div className="space-y-3">
            {onlineFriends.map((friend, index) => (
               _renderAvatar(friend, index)
            ))}
         </div>
         </div>
      </div>
   );
}

export { LeftSidebar, RightSidebar };