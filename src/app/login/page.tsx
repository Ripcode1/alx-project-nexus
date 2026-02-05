'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { login } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      const access = data.tokens?.access || data.access;
      const refresh = data.tokens?.refresh || data.refresh;
      dispatch(setCredentials({ user: data.user, access, refresh }));
      toast.success('Welcome back!');
      router.push('/products');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-espresso-800 text-center mb-2">Welcome back</h1>
        <p className="text-sm text-espresso-400 text-center mb-8">Log in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-espresso-600 mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-espresso-100 rounded-xl text-sm text-espresso-800 placeholder:text-espresso-300 focus:ring-1 focus:ring-burnt-400 focus:border-burnt-400"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-espresso-600 mb-1.5 uppercase tracking-wider">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-espresso-100 rounded-xl text-sm text-espresso-800 placeholder:text-espresso-300 focus:ring-1 focus:ring-burnt-400 focus:border-burnt-400"
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-espresso-800 text-cream py-3 rounded-full text-sm font-semibold hover:bg-espresso-700 transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-espresso-400 mt-6">
          No account? <Link href="/register" className="text-burnt-600 underline underline-offset-2 hover:text-burnt-700">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
