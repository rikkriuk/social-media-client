import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/api";
import { webRequest } from "@/helpers/api";
import { UseRegisterProps } from "@/types/auth";

export const useRegister = ({ tFunc }: UseRegisterProps) => {
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const setToLocalStorage = (data: Record<string, any>) => {
      console.log(data);
      Object.entries(data).forEach(([key, value]) => {
         localStorage.setItem(key, value);
      });
   };

   const handleSubmit = async (data: Record<string, string>) => {
      setLoading(true);

      try {
         const response = await webRequest.post("/auth/submit", {
            type: "register",
            username: data.username,
            email: data.email,
            password: data.password,
         });

         setToLocalStorage(response.data);

         toast.success(tFunc("register.successRegister"));
         router.push("/otp");
      } catch (err: unknown) {
         const error = err as ApiError;

         toast.error(error.data?.message);
         console.error("Register error:", err);
      } finally {
         setLoading(false);
      }
   };

   return {
      loading,
      handleSubmit,
   };
};
