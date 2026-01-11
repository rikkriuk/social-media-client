'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const type = isRegister ? 'register' : 'login';
      const body: any = { type };
      if (isRegister) {
        body.fullname = fullname;
        body.email = email;
        body.password = password;
        body.confirm = confirm;
      } else {
        body.email = email;
        body.password = password;
      }

      const res = await fetch('/api/auth/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMsg(data.message || (data.ok ? 'Success' : 'Error'));
    } catch (err) {
      setMsg('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Auth
        isRegister={false}
        onLogin={() => setIsRegister(false)}
      />
    </section>
  );
}
