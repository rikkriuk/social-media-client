import { Button } from "@/components/ui/button";

interface NotificationsHeaderProps {
   unreadCount: number;
   onMarkAllAsRead: () => void;
   t: (key: string) => string | undefined;
}

export const NotificationsHeader = ({
   unreadCount,
   onMarkAllAsRead,
   t,
}: NotificationsHeaderProps) => {
   return (
      <div className="flex items-center justify-between mb-6">
         <h1 className="text-gray-900 dark:text-white text-2xl font-semibold">
            {t("notifications")}
         </h1>
         {unreadCount > 0 && (
            <Button
               variant="outline"
               size="sm"
               onClick={onMarkAllAsRead}
               className="text-blue-600 dark:text-blue-400"
            >
               {t("markAllAsRead") || "Mark all as read"}
            </Button>
         )}
      </div>
   );
};
