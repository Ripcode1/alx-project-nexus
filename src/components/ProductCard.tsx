'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import toast from 'react-hot-toast';
import { FiStar, FiShoppingBag } from 'react-icons/fi';

// generate a muted warm bg based on category name
function catColor(name?: string): string {
  if (!name) return 'bg-espresso-50';
  const colors = ['bg-burnt-50', 'bg-orange-50', 'bg-amber-50', 'bg-yellow-50', 'bg-rose-50', 'bg-stone-100'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const price = parseFloat(product.price);
  const compare = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
  const onSale = compare !== null && compare > price;
  const inStock = product.is_in_stock ?? product.in_stock ?? false;
  const categoryName = product.category?.name || product.category_name || 'Product';
  const rating = product.average_rating ?? product.avg_rating ?? null;
  const reviewCount = product.review_count ?? (rating !== null ? 1 : 0);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!inStock) return;
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Added to bag`);
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-espresso-100/60 overflow-hidden hover:shadow-md hover:shadow-espresso-200/40 transition-all duration-300">
        <div className={`aspect-[4/3] ${catColor(categoryName)} relative flex items-center justify-center`}>
          <span className="text-espresso-300 text-xs uppercase tracking-widest font-medium">
            {categoryName}
          </span>
          {onSale && (
            <span className="absolute top-3 left-3 bg-burnt-500 text-white text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide">
              Sale
            </span>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-espresso-900/50 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-cream text-xs font-semibold uppercase tracking-wide">Sold out</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-espresso-800 group-hover:text-burnt-600 transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {rating !== null && rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <FiStar size={11} className="text-amber-500 fill-amber-500" />
              <span className="text-[11px] text-espresso-400">
                {rating.toFixed(1)}{reviewCount > 0 ? ` (${reviewCount})` : ''}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-espresso-900">R{price.toFixed(2)}</span>
              {onSale && compare && (
                <span className="text-xs text-espresso-300 line-through">R{compare.toFixed(2)}</span>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="p-2 rounded-full bg-espresso-50 text-espresso-600 hover:bg-burnt-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Add to bag"
            >
              <FiShoppingBag size={14} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
