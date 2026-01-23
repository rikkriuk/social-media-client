import { useState, useCallback } from "react";
import { webRequest } from "@/helpers/api";
import { toast } from "sonner";
import useAuth from "@/zustand/useAuth";
import type { NotificationData } from "@/types/notifications";

export const useNotificationsLogic = (t: (key: string) => string | undefined) => {
   const { currentUser } = useAuth();
   const [allNotifications, setAllNotifications] = useState<NotificationData[]>([]);
   const [unreadNotifications, setUnreadNotifications] = useState<NotificationData[]>([]);
   const [readNotifications, setReadNotifications] = useState<NotificationData[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

   const updateNotificationLists = useCallback((notifications: NotificationData[]) => {
      setAllNotifications(notifications);
      setUnreadNotifications(notifications.filter((n) => !n.isRead));
      setReadNotifications(notifications.filter((n) => n.isRead));
   }, []);

   const fetchNotifications = useCallback(async () => {
      if (!currentUser?.profileId) return;

      try {
         setIsLoading(true);
         const response = await webRequest.get("/notifications", {
            params: {
               recipientProfileId: currentUser.profileId,
               limit: 50,
               offset: 0,
            },
         });

         const rows = response.data?.rows || response.data?.data?.rows || [];
         updateNotificationLists(rows);
      } catch (error) {
         console.error("Failed to fetch notifications:", error);
         toast.error(
            t("errorLoadingNotifications") || "Failed to load notifications"
         );
      } finally {
         setIsLoading(false);
      }
   }, [currentUser?.profileId, updateNotificationLists, t]);

   const handleMarkAsRead = useCallback(
      async (notificationId: string) => {
         try {
            setMarkingAsRead(notificationId);
            await webRequest.post(`/notifications/${notificationId}/mark-as-read`);

            const updatedAll = allNotifications.map((n) =>
               n.id === notificationId ? { ...n, isRead: true } : n
            );
            updateNotificationLists(updatedAll);
         } catch (error) {
            console.error("Failed to mark notification as read:", error);
            toast.error(
               t("errorUpdatingNotification") || "Failed to update notification"
            );
         } finally {
            setMarkingAsRead(null);
         }
      },
      [allNotifications, updateNotificationLists, t]
   );

   const handleMarkAllAsRead = useCallback(async () => {
      if (!currentUser?.profileId) return;

      try {
         await webRequest.post("/notifications/mark-all-as-read", {
            recipientProfileId: currentUser.profileId,
         });

         const updated = allNotifications.map((n) => ({ ...n, isRead: true }));
         updateNotificationLists(updated);
         toast.success(t("allMarkedAsRead") || "All notifications marked as read");
      } catch (error) {
         console.error("Failed to mark all as read:", error);
         toast.error(
            t("errorUpdatingNotifications") || "Failed to update notifications"
         );
      }
   }, [currentUser?.profileId, allNotifications, updateNotificationLists, t]);

   return {
      allNotifications,
      unreadNotifications,
      readNotifications,
      isLoading,
      markingAsRead,
      fetchNotifications,
      handleMarkAsRead,
      handleMarkAllAsRead,
   };
};
