import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/types/api";
import { initialOtp } from "@/types/auth";
import { webRequest } from "@/helpers/api";

interface UseOtpLogicProps {
   onSuccess?: () => void;
   tFunc: (key: string, options?: any) => string;
}

export const useOtpLogic = ({ onSuccess, tFunc }: UseOtpLogicProps) => {
   const [loading, setLoading] = useState(false);
   const [resending, setResending] = useState(false);
   const [data, setData] = useState(initialOtp);

   const clearLocalStorage = () => {
      ["otp", "userId"].forEach((field) => {
         localStorage.removeItem(field);
      });
   };

   const loadOtpData = () => {
      const code = localStorage.getItem("otp") || "";
      const userId = localStorage.getItem("userId") || "";
      setData((prev) => ({
         ...prev,
         userId,
         code,
      }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         await webRequest.post("/auth/submit", {
            type: "otp",
            data,
         });

         toast.success(tFunc("otpVerified"));
         clearLocalStorage();

         if (onSuccess) {
            onSuccess();
         } else {
            window.location.href = "/login";
         }
      } catch (err: unknown) {
         const error = err as ApiError;
         toast.error(error.data?.message || tFunc("invalidCode"));
         console.error("OTP verify error:", err);
      } finally {
         setLoading(false);
      }
   };

   const handleResend = async () => {
      if (!data.userId) {
         toast.error(tFunc("invalidCode"));
         return;
      }

      setResending(true);
      try {
         const res = await webRequest.post("/auth/submit", {
            type: "resend",
            userId: data.userId,
         });
         const payload = res?.data;
         toast.success(tFunc("sentMessage"));

         if (payload?.otp) {
            const otpStr = String(payload.otp);
            localStorage.setItem("otp", otpStr);
            setData((prev) => ({ ...prev, code: otpStr }));
         }
      } catch (err: unknown) {
         const error = err as ApiError;
         toast.error(error?.data?.message || tFunc("invalidCode"));
         console.error("Resend OTP error:", err);
      } finally {
         setResending(false);
      }
   };

   return {
      loading,
      resending,
      data,
      setData,
      handleSubmit,
      handleResend,
      loadOtpData,
   };
};
