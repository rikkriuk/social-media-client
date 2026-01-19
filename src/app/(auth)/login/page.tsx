'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';
import { useTranslationCustom } from '@/i18n/client';
import useLanguage from '@/zustand/useLanguage';
import { webRequest } from '@/helpers/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/types/api';
import useAuth from '@/zustand/useAuth';

export default function LoginPage() {
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, "auth");
  const { doLogin } = useAuth();

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

      await doLogin(body, t);

      toast.success(t("login.successLogin"));
      window.location.href = "/";
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
