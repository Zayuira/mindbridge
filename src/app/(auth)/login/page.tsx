'use client';

import Link from 'next/link';
import { BriefcaseBusiness, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (res?.ok && !res?.error) {
        router.push('/');
        router.refresh();
      } else {
        setError('И-мэйл эсвэл нууц үг буруу байна.');
      }
    } catch {
      setError('Сервертэй холбогдоход алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
            <BriefcaseBusiness className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Тавтай морилно уу
          </h1>
          <p className="text-sm text-slate-500 mt-2 text-center text-balance">
            Нэвтрэх мэдээллээ оруулан Mind Bridge платформд нэвтэрнэ үү.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={handleLogin}
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              И-мэйл хаяг
            </label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Нууц үг
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-500 font-medium"
              >
                Нууц үг сэргээх?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock className="w-4 h-4" />}
            />
          </div>

          <Button
            variant="primary"
            className="w-full mt-6 py-6 font-semibold"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Түрхүлээнэ үү...' : 'Нэвтрэх'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Бүртгэлгүй юу?{' '}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Шинээр бүртгүүлэх
          </Link>
        </div>
      </div>
    </div>
  );
}
