"use client";

import PostDetailScreen from "@/screens/post/PostDetailScreen";
import type { Post } from "@/types/profile";

interface PostDetailClientProps {
   post: Post;
   comments: any[];
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
