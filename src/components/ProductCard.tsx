'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import toast from 'react-hot-toast';
import { FiStar, FiShoppingBag } from 'react-icons/fi';

function catGradient(name?: string): string {
  if (!name) return 'from-espresso-50 to-burnt-50';
  const gradients = [
    'from-burnt-50 via-orange-50 to-amber-50',
    'from-amber-50 via-yellow-50 to-orange-50',
    'from-rose-50 via-orange-50 to-burnt-50',
    'from-stone-100 via-espresso-50 to-burnt-50',
    'from-orange-50 via-amber-50 to-yellow-50',
    'from-burnt-50 via-rose-50 to-stone-100',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
}

function catIcon(name?: string): string {
  if (!name) return '◇';
  const icons = ['◆', '●', '▲', '■', '⬡', '✦'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return icons[Math.abs(hash) % icons.length];
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
  const hasImage = product.image_url && product.image_url !== 'null' && product.image_url !== '';

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Added to bag`);
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block animate-fade-in-up">
      <div className="bg-white rounded-2xl border border-espresso-100/60 overflow-hidden hover:shadow-lg hover:shadow-espresso-200/30 hover:border-espresso-200/80 transition-all duration-300 hover:-translate-y-1">
        {/* Image area */}
        <div className={`aspect-[4/3] relative flex items-center justify-center overflow-hidden ${hasImage ? 'bg-espresso-50' : `bg-gradient-to-br ${catGradient(categoryName)}`}`}>
          {hasImage ? (
            <img
              src={product.image_url!}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <>
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '20px 20px',
              }} />
              <div className="absolute top-4 right-4 text-espresso-200/40 text-2xl transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
                {catIcon(categoryName)}
              </div>
              <span className="text-espresso-300/80 text-[10px] uppercase tracking-[0.2em] font-medium z-10">
                {categoryName}
              </span>
            </>
          )}

          {onSale && (
            <span className="absolute top-3 left-3 bg-burnt-500 text-white text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide shadow-sm">
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
          <h3 className="text-sm font-medium text-espresso-800 group-hover:text-burnt-600 transition-colors duration-200 line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {rating !== null && rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex gap-px">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FiStar
                    key={n}
                    size={10}
                    className={n <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-espresso-200'}
                  />
                ))}
              </div>
              <span className="text-[11px] text-espresso-400 ml-0.5">
                ({reviewCount})
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
              className="p-2 rounded-full bg-espresso-50 text-espresso-600 hover:bg-burnt-500 hover:text-white hover:scale-110 hover:shadow-md hover:shadow-burnt-200/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              title="Add to bag"
              aria-label={`Add ${product.name} to bag`}
            >
              <FiShoppingBag size={14} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
