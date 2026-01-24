"use client";

import useLanguage from "@/zustand/useLanguage";
import { useTranslationCustom } from "@/i18n/client";

import { useLogin } from "./hooks/useLogin";
import { LoginForm } from "./components/LoginForm";

export default function LoginScreen() {
   const { lng } = useLanguage();
   const { t } = useTranslationCustom(lng, "auth");

   const { loading, handleSubmit } = useLogin({
      tFunc: t,
   });

   return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
         <LoginForm
         loading={loading}
         onSubmit={handleSubmit}
         tFunc={t}
         />
      </section>
   );
}
