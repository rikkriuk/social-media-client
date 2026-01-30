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
}

export interface CommentListResponse {
   data: Comment[];
   total: number;
   limit: number;
   offset: number;
}
