'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslationCustom } from '@/i18n/client';
import useLanguage from '@/zustand/useLanguage';
import { useState } from 'react';
import OtpInputs from '@/components/OtpInputs';
import WebSample from '@/components/ui/web-sample';

export default function OtpPage() {
  const { lng } = useLanguage();
  const { t } = useTranslationCustom(lng, 'otp');
  const [code, setCode] = useState('');
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
        body: JSON.stringify({ type: 'otp', code }),
      });
      const data = await res.json();
      setMsg(data.message || 'OK');
    } catch (err) {
      setMsg(t('invalidCode'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <WebSample
          title={t("verifyOtp")}
          description={t("enterOtp")}
        />

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label 
                htmlFor="code">{t('enterOtp')}
              </Label>

              <div className="mt-2">
                <OtpInputs 
                  length={6} 
                  value={code} 
                  onChange={(v) => setCode(v)} 
                />
              </div>
            </div>

            <Button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white" disabled={loading || code.length !== 6}>
              {loading ? '...' : t('verifyButton')}
            </Button>

            {
              msg && 
                <p className="text-sm text-green-600 mt-2">{msg}</p>
            }
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
