'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';
import { webRequest } from '@/helpers/api';
import Toast from '@/components/ui/toast';
import useLanguage from '@/zustand/useLanguage';
import { useTranslationCustom } from '@/i18n/client';
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, "auth");

  const router = useRouter()

  const handleSubmit = async (data: Record<string, string>) => {
    setLoading(true);

    try {
      const response = await webRequest.post('/auth/submit', {
        type: 'register',
        username: data.username,
        email: data.email,
        password: data.password
      });

      setIsSuccess(true);
      setToLocalStorage(response.data)

      router.push('/otp');
    } catch (err) {
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setToLocalStorage = (data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Auth
        isRegister={true}
        loading={loading}
        onSubmit={handleSubmit}
        t={t}
      />

      {isSuccess && (
        <Toast 
          status="success"
          message={t("register.successRegister")}
          duration={3000}
        />
      )}
    </section>
  )
}

export default RegisterPage;