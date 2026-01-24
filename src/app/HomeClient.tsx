"use client";

import HomeScreen from "@/screens/home/HomeScreen";
import { HomeClientProps } from "@/types/home";

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
