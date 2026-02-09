'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProduct, getProductReviews } from '@/utils/api';
import { Product, Review } from '@/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import ReviewSection from '@/components/ReviewSection';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiMinus, FiPlus, FiShoppingBag, FiStar, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProduct(slug)
      .then((p) => {
        setProduct(p);
        if (Array.isArray((p as unknown as Record<string, unknown>).reviews)) {
          setReviews((p as unknown as Record<string, unknown>).reviews as Review[]);
        } else {
          getProductReviews(slug).then(setReviews).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-4 skeleton-shimmer rounded w-24 mb-6" />
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square skeleton-shimmer rounded-2xl" />
          <div className="space-y-4 pt-4">
            <div className="h-4 skeleton-shimmer rounded w-1/4" />
            <div className="h-8 skeleton-shimmer rounded w-3/4" />
            <div className="h-6 skeleton-shimmer rounded w-1/3 mt-4" />
            <div className="h-4 skeleton-shimmer rounded w-full mt-4" />
            <div className="h-4 skeleton-shimmer rounded w-2/3" />
            <div className="h-12 skeleton-shimmer rounded-full w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-espresso-50 flex items-center justify-center mx-auto mb-4">
          <FiX size={24} className="text-espresso-300" />
        </div>
        <p className="text-espresso-500 font-medium mb-1">Product not found</p>
        <Link href="/products" className="text-burnt-600 text-sm underline underline-offset-2 mt-2 inline-block hover:text-burnt-700 transition-colors">
          Back to shop
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const compare = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
  const onSale = compare !== null && compare > price;
  const inStock = product.is_in_stock ?? product.in_stock ?? false;
  const categoryName = product.category?.name || product.category_name || '';
  const rating = product.average_rating ?? product.avg_rating ?? null;
  const reviewCount = product.review_count ?? 0;
  const stockQty = product.stock_quantity ?? 0;
  const discount = onSale && compare ? Math.round(((compare - price) / compare) * 100) : 0;

  function handleAdd() {
    if (!product) return;
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${qty} × ${product.name} added to bag`);
    setQty(1);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-espresso-400 mb-6">
        <Link href="/products" className="inline-flex items-center gap-1.5 hover:text-espresso-700 transition-colors">
          <FiArrowLeft size={14} /> Shop
        </Link>
        {categoryName && (
          <>
            <span className="text-espresso-200">/</span>
            <span className="text-espresso-500">{categoryName}</span>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image placeholder with nice gradient and pattern */}
        <div className="aspect-square bg-gradient-to-br from-espresso-50 via-burnt-50 to-orange-50 rounded-2xl flex flex-col items-center justify-center border border-espresso-100/50 relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }} />
          
          <span className="text-espresso-300/70 text-xs uppercase tracking-[0.2em] font-medium z-10">
            {categoryName || 'Product'}
          </span>
          <span className="text-espresso-200/60 text-[10px] mt-1 z-10">Product Image</span>

          {onSale && (
            <div className="absolute top-4 left-4 bg-burnt-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm z-10">
              -{discount}% OFF
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          {categoryName && (
            <p className="text-xs font-medium text-burnt-500 uppercase tracking-widest mb-1.5">{categoryName}</p>
          )}
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso-900 leading-snug">{product.name}</h1>

          {rating !== null && rating > 0 && reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FiStar
                    key={n}
                    size={14}
                    className={n <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-espresso-200'}
                  />
                ))}
              </div>
              <span className="text-sm text-espresso-500">
                {rating.toFixed(1)} · {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-bold text-espresso-900">R{price.toFixed(2)}</span>
            {onSale && compare && (
              <span className="text-base text-espresso-300 line-through">R{compare.toFixed(2)}</span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-espresso-500 leading-relaxed mt-5">{product.description}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-espresso-400">
            {product.sku && (
              <>
                <span className="bg-espresso-50 px-2.5 py-1 rounded-md">SKU: {product.sku}</span>
              </>
            )}
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md ${inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
              {inStock ? <FiCheck size={11} /> : <FiX size={11} />}
              {inStock ? (stockQty > 0 ? `${stockQty} in stock` : 'In stock') : 'Sold out'}
            </span>
          </div>

          {/* Add to cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-espresso-100 rounded-full overflow-hidden bg-white">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3.5 py-2.5 text-espresso-500 hover:bg-espresso-50 hover:text-espresso-800 transition-colors"
                aria-label="Decrease quantity"
              >
                <FiMinus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-espresso-800">{qty}</span>
              <button
                onClick={() => setQty(stockQty > 0 ? Math.min(stockQty, qty + 1) : qty + 1)}
                className="px-3.5 py-2.5 text-espresso-500 hover:bg-espresso-50 hover:text-espresso-800 transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus size={14} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-espresso-800 text-cream py-3.5 rounded-full text-sm font-semibold hover:bg-espresso-700 hover:shadow-lg hover:shadow-espresso-200/50 transition-all duration-300 disabled:bg-espresso-200 disabled:text-espresso-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <FiShoppingBag size={16} />
              {inStock ? 'Add to bag' : 'Sold out'}
            </button>
          </div>
        </div>
      </div>

      <ReviewSection slug={slug} reviews={reviews} />
    </div>
  );
}
