"use client";

import { useState, useEffect } from "react";
import { Camera, MapPin, Link as LinkIcon, Calendar, Edit, UserPlus, UserMinus, ImagePlus, Video, Smile, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostCard } from "../../components/PostCard";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import { formatDateWithMonth } from "@/helpers/date";
import { webRequest } from "@/helpers/api";
import Cookie from "js-cookie";
import { Profile, FollowCount, Post } from "@/types/profile";
import { formatRelativeTime } from "@/helpers/date";

interface ProfileClientProps {
  initialProfile: Profile;
  initialUser: {
    id: string;
    username: string;
    createdAt: string;
  };
  initialFollowCount: FollowCount;
  initialPosts?: Post[];
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  isFollowingMe?: boolean;
  currentUserId?: string | null;
  currentProfileId?: string | null;
}

const ProfileClient = ({
  initialProfile,
  initialUser,
  initialFollowCount,
  initialPosts = [],
  isOwnProfile = true,
  isFollowing: initialIsFollowing = false,
  isFollowingMe = false,
  currentUserId = null,
  currentProfileId = null
}: ProfileClientProps) => {
  const router = useProgressRouter();
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, "profile");
  const { t: tHome } = useTranslationCustom(lng, "home");
  const { t: tDate } = useTranslationCustom(lng, "date");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<Profile>(initialProfile);
  const [editFormData, setEditFormData] = useState<Profile>(initialProfile);
  const [followCount, setFollowCount] = useState<FollowCount>(initialFollowCount);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [postContent, setPostContent] = useState({ content: "", mediaIds: [] as string[] });
  const [isEventPost, setIsEventPost] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [isOnlineEvent, setIsOnlineEvent] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleLikeChange = (postId: string, newLikeCount: number, isLiked: boolean) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likesCount: newLikeCount, isLiked }
          : post
      )
    );
  };

  const handleToggleEvent = () => {
    setIsEventPost(!isEventPost);
    if (isEventPost) {
      setEventDate("");
      setEventTime("");
      setEventLocation("");
      setIsOnlineEvent(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.content.trim()) return;

    setIsPosting(true);
    try {
      const postData: any = {
        content: postContent.content,
        mediaIds: postContent.mediaIds,
      };

      if (isEventPost) {
        postData.isEvent = true;
        postData.eventDate = eventDate;
        postData.eventTime = eventTime;
        postData.eventLocation = isOnlineEvent ? "Online" : eventLocation;
      }

      const response = await webRequest.post("/post", postData);

      if (response.data.ok) {
        const newPost = response.data.data;
        setPosts([newPost, ...posts]);

        // Reset form
        setPostContent({ content: "", mediaIds: [] });
        setIsEventPost(false);
        setEventDate("");
        setEventTime("");
        setEventLocation("");
        setIsOnlineEvent(false);

        toast.success(t("postCreated"));
      }
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error(t("postCreateFailed"));
    } finally {
      setIsPosting(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await webRequest.patch("/profile/update", {
        profileId: profileData.id,
        name: editFormData.name,
        bio: editFormData.bio,
        location: editFormData.location,
        website: editFormData.website,
      });

      if (response.data.ok) {
        const updatedProfile = {
          ...profileData,
          name: editFormData.name,
          bio: editFormData.bio,
          location: editFormData.location,
          website: editFormData.website,
        };

        setProfileData(updatedProfile);

        Cookie.set("profile", JSON.stringify(updatedProfile), { expires: 1 });

        toast.success(t("profileUpdated"));
        setIsEditDialogOpen(false);
      } else {
        toast.error(response.data.message || t("profileUpdateFailed"));
      }
    } catch (error: any) {
      console.error("Save profile error:", error);
      toast.error(error?.data?.message || t("profileUpdateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEditDialog = () => {
    setEditFormData({ ...profileData });
    setIsEditDialogOpen(true);
  };

  const handleCoverPhotoClick = () => {
    toast.info(t("coverPhotoUpload"), {
      description: t("coverPhotoUploadDesc"),
    });
  };

  const handleAvatarClick = () => {
    toast.info(t("avatarUpload"), {
      description: t("avatarUploadDesc"),
    });
  };

  const handleFollowToggle = async () => {
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
        setFollowCount(prev => ({
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
  };

  const formatPostTime = (createdAt: string) => {
    return formatRelativeTime(createdAt, tDate);
  };

  const getInitialAvatarFallback = () => {
    const initial = profileData?.name
      ? profileData.name.charAt(0).toUpperCase()
      : initialUser?.username.charAt(0).toUpperCase();

    return initial;
  };

  return (
    <div className="max-w-4xl flex-1 mx-auto pb-20 md:pb-6">
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
                  onClick={handleOpenEditDialog}
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
                  onClick={handleSaveProfile}
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
              onClick={handleFollowToggle}
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <div className="text-gray-900 dark:text-white text-2xl mb-1">{posts.length}</div>
            <div className="text-gray-500 text-sm">{t("posts")}</div>
          </div>
          <div
            className="text-center border-x border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors py-2 -my-2"
            onClick={() => router.push(`/friends?tab=followers&userId=${initialUser.id}`)}
          >
            <div className="text-gray-900 dark:text-white text-2xl mb-1">{followCount.followers}</div>
            <div className="text-gray-500 text-sm">{t("followers")}</div>
          </div>
          <div
            className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors py-2 -my-2"
            onClick={() => router.push(`/friends?tab=following&userId=${initialUser.id}`)}
          >
            <div className="text-gray-900 dark:text-white text-2xl mb-1">{followCount.following}</div>
            <div className="text-gray-500 text-sm">{t("following")}</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6">
            <TabsTrigger value="posts" className="rounded-xl">
              {t("posts")}
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-xl">
              {t("media")}
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-xl">
              {t("about")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {isOwnProfile && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitialAvatarFallback()}</AvatarFallback>
                  </Avatar>
                  <Textarea
                    placeholder={tHome("whatsOnYourMind")}
                    value={postContent.content}
                    onChange={(e) => setPostContent({ ...postContent, content: e.target.value })}
                    className="flex-1 resize-none border-0 focus-visible:ring-0 bg-gray-100 dark:bg-gray-800 rounded-xl"
                    rows={2}
                  />
                </div>

                {isEventPost && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {tHome("eventDetails")}
                      </span>
                      <button
                        onClick={handleToggleEvent}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{tHome("date")}</label>
                          <Input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{tHome("time")}</label>
                          <Input
                            type="time"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            className="rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">{tHome("location")}</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder={tHome("enterLocation")}
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            disabled={isOnlineEvent}
                            className="rounded-lg text-sm flex-1"
                          />
                          <Button
                            type="button"
                            variant={isOnlineEvent ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsOnlineEvent(!isOnlineEvent)}
                            className="rounded-lg whitespace-nowrap"
                          >
                            {tHome("online")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                      <ImagePlus className="w-5 h-5 text-green-500" />
                      <span className="hidden sm:inline">{tHome("photo")}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                      <Video className="w-5 h-5 text-red-500" />
                      <span className="hidden sm:inline">{tHome("video")}</span>
                    </Button>
                    <Button
                      variant={isEventPost ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 rounded-xl ${isEventPost ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400"}`}
                      onClick={handleToggleEvent}
                    >
                      <Calendar className={`w-5 h-5 ${isEventPost ? "text-white" : "text-blue-500"}`} />
                      <span className="hidden sm:inline">{tHome("event")}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-gray-600 dark:text-gray-400">
                      <Smile className="w-5 h-5 text-yellow-500" />
                      <span className="hidden sm:inline">{tHome("feeling")}</span>
                    </Button>
                  </div>
                  <Button
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleCreatePost}
                    disabled={!postContent.content.trim() || isPosting}
                  >
                    {isPosting ? tHome("posting") : tHome("post")}
                  </Button>
                </div>
              </div>
            )}

            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  postId={post.id}
                  profileId={currentProfileId || undefined}
                  author={{
                    name: profileData.name || initialUser.username,
                    avatar: undefined,
                    time: formatPostTime(post.createdAt),
                  }}
                  content={post.content}
                  image={post.image}
                  likes={post.likesCount}
                  comments={post.commentsCount}
                  shares={post.sharesCount}
                  initialIsLiked={post.isLiked}
                  onLikeChange={handleLikeChange}
                />
              ))
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                <p className="text-gray-500">{t("noPostsYet")}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="media">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500">{t("noMediaYet")}</p>
            </div>
          </TabsContent>

          <TabsContent value="about">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileClient;
