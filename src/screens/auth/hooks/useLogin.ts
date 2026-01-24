import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/api";
import useAuth from "@/zustand/useAuth";
import { UseLoginProps } from "@/types/auth";

export const useLogin = ({ tFunc }: UseLoginProps) => {
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const { doLogin } = useAuth();

   const handleSubmit = async (data: Record<string, string>) => {
      setLoading(true);

      try {
         const { email, password } = data;
         const body: any = {
            identifierType: "Email",
            identifier: email,
            password,
         };

         await doLogin(body, tFunc);

         toast.success(tFunc("login.successLogin"));
         window.location.href = "/";
      } catch (err: unknown) {
         const error = err as ApiError;

         toast.error(error.data?.message || tFunc("invalidCode"));
         console.error("Login error:", err);
      } finally {
         setLoading(false);
      }
   };

   return {
      loading,
      handleSubmit,
   };
};
