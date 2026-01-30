import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostDetailHeaderProps } from "@/types/comment";

export const PostDetailHeader = ({ title }: PostDetailHeaderProps) => {
   const router = useRouter();

   return (
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
         <div className="flex items-center gap-3">
            <Button
               variant="ghost"
               size="icon"
               className="rounded-full"
               onClick={() => router.back()}
            >
               <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
               {title}
            </h1>
         </div>
      </div>
   );
};
