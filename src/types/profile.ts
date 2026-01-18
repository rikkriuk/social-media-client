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
  createdAt: string;
  updatedAt?: string;
  profile?: Profile;
}
