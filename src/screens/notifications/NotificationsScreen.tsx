"use client";

import { useEffect, useState } from "react";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { useNotificationsLogic } from "./hooks/useNotificationsLogic";

import { NotificationsHeader } from "./components/NotificationsHeader";
import { TabsSection } from "./components/TabsSection";

export default function NotificationsScreen() {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "notifications");
   const [activeTab, setActiveTab] = useState("all");

   const {
      allNotifications,
      unreadNotifications,
      readNotifications,
      isLoading,
      markingAsRead,
      fetchNotifications,
      handleMarkAsRead,
      handleMarkAllAsRead,
   } = useNotificationsLogic(t);

   useEffect(() => {
      fetchNotifications();
   }, []);

   return (
      <div className="max-w-3xl mx-auto flex-1 px-4 py-6 pb-20 md:pb-6">
         <NotificationsHeader
            unreadCount={unreadNotifications.length}
            onMarkAllAsRead={handleMarkAllAsRead}
            t={t}
         />

         <TabsSection
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isLoading={isLoading}
            allNotifications={allNotifications}
            unreadNotifications={unreadNotifications}
            readNotifications={readNotifications}
            markingAsRead={markingAsRead}
            onMarkAsRead={handleMarkAsRead}
            t={t}
         />
      </div>
   );
}
