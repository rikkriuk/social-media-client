import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationsList } from "./NotificationsList";
import type { TabsSectionProps } from "@/types/notifications";

export const TabsSection = ({
   activeTab,
   onTabChange,
   isLoading,
   allNotifications,
   unreadNotifications,
   readNotifications,
   markingAsRead,
   onMarkAsRead,
   t,
}: TabsSectionProps) => {
   if (isLoading) {
      return (
         <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
         </div>
      );
   }

   return (
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
         <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6 bg-gray-100 dark:bg-gray-800 p-0">
            <TabsTrigger
               value="all"
               className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900"
            >
               {t("all")} ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger
               value="unread"
               className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900"
            >
               {t("unread")} ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger
               value="read"
               className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900"
            >
               {t("read")} ({readNotifications.length})
            </TabsTrigger>
         </TabsList>

         <TabsContent value="all">
            <NotificationsList
               notifications={allNotifications}
               markingAsRead={markingAsRead}
               onMarkAsRead={onMarkAsRead}
               t={t}
            />
         </TabsContent>

         <TabsContent value="unread">
            <NotificationsList
               notifications={unreadNotifications}
               markingAsRead={markingAsRead}
               onMarkAsRead={onMarkAsRead}
               isUnread={true}
               t={t}
            />
         </TabsContent>

         <TabsContent value="read">
            <NotificationsList
               notifications={readNotifications}
               markingAsRead={markingAsRead}
               onMarkAsRead={onMarkAsRead}
               t={t}
            />
         </TabsContent>
      </Tabs>
   );
};
