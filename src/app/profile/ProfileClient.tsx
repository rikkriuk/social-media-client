"use client";

import ProfileScreen from "@/screens/profile/ProfileScreen";
import type { Profile, FollowCount, Post, InitialUser, ProfileScreenProps } from "@/types/profile";

interface ProfileClientProps {
  initialProfile: Profile;
  initialUser: InitialUser;
  initialFollowCount: FollowCount;
  initialPosts?: Post[];
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  isFollowingMe?: boolean;
  currentUserId?: string | null;
  currentProfileId?: string | null;
}

export default function ProfileClient({
  initialProfile,
  initialUser,
  initialFollowCount,
  initialPosts = [],
  isOwnProfile = true,
  isFollowing: initialIsFollowing = false,
  isFollowingMe = false,
  currentUserId = null,
  currentProfileId = null,
}: ProfileClientProps) {
  return (
    <ProfileScreen
      initialProfile={initialProfile}
      initialUser={initialUser}
      initialFollowCount={initialFollowCount}
      initialPosts={initialPosts}
      isOwnProfile={isOwnProfile}
      isFollowing={initialIsFollowing}
      isFollowingMe={isFollowingMe}
      currentUserId={currentUserId}
      currentProfileId={currentProfileId}
    />
  );
}
