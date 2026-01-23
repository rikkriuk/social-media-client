export interface NotificationData {
   id: string;
   type: "like" | "comment" | "follow";
   recipientProfileId: string;
   actorProfileId: string;
   actor?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
   };
   postId?: string;
   commentId?: string;
   isRead: boolean;
   createdAt: string;
}

export interface NotificationItemProps {
   notification: NotificationData;
   isMarking: boolean;
   onMarkAsRead: (id: string) => void;
   t: (key: string) => string | undefined;
}

export interface NotificationsListProps {
   notifications: NotificationData[];
   markingAsRead: string | null;
   onMarkAsRead: (id: string) => void;
   isUnread?: boolean;
   t: (key: string) => string | undefined;
}

export interface TabsSectionProps {
   activeTab: string;
   onTabChange: (tab: string) => void;
   isLoading: boolean;
   allNotifications: NotificationData[];
   unreadNotifications: NotificationData[];
   readNotifications: NotificationData[];
   markingAsRead: string | null;
   onMarkAsRead: (id: string) => void;
   t: (key: string) => string | undefined;
}

export interface NotificationsHeaderProps {
   unreadCount: number;
   onMarkAllAsRead: () => void;
   t: (key: string) => string | undefined;
}