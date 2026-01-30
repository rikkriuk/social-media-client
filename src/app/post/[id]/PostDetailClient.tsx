"use client";

import PostDetailScreen from "@/screens/post/PostDetailScreen";
import type { Post } from "@/types/profile";
import type { Comment } from "@/types/comment";

interface PostDetailClientProps {
   post: Post;
   comments: Comment[];
   currentProfileId: string | null;
}

export default function PostDetailClient({
   post,
   comments,
   currentProfileId,
}: PostDetailClientProps) {
   return (
      <PostDetailScreen
         post={post}
         initialComments={comments}
         currentProfileId={currentProfileId}
      />
   );
}
