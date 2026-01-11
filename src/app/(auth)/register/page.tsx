'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Auth 
        isRegister={true} 
        onLogin={onLogin} 
      />
    </section>
  )
}

export default LoginPage;