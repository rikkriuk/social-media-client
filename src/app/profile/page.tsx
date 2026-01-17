"use client";

import { useState } from "react";
import { Camera, MapPin, Link as LinkIcon, Calendar, Edit } from "lucide-react";
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

const ProfilePage = () => {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "profile");
   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
   const [profileData, setProfileData] = useState({
      name: "Your Name",
      username: "@username",
      bio: "Digital creator and technology enthusiast. Love to share my journey and connect with amazing people around the world.",
      location: "Bandung, Indonesia",
      website: "yourwebsite.com",
   });

   const handleSaveProfile = () => {
      toast.success(t("profileUpdated"));
      setIsEditDialogOpen(false);
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

   const userPosts = [
      {
         author: {
            name: "You",
            avatar: undefined,
            time: "3 " + t("hoursAgo"),
         },
         content: "Working on some exciting new features! Stay tuned for updates.",
         image: undefined,
         likes: 45,
         comments: 7,
         shares: 2,
      },
   ];

   return (
      <div className="max-w-4xl flex-1 mx-auto pb-20 md:pb-6">
         {/* Cover Photo */}
         <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-b-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <Button
               variant="secondary"
               size="sm"
               className="absolute bottom-4 right-4 gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
               onClick={handleCoverPhotoClick}
            >
               <Camera className="w-4 h-4" />
               {t("editCover")}
            </Button>
         </div>

         {/* Profile Info */}
         <div className="px-4 md:px-8 -mt-20 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-6">
               <div className="relative group">
                  <Avatar className="w-40 h-40 border-4 border-white dark:border-gray-900">
                     <AvatarFallback className="text-4xl">Y</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <Button
                     size="icon"
                     className="absolute bottom-2 right-2 rounded-full w-10 h-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg"
                     onClick={handleAvatarClick}
                  >
                     <Camera className="w-5 h-5" />
                  </Button>
               </div>

               <div className="flex-1 text-center md:text-left">
                  <h1 className="text-gray-900 dark:text-white text-2xl">{profileData.name}</h1>
                  <p className="text-gray-500 mb-3">{profileData.username}</p>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-600 dark:text-gray-400 text-sm">
                     <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profileData.location}
                     </div>
                     <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        {profileData.website}
                     </div>
                     <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {t("joined")} March 2024
                     </div>
                  </div>
               </div>

               <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                     <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
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
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="rounded-xl"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="username">{t("username")}</Label>
                        <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className="rounded-xl"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="bio">{t("bio")}</Label>
                        <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="rounded-xl min-h-[100px]"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="location">{t("location")}</Label>
                        <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="rounded-xl"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="website">{t("website")}</Label>
                        <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="rounded-xl"
                        />
                     </div>
                  </div>
                  <DialogFooter>
                     <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl">
                        {t("cancel")}
                     </Button>
                     <Button onClick={handleSaveProfile} className="rounded-xl bg-blue-600 hover:bg-blue-700">
                        {t("saveChanges")}
                     </Button>
                  </DialogFooter>
                  </DialogContent>
               </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="text-center">
                  <div className="text-gray-900 dark:text-white text-2xl mb-1">127</div>
                  <div className="text-gray-500 text-sm">{t("posts")}</div>
               </div>
               <div className="text-center border-x border-gray-200 dark:border-gray-700">
                  <div className="text-gray-900 dark:text-white text-2xl mb-1">2.5K</div>
                  <div className="text-gray-500 text-sm">{t("followers")}</div>
               </div>
               <div className="text-center">
                  <div className="text-gray-900 dark:text-white text-2xl mb-1">892</div>
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
                  {userPosts.map((post, index) => (
                  <PostCard key={index} {...post} />
                  ))}
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
                        {profileData.bio}
                     </p>
                     <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                           <MapPin className="w-4 h-4" />
                           {t("livesIn")} {profileData.location}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                           <LinkIcon className="w-4 h-4" />
                           {profileData.website}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                           <Calendar className="w-4 h-4" />
                           {t("joined")} March 2024
                        </div>
                     </div>
                  </div>
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
}

export default ProfilePage;