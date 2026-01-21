"use client"

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { webRequest } from "@/helpers/api";
import useAuth from "@/zustand/useAuth";

interface NotificationBadgeProps {
   className?: string;
}

export const NotificationBadge = ({ className = "" }: NotificationBadgeProps) => {
   const [unreadCount, setUnreadCount] = useState<number | null>(null);
   const { currentUser } = useAuth();

   useEffect(() => {
      if (!currentUser?.profileId) return;

      const fetchUnreadCount = async () => {
         try {
            const response = await webRequest.get("/notifications/unread-count", {
               params: { recipientProfileId: currentUser.profileId },
            });
            console.log("Unread count response:", response.data);
            const count = response.data?.count || response.data?.data?.count || 0;
            setUnreadCount(count);
         } catch (error) {
            console.error("Failed to fetch unread count:", error);
         }
      };

      fetchUnreadCount();

      const interval = setInterval(fetchUnreadCount, 30000);

      return () => clearInterval(interval);
   }, [currentUser?.profileId]);

   return (
      <div className={`relative ${className}`}>
         <Bell className="w-5 h-5" />
         {unreadCount !== null && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
               {unreadCount > 9 ? "9+" : unreadCount}
            </span>
         )}
      </div>
   );
};

export default NotificationBadge;
