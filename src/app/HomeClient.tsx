"use client";

import HomeScreen from "@/screens/home/HomeScreen";
import type { Post, Profile } from "@/types/profile";

interface HomeClientProps {
  initialPosts: Post[];
  currentProfile: Profile | null;
  onViewPostDetail?: (post: any) => void;
}

const HomeClient = ({
   initialPosts,
   currentProfile,
   onViewPostDetail,
}: HomeClientProps) => {
   return (
      <HomeScreen
         initialPosts={initialPosts}
         currentProfile={currentProfile}
         onViewPostDetail={onViewPostDetail}
      />
   );
};

export default HomeClient;
