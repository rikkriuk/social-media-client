import { webRequest } from "@/helpers/api"
import { toast } from "sonner";
import Cookie from "js-cookie";

const useAuth = () => {
   const currentUser = JSON.parse(Cookie.get("user") || "null");
   const currentProfile = JSON.parse(Cookie.get("profile") || "null");
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
         });
         window.location.href = "/login";
      } catch (error) {
         console.error("Logout error:", error);
      }
   }
   
   return { 
      currentUser,
      currentProfile,
      token,
      doLogin, 
      doLogout 
   };
}

export default useAuth;