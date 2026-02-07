'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getOrders, cancelOrder } from '@/utils/api';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiPackage } from 'react-icons/fi';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
};

export default function OrdersPage() {
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) { router.push('/login'); return; }
    getOrders(accessToken).then((d) => setOrders(d.results)).catch(() => {}).finally(() => setLoading(false));
  }, [accessToken, router]);

  async function handleCancel(id: number) {
    if (!accessToken) return;
    try {
      await cancelOrder(id, accessToken);
      setOrders(orders.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)));
      toast.success('Order cancelled');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not cancel');
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-espresso-100/60 p-6 mb-4 animate-pulse">
            <div className="h-4 bg-espresso-50 rounded w-1/3 mb-3" />
            <div className="h-4 bg-espresso-50 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl sm:text-3xl text-espresso-800 mb-8">Your orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage size={40} className="text-espresso-200 mx-auto mb-4" />
          <p className="text-sm text-espresso-400">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-espresso-100/60 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-espresso-800">{order.order_number}</p>
                  <p className="text-xs text-espresso-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border capitalize ${statusColors[order.status] || 'bg-espresso-50 text-espresso-500 border-espresso-100'}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-espresso-600">{item.product_name} × {item.quantity}</span>
                    <span className="text-espresso-800 font-medium">R{parseFloat(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-espresso-50">
                <span className="text-sm font-bold text-espresso-900">R{parseFloat(order.total_amount).toFixed(2)}</span>
                {order.status === 'pending' && (
                  <button onClick={() => handleCancel(order.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                    Cancel order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
