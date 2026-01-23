import { useRouter } from "next/navigation";
import type { FollowCount } from "@/types/profile";

interface ProfileStatsProps {
   postsCount: number;
   followCount: FollowCount;
   userId: string;
   t: (key: string) => string | undefined;
}

export const ProfileStats = ({
   postsCount,
   followCount,
   userId,
   t,
}: ProfileStatsProps) => {
   const router = useRouter();

   return (
      <div className="grid grid-cols-3 gap-4 mb-6 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
         <div className="text-center">
            <div className="text-gray-900 dark:text-white text-2xl mb-1">{postsCount}</div>
            <div className="text-gray-500 text-sm">{t("posts")}</div>
         </div>
         <div
            className="text-center border-x border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors py-2 -my-2"
            onClick={() => router.push(`/friends?tab=followers&userId=${userId}`)}
         >
            <div className="text-gray-900 dark:text-white text-2xl mb-1">{followCount.followers}</div>
            <div className="text-gray-500 text-sm">{t("followers")}</div>
         </div>
         <div
            className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors py-2 -my-2"
            onClick={() => router.push(`/friends?tab=following&userId=${userId}`)}
         >
            <div className="text-gray-900 dark:text-white text-2xl mb-1">{followCount.following}</div>
            <div className="text-gray-500 text-sm">{t("following")}</div>
         </div>
      </div>
   );
};
