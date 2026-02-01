'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProducts } from '@/utils/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({ page_size: '4', ordering: '-created_at' })
      .then((data) => setFeatured(data.results))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-espresso-800 via-espresso-700 to-burnt-700" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-burnt-200 text-sm font-medium tracking-widest uppercase mb-4">
              Curated for you
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream leading-tight">
              Good things, <br />found here.
            </h1>
            <p className="text-espresso-200 mt-5 text-lg leading-relaxed max-w-md">
              A straightforward way to shop — no noise, no clutter. Just the stuff you actually want.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/products" className="inline-flex items-center gap-2 bg-cream text-espresso-800 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white transition-colors group">
                Start browsing <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 border border-cream/20 text-cream/80 px-6 py-3 rounded-full text-sm hover:bg-cream/10 transition-colors">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* trust strip */}
      <section className="border-b border-espresso-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: FiTruck, label: 'Free shipping over R500' },
              { icon: FiShield, label: 'Secure checkout' },
              { icon: FiRefreshCw, label: '30-day returns' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2.5 py-2">
                <Icon size={16} className="text-burnt-500" />
                <span className="text-sm text-espresso-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-espresso-800">Latest arrivals</h2>
              <p className="text-sm text-espresso-400 mt-1">Fresh picks, just added.</p>
            </div>
            <Link href="/products" className="text-sm text-burnt-600 hover:text-burnt-700 font-medium flex items-center gap-1 transition-colors">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* cta */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-espresso-700 to-espresso-800 rounded-3xl p-10 sm:p-14 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">Ready to shop?</h2>
          <p className="text-espresso-200 text-sm max-w-md mx-auto mb-6">
            Browse the full collection. Filter by category, price, whatever works for you.
          </p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-burnt-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-burnt-600 transition-colors">
            Explore products <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
