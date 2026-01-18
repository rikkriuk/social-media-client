import { webRequest } from "@/helpers/api"
import { toast } from "sonner";
import Cookie from "js-cookie";
import { Profile, UpdateProfileDto } from "@/types/profile";

const useAuth = () => {
   const currentUser = JSON.parse(Cookie.get("user") || "null");
   const currentProfile: Profile | null = JSON.parse(Cookie.get("profile") || "null");
   const token = Cookie.get("token");

   const doLogin = async (body: any, t: any) => {
      const response = await webRequest.post("/auth/submit", {
        type: "login",
        ...body
      });

      if (response.data.requiresVerification) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("otp", response.data.otp);

        toast.info(t("login.requiresVerification"));
        window.location.href = "/login";
        return;
      }


      ["user", "profile", "token"].forEach((key: string) => {
         Cookie.set(key, JSON.stringify(response.data[key]), { expires: 1 });
      })
   }

   const doLogout = () => {
      try {
         webRequest.post("/api/auth/submit", { type: "logout" });
         ["token", "user", "profile", "userId"].forEach((key) => {
            localStorage.removeItem(key);
            Cookie.remove(key);
         });
         window.location.href = "/login";
      } catch (error) {
         console.error("Logout error:", error);
      }
   }

   const updateProfile = async (profileId: string, data: UpdateProfileDto) => {
      const response = await webRequest.patch("/api/profile/update", {
         profileId,
         ...data
      });

      if (response.data.ok) {
         const updatedProfile = {
            ...currentProfile,
            ...data
         };
         Cookie.set("profile", JSON.stringify(updatedProfile), { expires: 1 });
         return { ok: true, data: updatedProfile };
      }

      return { ok: false, message: response.data.message };
   }

   return {
      currentUser,
      currentProfile,
      token,
      doLogin,
      doLogout,
      updateProfile,
   };
}

export default useAuth;