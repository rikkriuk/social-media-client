import type { Post } from "@/types/profile";
export interface CommentProfile {
   id: string;
   name: string;
   profileImage?: string;
}

export interface Comment {
   id: string;
   postId: string;
   profileId: string;
   content: string;
   likesCount: number;
   createdAt: string;
   updatedAt?: string;
   profile?: CommentProfile;
   parentId?: string | null;
   replies?: Comment[];
}

export interface ReplyTarget {
   commentId: string;
   profileName: string;
}

export interface CommentListResponse {
   data: Comment[];
   total: number;
   limit: number;
   offset: number;
}

export interface CommentInputProps {
   value: string;
   onChange: (value: string) => void;
   onSubmit: () => void;
   isSending: boolean;
   placeholder: string;
   replyTarget?: ReplyTarget | null;
   onCancelReply?: () => void;
}

export interface EditingComment {
   id: string;
   content: string;
}

export interface CommentItemProps {
   comment: Comment;
   currentProfileId: string | null;
   baseUrl: string;
   onDelete: (commentId: string) => Promise<void>;
   onReply?: (commentId: string, profileName: string) => void;
   onEdit?: (commentId: string) => void;
   onSubmitEdit?: (commentId: string, newContent: string) => Promise<void>;
   onCancelEdit?: () => void;
   editingComment?: EditingComment | null;
   tDate: (key: string) => string;
   deleteText: string;
   editText?: string;
   replyText?: string;
   saveText?: string;
   cancelText?: string;
   isReply?: boolean;
}

export interface CommentListProps {
   comments: Comment[];
   currentProfileId: string | null;
   baseUrl: string;
   hasMore: boolean;
   isLoadingMore: boolean;
   onLoadMore: () => void;
   onDelete: (commentId: string) => Promise<void>;
   onReply?: (commentId: string, profileName: string) => void;
   onEdit?: (commentId: string) => void;
   onSubmitEdit?: (commentId: string, newContent: string) => Promise<void>;
   onCancelEdit?: () => void;
   editingComment?: EditingComment | null;
   tDate: (key: string) => string;
   emptyText: string;
   loadMoreText: string;
   deleteText: string;
   editText?: string;
   replyText?: string;
   saveText?: string;
   cancelText?: string;
}

export interface PostContentProps {
   post: Post;
   baseUrl: string;
   likesCount: number;
   isLiked: boolean;
   commentsCount: number;
   onLikeToggle: () => void;
   onShare: () => void;
   tDate: (key: string) => string;
}

export interface PostDetailHeaderProps {
   title: string;
}

export interface UseCommentsProps {
   postId: string;
   initialComments: Comment[];
   initialTotal?: number;
   currentProfileId: string | null;
   t: (key: string) => string;
}

export interface PostDetailScreenProps {
   post: Post;
   initialComments: Comment[];
   currentProfileId: string | null;
}