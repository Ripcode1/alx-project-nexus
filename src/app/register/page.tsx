'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { register } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', username: '', email: '', password: '', password_confirm: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  function upd(key: string, val: string) { setForm({ ...form, [key]: val }); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.password_confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const data = await register(form);
      const access = data.tokens?.access || data.access;
      const refresh = data.tokens?.refresh || data.refresh;
      if (access && refresh && data.user) {
        dispatch(setCredentials({ user: data.user, access, refresh }));
        toast.success('Account created!');
        router.push('/products');
      } else {
        toast.success('Account created! Please log in.');
        router.push('/login');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full px-4 py-3 bg-white border border-espresso-100 rounded-xl text-sm text-espresso-800 placeholder:text-espresso-300 focus:ring-1 focus:ring-burnt-400 focus:border-burnt-400';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-espresso-800 text-center mb-2">Create account</h1>
        <p className="text-sm text-espresso-400 text-center mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-espresso-600 mb-1.5 uppercase tracking-wider">First name</label>
              <input type="text" required value={form.first_name} onChange={(e) => upd('first_name', e.target.value)} className={inputCls} placeholder="John" />
            </div>
            <div>
              <label className="block text-xs font-medium text-espresso-600 mb-1.5 uppercase tracking-wider">Last name</label>
              <input type="text" required value={form.last_name} onChange={(e) => upd('last_name', e.target.value)} className={inputCls} placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-espresso-600 mb-1.5 uppercase tracking-wider">Username</label>
            <input type="text" required value={form.username} onChange={(e) => upd('username', e.target.value)} className={inputCls} placeholder="johndoe" />
          </div>
          <div>
            <label className="block text-xs font-medium text-espresso-600 mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" required value={form.email} onChange={(e) => upd('email', e.target.value)} className={inputCls} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-espresso-600 mb-1.5 uppercase tracking-wider">Password</label>
            <input type="password" required value={form.password} onChange={(e) => upd('password', e.target.value)} className={inputCls} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-espresso-600 mb-1.5 uppercase tracking-wider">Confirm password</label>
            <input type="password" required value={form.password_confirm} onChange={(e) => upd('password_confirm', e.target.value)} className={inputCls} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-espresso-800 text-cream py-3 rounded-full text-sm font-semibold hover:bg-espresso-700 transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-espresso-400 mt-6">
          Already have one? <Link href="/login" className="text-burnt-600 underline underline-offset-2 hover:text-burnt-700">Log in</Link>
        </p>
      </div>
    </div>
  );
}
