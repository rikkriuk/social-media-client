"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";
import WebSample from "@/components/ui/web-sample";

import { useOtpLogic } from "./hooks/useOtpLogic";
import { useOtpTimer } from "./hooks/useOtpTimer";
import { OtpForm } from "./components/OtpForm";
import { ResendSection } from "./components/ResendSection";

export default function OtpScreen() {
   const router = useRouter();
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "otp");

   const {
      loading,
      resending,
      data,
      setData,
      handleSubmit,
      handleResend,
      loadOtpData,
   } = useOtpLogic({
      onSuccess: () => {
         router.push("/login");
      },
      tFunc: t,
   });

   const { timeLeft, canResend, resetTimer } = useOtpTimer();

   useEffect(() => {
      loadOtpData();
   }, []);

   const handleCodeChange = (newCode: string) => {
      setData((prev) => ({
         ...prev,
         code: newCode,
      }));
   };

   const handleResendWithTimer = async () => {
      await handleResend();
      resetTimer();
   };

   return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
         <div className="w-full max-w-md">
         <WebSample title={t("verifyOtp")} description={t("enterOtp")} />

         <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            <OtpForm
               code={data.code}
               onChange={handleCodeChange}
               onSubmit={handleSubmit}
               loading={loading}
               tFunc={t}
            />

            <div className="mt-6">
               <ResendSection
                  canResend={canResend}
                  timeLeft={timeLeft}
                  resending={resending}
                  onResend={handleResendWithTimer}
                  tFunc={t}
               />
            </div>

            <p className="text-center mt-6">
               <button
                  onClick={() => router.back()}
                  className="text-blue-600 dark:text-blue-400 hover:underline transition-colors text-sm font-medium"
               >
               {t("backToLogin")}
               </button>
            </p>
         </div>
         </div>
      </section>
   );
}
