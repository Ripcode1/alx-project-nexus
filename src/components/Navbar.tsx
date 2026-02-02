'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import { useState, useEffect } from 'react';
import { FiShoppingBag, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const count = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm shadow-espresso-100/50' : 'bg-cream border-b border-espresso-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-espresso-800 tracking-tight hover:text-burnt-600 transition-colors duration-200">
            Store
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="relative text-espresso-500 hover:text-espresso-800 text-sm font-medium transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-burnt-500 after:transition-all after:duration-300 hover:after:w-full">
              Browse
            </Link>
            {user && (
              <Link href="/orders" className="relative text-espresso-500 hover:text-espresso-800 text-sm font-medium transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-burnt-500 after:transition-all after:duration-300 hover:after:w-full">
                Orders
              </Link>
            )}

            <Link href="/cart" className="relative text-espresso-500 hover:text-espresso-800 transition-colors duration-200 group">
              <FiShoppingBag size={20} className="group-hover:scale-110 transition-transform duration-200" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-burnt-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-slide-up">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-espresso-100">
                <Link href="/profile" className="text-sm text-espresso-500 hover:text-espresso-800 flex items-center gap-1.5 transition-colors duration-200">
                  <div className="w-6 h-6 rounded-full bg-burnt-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-burnt-700">{user.first_name?.charAt(0) || user.username?.charAt(0)}</span>
                  </div>
                  {user.first_name || user.username}
                </Link>
                <button onClick={() => dispatch(logout())} className="text-espresso-300 hover:text-burnt-500 transition-colors duration-200" aria-label="Log out">
                  <FiLogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-espresso-100">
                <Link href="/login" className="text-sm text-espresso-500 hover:text-espresso-800 transition-colors duration-200">
                  Log in
                </Link>
                <Link href="/register" className="text-sm bg-espresso-800 text-cream px-4 py-2 rounded-full hover:bg-espresso-700 transition-all duration-200 hover:shadow-md hover:shadow-espresso-200/50">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative text-espresso-500">
              <FiShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-burnt-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)} className="text-espresso-600" aria-label="Toggle menu">
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-cream border-t border-espresso-100 px-4 pb-4">
          <Link href="/products" className="block py-3 text-espresso-700 border-b border-espresso-50 hover:text-burnt-600 transition-colors" onClick={() => setOpen(false)}>
            Browse
          </Link>
          {user && (
            <Link href="/orders" className="block py-3 text-espresso-700 border-b border-espresso-50 hover:text-burnt-600 transition-colors" onClick={() => setOpen(false)}>
              Orders
            </Link>
          )}
          {user ? (
            <>
              <Link href="/profile" className="block py-3 text-espresso-700 border-b border-espresso-50" onClick={() => setOpen(false)}>
                Profile
              </Link>
              <button onClick={() => { dispatch(logout()); setOpen(false); }} className="block py-3 text-burnt-600 w-full text-left">
                Log out
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-3">
              <Link href="/login" className="flex-1 text-center py-2.5 border border-espresso-200 rounded-full text-espresso-700 text-sm" onClick={() => setOpen(false)}>Log in</Link>
              <Link href="/register" className="flex-1 text-center py-2.5 bg-espresso-800 text-cream rounded-full text-sm" onClick={() => setOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
