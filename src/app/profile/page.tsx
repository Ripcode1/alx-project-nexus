'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FiLogOut, FiPackage, FiShoppingBag } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, accessToken } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) router.push('/login');
  }, [accessToken, router]);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-burnt-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-xl font-bold text-burnt-700">{user.first_name?.charAt(0) || user.username?.charAt(0)}</span>
        </div>
        <h1 className="font-serif text-2xl text-espresso-800">{user.first_name} {user.last_name}</h1>
        <p className="text-sm text-espresso-400 mt-1">@{user.username}</p>
      </div>

      <div className="bg-white rounded-2xl border border-espresso-100/60 divide-y divide-espresso-50">
        <div className="px-5 py-4">
          <p className="text-xs text-espresso-400 uppercase tracking-wider mb-1">Email</p>
          <p className="text-sm text-espresso-800">{user.email}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-espresso-400 uppercase tracking-wider mb-1">Account type</p>
          <p className="text-sm text-espresso-800">{user.is_seller ? 'Seller' : 'Buyer'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <Link href="/orders" className="flex items-center justify-center gap-2 bg-espresso-50 text-espresso-700 py-3 rounded-xl text-sm font-medium hover:bg-espresso-100 transition-colors">
          <FiPackage size={15} /> Orders
        </Link>
        <Link href="/products" className="flex items-center justify-center gap-2 bg-espresso-50 text-espresso-700 py-3 rounded-xl text-sm font-medium hover:bg-espresso-100 transition-colors">
          <FiShoppingBag size={15} /> Shop
        </Link>
      </div>

      <button onClick={() => { dispatch(logout()); router.push('/'); }}
        className="w-full mt-6 flex items-center justify-center gap-2 border border-red-200 text-red-500 py-3 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
        <FiLogOut size={15} /> Log out
      </button>
    </div>
  );
}
