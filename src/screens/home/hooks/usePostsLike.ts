import { useState } from "react";
import { Post } from "@/types/profile";

export const usePostsLike = (initialPosts: Post[]) => {
   const [posts, setPosts] = useState<Post[]>(initialPosts);

   const handleLikeChange = (postId: string, newLikeCount: number, isLiked: boolean) => {
      setPosts((prevPosts) =>
         prevPosts.map((post) =>
         post.id === postId
            ? { ...post, likesCount: newLikeCount, isLiked }
            : post
         )
      );
   };

   return {
      posts,
      setPosts,
      handleLikeChange,
   };
};
