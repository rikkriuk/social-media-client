'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslationCustom } from '@/i18n/client';
import useLanguage from '@/zustand/useLanguage';
import { useState } from 'react';

export default function ForgotPage() {
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, 'forgot');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/auth/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'forgot', email }),
      });
      const data = await res.json();
      setMsg(data.message || 'OK');
    } catch (err) {
      setMsg('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-3xl">S</span>
          </div>
          <h1 className="text-gray-900 dark:text-white text-3xl mb-2">{t('resetPassword')}</h1>
          <p 
            className="text-gray-500 text-center"
          >
              {t('enterEmail')}
          </p>
        </div>

        <div 
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8"
        >
          <form 
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <div>
              <Label 
                htmlFor="email"
              >
                {t('email')}
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder={t('emailPlaceholder')} 
                className="mt-1 rounded-xl" 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={loading}
            >
              {loading ? '...' : t('sendOtp')}
            </Button>

            {msg && <p className="text-sm text-green-600 mt-2">{msg}</p>}
          </form>

          <p className="text-center mt-4">
            <button 
              onClick={() => window.history.back()} 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('backToLogin')}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
