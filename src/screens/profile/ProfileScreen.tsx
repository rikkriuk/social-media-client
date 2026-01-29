"use client";

import { useEffect } from "react";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { formatRelativeTime } from "@/helpers/date";
import { useProfileLogic } from "./hooks/useProfileLogic";
import { usePostCreation } from "./hooks/usePostCreation";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileStats } from "./components/ProfileStats";
import { ProfileTabsSection } from "./components/ProfileTabsSection";
import type { ProfileScreenProps } from "@/types/profile";

export default function ProfileScreen({
   initialProfile,
   initialUser,
   initialFollowCount,
   initialPosts = [],
   initialTotalPosts,
   isOwnProfile = true,
   isFollowing: initialIsFollowing = false,
   isFollowingMe = false,
   currentUserId = null,
   currentProfileId = null,
}: ProfileScreenProps) {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "profile");
   const { t: tHome } = useTranslationCustom(lng, "home");
   const { t: tDate } = useTranslationCustom(lng, "date");

   const profileLogic = useProfileLogic(
      initialProfile,
      initialUser,
      initialFollowCount,
      initialIsFollowing,
      isOwnProfile,
      currentUserId,
      t
   );

   const postCreation = usePostCreation(initialPosts, t);

   useEffect(() => {
      postCreation.setPosts(initialPosts);
   }, [initialPosts]);

   const formatPostTime = (createdAt: string) => {
      return formatRelativeTime(createdAt, tDate);
   };

   return (
      <div className="max-w-4xl flex-1 mx-auto pb-20 md:pb-6">
         <ProfileHeader
            isOwnProfile={isOwnProfile}
            profileData={profileLogic.profileData}
            initialUser={initialUser}
            isEditDialogOpen={profileLogic.isEditDialogOpen}
            setIsEditDialogOpen={profileLogic.setIsEditDialogOpen}
            editFormData={profileLogic.editFormData}
            setEditFormData={profileLogic.setEditFormData}
            onEditOpen={profileLogic.handleOpenEditDialog}
            isSaving={profileLogic.isSaving}
            onSave={profileLogic.handleSaveProfile}
            isFollowing={profileLogic.isFollowing}
            isFollowLoading={profileLogic.isFollowLoading}
            onFollowToggle={profileLogic.handleFollowToggle}
            isFollowingMe={isFollowingMe}
            onProfileImageUpload={profileLogic.handleProfileImageUpload}
            isUploadingImage={profileLogic.isUploadingImage}
            onCoverImageUpload={profileLogic.handleCoverImageUpload}
            isUploadingCover={profileLogic.isUploadingCover}
            tDate={tDate}
            t={t}
         />

         <div className="px-4 md:px-8">
            <ProfileStats
               postsCount={initialTotalPosts || 0}
               followCount={profileLogic.followCount}
               userId={initialUser.id}
               t={t}
            />

            <ProfileTabsSection
               isOwnProfile={isOwnProfile}
               profileData={profileLogic.profileData}
               initialUser={initialUser}
               posts={postCreation.posts}
               postContent={postCreation.postContent}
               setPostContent={postCreation.setPostContent}
               isEventPost={postCreation.isEventPost}
               onToggleEvent={postCreation.handleToggleEvent}
               eventDate={postCreation.eventDate}
               setEventDate={postCreation.setEventDate}
               eventTime={postCreation.eventTime}
               setEventTime={postCreation.setEventTime}
               eventLocation={postCreation.eventLocation}
               setEventLocation={postCreation.setEventLocation}
               isOnlineEvent={postCreation.isOnlineEvent}
               setIsOnlineEvent={postCreation.setIsOnlineEvent}
               isPosting={postCreation.isPosting}
               onCreatePost={postCreation.handleCreatePost}
               currentProfileId={currentProfileId}
               totalPosts={initialTotalPosts}
               formatPostTime={formatPostTime}
               onLikeChange={postCreation.handleLikeChange}
               tHome={tHome}
               tDate={tDate}
               t={t}
               onPostDelete={profileLogic.handleConfirmDelete}
               editingPostId={postCreation.editingPostId}
               onEditPost={postCreation.handleEditPost}
               onCancelEdit={postCreation.handleCancelEdit}
               imagePreviews={postCreation.imagePreviews}
               onImageSelect={postCreation.handleImageSelect}
               onRemoveImage={postCreation.handleRemoveImage}
            />
         </div>
      </div>
   );
}
