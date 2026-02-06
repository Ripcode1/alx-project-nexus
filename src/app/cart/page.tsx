'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeFromCart, updateQuantity, clearCart } from '@/store/cartSlice';
import { placeOrder } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { items } = useSelector((s: RootState) => s.cart);
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  const total = items.reduce((s, i) => s + parseFloat(i.product.price) * i.quantity, 0);

  async function handleOrder() {
    if (!accessToken) { router.push('/login'); return; }
    setPlacing(true);
    try {
      const orderItems = items.map((i) => ({ product: i.product.id, quantity: i.quantity }));
      await placeOrder(orderItems, accessToken);
      dispatch(clearCart());
      toast.success('Order placed!');
      router.push('/orders');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Order failed');
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag size={40} className="text-espresso-200 mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-espresso-800 mb-2">Your bag is empty</h1>
        <p className="text-sm text-espresso-400 mb-6">Browse around and add something you like.</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-espresso-800 text-cream px-6 py-3 rounded-full text-sm font-semibold hover:bg-espresso-700 transition-colors">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl sm:text-3xl text-espresso-800 mb-8">
        Your bag <span className="text-espresso-300 font-normal text-lg">({items.length})</span>
      </h1>

      <div className="space-y-4">
        {items.map((item) => {
          const price = parseFloat(item.product.price);
          return (
            <div key={item.product.id} className="flex gap-4 bg-white rounded-2xl border border-espresso-100/60 p-4">
              <div className="w-20 h-20 bg-espresso-50 rounded-xl flex-shrink-0 flex items-center justify-center">
                <span className="text-[9px] text-espresso-300 uppercase tracking-wider">{item.product.category?.name}</span>
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.slug}`} className="text-sm font-medium text-espresso-800 hover:text-burnt-600 line-clamp-1 transition-colors">
                  {item.product.name}
                </Link>
                <p className="text-sm font-bold text-espresso-900 mt-1">R{(price * item.quantity).toFixed(2)}</p>

                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center border border-espresso-100 rounded-full overflow-hidden">
                    <button onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1 }))}
                      className="px-2.5 py-1.5 text-espresso-500 hover:bg-espresso-50"><FiMinus size={12} /></button>
                    <span className="w-8 text-center text-xs font-medium text-espresso-800">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))}
                      className="px-2.5 py-1.5 text-espresso-500 hover:bg-espresso-50"><FiPlus size={12} /></button>
                  </div>

                  <button onClick={() => dispatch(removeFromCart(item.product.id))}
                    className="p-2 text-espresso-300 hover:text-red-500 transition-colors"><FiTrash2 size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* summary */}
      <div className="mt-8 bg-espresso-50/50 rounded-2xl border border-espresso-100/60 p-6">
        <div className="flex justify-between items-center mb-5">
          <span className="text-sm text-espresso-600">Total</span>
          <span className="text-xl font-bold text-espresso-900">R{total.toFixed(2)}</span>
        </div>
        <button onClick={handleOrder} disabled={placing}
          className="w-full bg-burnt-500 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-burnt-600 transition-colors disabled:opacity-50">
          {placing ? 'Placing order...' : 'Place order'}
        </button>
        {!accessToken && <p className="text-xs text-espresso-400 text-center mt-3">You&apos;ll need to log in first.</p>}
      </div>
    </div>
  );
}
