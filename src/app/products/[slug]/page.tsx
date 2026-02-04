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
import { FiMinus, FiPlus, FiShoppingBag, FiStar, FiArrowLeft } from 'react-icons/fi';

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
        // Use reviews from product response if available
        if (Array.isArray((p as unknown as Record<string, unknown>).reviews)) {
          setReviews((p as unknown as Record<string, unknown>).reviews as Review[]);
        } else {
          // Try separate endpoint, but don't fail if it errors
          getProductReviews(slug).then(setReviews).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-espresso-50 rounded-2xl" />
          <div className="space-y-4 pt-4">
            <div className="h-5 bg-espresso-50 rounded w-1/3" />
            <div className="h-8 bg-espresso-50 rounded w-3/4" />
            <div className="h-4 bg-espresso-50 rounded w-full" />
            <div className="h-4 bg-espresso-50 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-espresso-400">Product not found.</p>
        <Link href="/products" className="text-burnt-600 text-sm underline mt-2 inline-block">Back to shop</Link>
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

  function handleAdd() {
    if (!product) return;
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${qty} × ${product.name} added to bag`);
    setQty(1);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-espresso-400 hover:text-espresso-700 mb-6 transition-colors">
        <FiArrowLeft size={14} /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* image placeholder */}
        <div className="aspect-square bg-gradient-to-br from-espresso-50 to-burnt-50 rounded-2xl flex items-center justify-center border border-espresso-100/50">
          <span className="text-espresso-300 text-sm uppercase tracking-widest">{categoryName || 'Product'}</span>
        </div>

        {/* info */}
        <div className="flex flex-col">
          <p className="text-xs font-medium text-burnt-500 uppercase tracking-widest mb-1.5">{categoryName}</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso-900 leading-snug">{product.name}</h1>

          {rating !== null && rating > 0 && reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <FiStar size={13} className="text-amber-500 fill-amber-500" />
              <span className="text-sm text-espresso-500">
                {rating.toFixed(1)} · {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-2xl font-bold text-espresso-900">R{price.toFixed(2)}</span>
            {onSale && compare && <span className="text-base text-espresso-300 line-through">R{compare.toFixed(2)}</span>}
          </div>

          <p className="text-sm text-espresso-500 leading-relaxed mt-5">{product.description}</p>

          <div className="flex items-center gap-3 mt-3 text-xs text-espresso-400">
            {product.sku && <><span>SKU: {product.sku}</span><span className="w-1 h-1 rounded-full bg-espresso-200" /></>}
            <span className={inStock ? 'text-green-600' : 'text-red-500'}>
              {inStock ? (stockQty > 0 ? `${stockQty} in stock` : 'In stock') : 'Sold out'}
            </span>
          </div>

          {/* add to cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-espresso-100 rounded-full overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3.5 py-2.5 text-espresso-500 hover:bg-espresso-50 transition-colors">
                <FiMinus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium text-espresso-800">{qty}</span>
              <button onClick={() => setQty(stockQty > 0 ? Math.min(stockQty, qty + 1) : qty + 1)} className="px-3.5 py-2.5 text-espresso-500 hover:bg-espresso-50 transition-colors">
                <FiPlus size={14} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-espresso-800 text-cream py-3 rounded-full text-sm font-semibold hover:bg-espresso-700 transition-colors disabled:bg-espresso-200 disabled:text-espresso-400 disabled:cursor-not-allowed"
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
