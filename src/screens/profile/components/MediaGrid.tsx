import type { Post } from "@/types/profile";

interface MediaGridProps {
   posts: Post[];
   t: (key: string) => string | undefined;
}

export const MediaGrid = ({ posts, t }: MediaGridProps) => {
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

   const allMedia: string[] = posts.flatMap((post) => {
      const mediaIds = Array.isArray(post.mediaIds) ? post.mediaIds : [];
      return mediaIds.map((filename) => `${baseUrl}/uploads/${filename}`);
   });

   if (allMedia.length === 0) {
      return (
         <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500">{t("noMediaYet")}</p>
         </div>
      );
   }

   return (
      <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
         {allMedia.map((url, index) => (
            <div key={index} className="aspect-square">
               <img
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
               />
            </div>
         ))}
      </div>
   );
};
