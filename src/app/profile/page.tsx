import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Profile } from "@/types/profile";

const ProfilePage = async () => {
   const cookieStore = await cookies();
   const profileCookie = cookieStore.get("profile");

   if (!profileCookie) {
      redirect("/login");
   }

   let currentProfile: Profile;

   try {
      currentProfile = JSON.parse(profileCookie.value);
   } catch (error) {
      console.error("Failed to parse profile cookie:", error);
      redirect("/login");
   }

   redirect(`/profile/${currentProfile.id}`);
};

export default ProfilePage;
