import { Camera, MapPin, Link as LinkIcon, Calendar, Edit, UserPlus, UserMinus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDateWithMonth } from "@/helpers/date";
import type { Profile } from "@/types/profile";

interface ProfileHeaderProps {
   isOwnProfile: boolean;
   profileData: Profile;
   initialUser: { id: string; username: string; createdAt: string };
   isEditDialogOpen: boolean;
   setIsEditDialogOpen: (open: boolean) => void;
   editFormData: Profile;
   setEditFormData: (data: Profile) => void;
   onEditOpen: () => void;
   isSaving: boolean;
   onSave: (data: Profile) => void;
   isFollowing: boolean;
   isFollowLoading: boolean;
   onFollowToggle: () => void;
   isFollowingMe: boolean;
   tDate: (key: string) => string | undefined;
   t: (key: string) => string | undefined;
}

export const ProfileHeader = ({
   isOwnProfile,
   profileData,
   initialUser,
   isEditDialogOpen,
   setIsEditDialogOpen,
   editFormData,
   setEditFormData,
   onEditOpen,
   isSaving,
   onSave,
   isFollowing,
   isFollowLoading,
   onFollowToggle,
   isFollowingMe,
   tDate,
   t,
}: ProfileHeaderProps) => {
   const getInitialAvatarFallback = () => {
      const initial = profileData?.name
         ? profileData.name.charAt(0).toUpperCase()
         : initialUser?.username.charAt(0).toUpperCase();
      return initial;
   };

   const handleCoverPhotoClick = () => {
      // Toast notification for cover photo upload
   };

   const handleAvatarClick = () => {
      // Toast notification for avatar upload
   };

   return (
      <>
         {/* Cover Photo */}
         <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-b-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {isOwnProfile && (
               <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4 gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  onClick={handleCoverPhotoClick}
               >
                  <Camera className="w-4 h-4" />
                  {t("editCover")}
               </Button>
            )}
         </div>

         {/* Profile Info */}
         <div className="px-4 md:px-8 -mt-20 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-6">
               <div className="relative group">
                  <Avatar className="w-40 h-40 border-4 border-white dark:border-gray-900">
                     <AvatarFallback className="text-4xl">
                        {getInitialAvatarFallback()}
                     </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                     <>
                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <Button
                           size="icon"
                           className="absolute bottom-2 right-2 rounded-full w-10 h-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg"
                           onClick={handleAvatarClick}
                        >
                           <Camera className="w-5 h-5" />
                        </Button>
                     </>
                  )}
               </div>

               <div className="flex-1 text-center md:text-left">
                  <h1 className="text-gray-900 dark:text-white text-2xl">{profileData.name || "-"}</h1>
                  <p className="text-gray-500 mb-3">@{initialUser.username}</p>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-600 dark:text-gray-400 text-sm">
                     <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profileData.location || "-"}
                     </div>
                     <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        {profileData.website || "-"}
                     </div>
                     <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {t("joined")} {formatDateWithMonth(initialUser?.createdAt || "", tDate)}
                     </div>
                  </div>
               </div>

               {isOwnProfile ? (
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                     <DialogTrigger asChild>
                        <Button
                           className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                           onClick={onEditOpen}
                        >
                           <Edit className="w-4 h-4 mr-2" />
                           {t("editProfile")}
                        </Button>
                     </DialogTrigger>

                     <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                           <DialogTitle>{t("editProfile")}</DialogTitle>
                           <DialogDescription>
                              {t("changeDescription")}
                           </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                           <div className="space-y-2">
                              <Label htmlFor="name">{t("fullName")}</Label>
                              <Input
                                 id="name"
                                 value={editFormData.name || ""}
                                 onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                 className="rounded-xl"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="username">{t("username")}</Label>
                              <Input
                                 id="username"
                                 value={initialUser.username}
                                 disabled
                                 className="rounded-xl"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="bio">{t("bio")}</Label>
                              <Textarea
                                 id="bio"
                                 value={editFormData.bio || ""}
                                 onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                                 className="rounded-xl min-h-[100px]"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="location">{t("location")}</Label>
                              <Input
                                 id="location"
                                 value={editFormData.location || ""}
                                 onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                 className="rounded-xl"
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="website">{t("website")}</Label>
                              <Input
                                 id="website"
                                 value={editFormData.website || ""}
                                 onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                                 className="rounded-xl"
                              />
                           </div>
                        </div>
                        <DialogFooter>
                           <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl">
                              {t("cancel")}
                           </Button>
                           <Button
                              onClick={() => onSave(editFormData)}
                              className="text-white rounded-xl bg-blue-600 hover:bg-blue-700"
                              disabled={isSaving}
                           >
                              {isSaving ? t("saving") : t("saveChanges")}
                           </Button>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               ) : (
                  <Button
                     className={`rounded-xl ${
                        isFollowing
                           ? "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                           : "bg-blue-600 hover:bg-blue-700 text-white"
                     }`}
                     onClick={onFollowToggle}
                     disabled={isFollowLoading}
                  >
                     {isFollowing ? (
                        <>
                           <UserMinus className="w-4 h-4 mr-2" />
                           {t("unfollow")}
                        </>
                     ) : (
                        <>
                           <UserPlus className="w-4 h-4 mr-2" />
                           {isFollowingMe ? t("followBack") : t("follow")}
                        </>
                     )}
                  </Button>
               )}
            </div>
         </div>
      </>
   );
};
