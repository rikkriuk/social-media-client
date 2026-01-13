'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';
import { useTranslationCustom } from '@/i18n/client';
import useLanguage from '@/zustand/useLanguage';
import { initialAuth } from '@/types/auth';
import { webRequest } from '@/helpers/api';

export default function LoginPage() {
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, "auth");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Record<string, string>) => {
    setLoading(true);

    try {
      const { email, password } = data;
      const body: any = { 
        identifierType: "Email",
        identifier: email,
        password
      };

      const response = webRequest.post("/auth/submit", {
        type: "login",
        ...body
      })

    } catch (err) {
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
