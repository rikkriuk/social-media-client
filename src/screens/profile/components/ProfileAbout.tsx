import { MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { formatDateWithMonth } from "@/helpers/date";
import type { ProfileAboutProps } from "@/types/profile";

export const ProfileAbout = ({
   profileData,
   initialUser,
   tDate,
   t,
}: ProfileAboutProps) => {
   return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
         <h3 className="text-gray-900 dark:text-white mb-4">{t("about")}</h3>
         <p className="text-gray-600 dark:text-gray-400 mb-4">
            {profileData.bio || "-"}
         </p>
         <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
               <MapPin className="w-4 h-4" />
               {t("livesIn")} {profileData.location || "-"}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
               <LinkIcon className="w-4 h-4" />
               {profileData.website || "-"}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
               <Calendar className="w-4 h-4" />
               {t("joined")} {formatDateWithMonth(initialUser?.createdAt || "", tDate)}
            </div>
         </div>
      </div>
   );
};
