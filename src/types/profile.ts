export interface Profile {
  id: string;
  userId: string;
  name: string;
  username?: string;
  bio: string;
  location: string;
  website: string;
  gender?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileDto {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  gender?: string;
}

export interface FollowCount {
  followers: number;
  following: number;
}

export interface FollowAction {
  type: "follow" | "unfollow";
  followerId: string;
  followingId: string;
}

export interface Post {
  id: string;
  profileId: string;
  content: string;
  image?: string;
  isEvent?: boolean;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt?: string;
  profile?: Profile;
}

export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: {
    id: string;
    username: string;
    profile?: Profile;
  };
  following?: {
    id: string;
    username: string;
    profile?: Profile;
  };
}

export interface UserSuggestion {
  id: string;
  username: string;
  email?: string;
  profile?: Profile;
}

export interface PostContent {
  content: string;
  mediaIds: string[];
}

export interface EventData {
  isEvent: boolean;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  isOnlineEvent: boolean;
}

export interface InitialUser {
  id: string;
  username: string;
  createdAt: string;
}

export interface ProfileScreenProps {
  initialProfile: Profile;
  initialUser: InitialUser;
  initialFollowCount: FollowCount;
  initialPosts?: Post[];
  initialTotalPosts?: number;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  isFollowingMe?: boolean;
  currentUserId?: string | null;
  currentProfileId?: string | null;
}

export interface PostCreationFormProps {
  profileData: Profile;
  initialUser: { username: string };
  postContent: PostContent;
  setPostContent: (content: PostContent) => void;
  isEventPost: boolean;
  onToggleEvent: () => void;
  eventDate: string;
  setEventDate: (date: string) => void;
  eventTime: string;
  setEventTime: (time: string) => void;
  eventLocation: string;
  setEventLocation: (location: string) => void;
  isOnlineEvent: boolean;
  setIsOnlineEvent: (online: boolean) => void;
  isPosting: boolean;
  onCreatePost: () => void;
  tHome: (key: string) => string | undefined;
}

export interface ProfileAboutProps {
  profileData: Profile;
  initialUser: InitialUser;
  tDate: (key: string) => string | undefined;
  t: (key: string) => string | undefined;
}

export interface ProfilePostsProps {
  posts: Post[];
  profileData: Profile;
  initialUser: InitialUser;
  currentProfileId: string | null | undefined;
  formatPostTime: (createdAt: string) => string;
  onLikeChange: (postId: string, newLikeCount: number, isLiked: boolean) => void;
  isOwnProfile: boolean;
  t: (key: string) => string | undefined;
}

export interface ProfileStatsProps {
  postsCount: number;
  followCount: FollowCount;
  userId: string;
  t: (key: string) => string | undefined;
}

export interface ProfileTabsSectionProps {
  isOwnProfile: boolean;
  profileData: Profile;
  initialUser: InitialUser;
  posts: Post[];
  postContent: PostContent;
  setPostContent: (content: PostContent) => void;
  isEventPost: boolean;
  onToggleEvent: () => void;
  eventDate: string;
  setEventDate: (date: string) => void;
  eventTime: string;
  setEventTime: (time: string) => void;
  eventLocation: string;
  setEventLocation: (location: string) => void;
  isOnlineEvent: boolean;
  setIsOnlineEvent: (online: boolean) => void;
  isPosting: boolean;
  onCreatePost: () => void;
  currentProfileId: string | null | undefined;
  totalPosts?: number;
  formatPostTime: (createdAt: string) => string;
  onLikeChange: (postId: string, newLikeCount: number, isLiked: boolean) => void;
  tHome: (key: string) => string | undefined;
  tDate: (key: string) => string | undefined;
  t: (key: string) => string | undefined;
}

export interface ProfileHeaderProps {
  isOwnProfile: boolean;
  profileData: Profile;
  initialUser: InitialUser;
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