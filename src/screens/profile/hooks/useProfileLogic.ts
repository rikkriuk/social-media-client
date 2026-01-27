import { useState, useCallback } from "react";
import { webRequest } from "@/helpers/api";
import { toast } from "sonner";
import Cookie from "js-cookie";
import type { Profile, FollowCount, InitialUser } from "@/types/profile";

export const useProfileLogic = (
   initialProfile: Profile,
   initialUser: InitialUser,
   initialFollowCount: FollowCount,
   initialIsFollowing: boolean,
   isOwnProfile: boolean,
   currentUserId: string | null,
   t: (key: string) => string | undefined
) => {
   const [profileData, setProfileData] = useState<Profile>(initialProfile);
   const [editFormData, setEditFormData] = useState<Profile>(initialProfile);
   const [followCount, setFollowCount] = useState<FollowCount>(initialFollowCount);
   const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
   const [isFollowLoading, setIsFollowLoading] = useState(false);
   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
   const [isSaving, setIsSaving] = useState(false);

   const handleSaveProfile = useCallback(
      async (formData: Profile) => {
         setIsSaving(true);
         try {
            const response = await webRequest.patch("/profile/update", {
               profileId: profileData.id,
               name: formData.name,
               bio: formData.bio,
               location: formData.location,
               website: formData.website,
            });

            if (response.data.ok) {
               const updatedProfile = {
                  ...profileData,
                  name: formData.name,
                  bio: formData.bio,
                  location: formData.location,
                  website: formData.website,
               };

               setProfileData(updatedProfile);
               Cookie.set("profile", JSON.stringify(updatedProfile), { expires: 1 });
               toast.success(t("profileUpdated"));
               setIsEditDialogOpen(false);
               return true;
            } else {
               toast.error(response.data.message || t("profileUpdateFailed"));
               return false;
            }
         } catch (error: any) {
            console.error("Save profile error:", error);
            toast.error(error?.data?.message || t("profileUpdateFailed"));
            return false;
         } finally {
            setIsSaving(false);
         }
      },
      [profileData, t]
   );

   const handleFollowToggle = useCallback(async () => {
      if (!currentUserId) {
         toast.error(t("loginRequired"));
         return;
      }

      setIsFollowLoading(true);
      try {
         const response = await webRequest.post("/follow", {
            type: isFollowing ? "unfollow" : "follow",
            followerId: currentUserId,
            followingId: initialUser.id,
         });

         if (response.data.ok) {
            setIsFollowing(!isFollowing);
            setFollowCount((prev) => ({
               ...prev,
               followers: isFollowing ? prev.followers - 1 : prev.followers + 1,
            }));
            toast.success(isFollowing ? t("unfollowed") : t("followed"));
         } else {
            toast.error(response.data.message || t("followFailed"));
         }
      } catch (error: any) {
         console.error("Follow toggle error:", error);
         toast.error(error?.data?.message || t("followFailed"));
      } finally {
         setIsFollowLoading(false);
      }
   }, [isFollowing, currentUserId, initialUser.id, t]);

   const handleOpenEditDialog = useCallback(() => {
      setEditFormData({ ...profileData });
      setIsEditDialogOpen(true);
   }, [profileData]);

   const handleConfirmDelete = useCallback(
      async (selectedPostId: string) => {
         try {
            const response = await fetch(`/api/post/${selectedPostId}`, {
               method: "DELETE",
               credentials: "include",
            });

            if (response.ok) {
               toast.success(t("postDeleted") || "Postingan berhasil dihapus");
               return { success: true };
            } else {
               const errorData = await response.json();
               toast.error(errorData.message || t("deleteFailed"));
               return { success: false };
            }
         } catch (error: any) {
            console.error("Delete error:", error);
            toast.error(t("deleteFailed") || "Gagal menghapus postingan");
            return { success: false };
         }
      },
      [t]
   );

   return {
      profileData,
      setProfileData,
      editFormData,
      setEditFormData,
      followCount,
      isFollowing,
      isFollowLoading,
      isEditDialogOpen,
      setIsEditDialogOpen,
      isSaving,
      handleSaveProfile,
      handleFollowToggle,
      handleOpenEditDialog,
      handleConfirmDelete,
   };
};
