import { NotificationItem } from "./NotificationItem";
import type { NotificationsListProps } from "@/types/notifications";

export const NotificationsList = ({
   notifications,
   markingAsRead,
   onMarkAsRead,
   isUnread = false,
   t,
}: NotificationsListProps) => {
   if (notifications.length === 0) {
      return (
         <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500">
               {isUnread
                  ? t("noUnreadNotifications")
                  : t("noReadNotifications")}
            </p>
         </div>
      );
   }

   return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
         {notifications.map((notification) => (
            <NotificationItem
               key={notification.id}
               notification={notification}
               isMarking={markingAsRead === notification.id}
               onMarkAsRead={onMarkAsRead}
               t={t}
            />
         ))}
      </div>
   );
};
