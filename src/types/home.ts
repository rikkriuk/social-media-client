import { Post, Profile } from "@/types/profile";

export interface HomeScreenProps {
   initialPosts: Post[];
   currentProfile: Profile | null;
   onViewPostDetail?: (post: any) => void;
}

export interface CreatePostSectionProps {
   currentProfile: any;
   postContent: {
      content: string;
      mediaIds: string[];
   };
   onContentChange: (content: string) => void;
   isEventPost: boolean;
   onToggleEvent: () => void;
   eventDate: string;
   onEventDateChange: (date: string) => void;
   eventTime: string;
   onEventTimeChange: (time: string) => void;
   eventLocation: string;
   onEventLocationChange: (location: string) => void;
   isOnlineEvent: boolean;
   onToggleOnlineEvent: () => void;
   isPosting: boolean;
   onCreatePost: () => void;
   tFunc: (key: string, options?: any) => string;
}

export interface EventDetailsFormProps {
   eventDate: string;
   onEventDateChange: (date: string) => void;
   eventTime: string;
   onEventTimeChange: (time: string) => void;
   eventLocation: string;
   onEventLocationChange: (location: string) => void;
   isOnlineEvent: boolean;
   onToggleOnlineEvent: () => void;
   tFunc: (key: string, options?: any) => string;
}

export interface PostsFeedProps {
   posts: Post[];
   currentProfile: Profile | null;
   formatPostTime: (createdAt: string) => string;
   onViewDetails?: (post: Post) => void;
   onLikeChange: (postId: string, newLikeCount: number, isLiked: boolean) => void;
   tFunc: (key: string, options?: any) => string;
}

export interface UseCreatePostProps {
  initialPosts: Post[];
  currentProfile: Profile | null;
}

export interface HomeClientProps {
  initialPosts: Post[];
  currentProfile: Profile | null;
  onViewPostDetail?: (post: any) => void;
}
