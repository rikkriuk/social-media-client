'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';
import { useTranslationCustom } from '@/i18n/client';
import useLanguage from '@/zustand/useLanguage';
import { webRequest } from '@/helpers/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/types/api';

export default function LoginPage() {
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, "auth");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: Record<string, string>) => {
    setLoading(true);

    try {
      const { email, password } = data;
      const body: any = { 
        identifierType: "Email",
        identifier: email,
        password
      };

      const response = await webRequest.post("/auth/submit", {
        type: "login",
        ...body
      });

      if (response.data.requiresVerification) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("otp", response.data.otp);

        toast.info(t("login.requiresVerification"));
        router.push("/otp");
        return;
      }

      localStorage.setItem("token", response.data.token);

      toast.success(t("login.successLogin"));
      router.push("/");
    } catch (err: unknown) {
      const error = err as ApiError;

      toast.error(error.data?.message || t("invalidCode"));
      console.error("OTP verify error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Auth
        isRegister={false}
        loading={loading}
        onSubmit={handleSubmit}
        t={t}
      />
    </section>
  );
}
