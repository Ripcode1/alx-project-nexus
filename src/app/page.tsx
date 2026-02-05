'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProducts } from '@/utils/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar, FiHeart, FiBox } from 'react-icons/fi';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({ page_size: '4', ordering: '-created_at' })
      .then((data) => setFeatured(data.results))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-espresso-800 via-espresso-700 to-burnt-700" />
        
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-burnt-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-burnt-300/10 rounded-full blur-[80px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl animate-fade-in-up">
            <p className="text-burnt-200 text-sm font-medium tracking-widest uppercase mb-4">
              Curated for you
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream leading-tight">
              Good things, <br />
              <span className="text-burnt-200">found here.</span>
            </h1>
            <p className="text-espresso-200 mt-5 text-lg leading-relaxed max-w-md">
              A straightforward way to shop — no noise, no clutter. Just the stuff you actually want.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/products" className="inline-flex items-center gap-2 bg-cream text-espresso-800 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white hover:shadow-lg hover:shadow-cream/20 transition-all duration-300 group">
                Start browsing <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 border border-cream/20 text-cream/80 px-6 py-3 rounded-full text-sm hover:bg-cream/10 hover:border-cream/40 transition-all duration-300">
                Create account
              </Link>
            </div>
          </div>

          {/* Floating decorative card on desktop */}
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-64">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-full aspect-square bg-gradient-to-br from-burnt-400/20 to-espresso-600/20 rounded-xl mb-4 flex items-center justify-center">
                <FiBox size={32} className="text-cream/40" />
              </div>
              <div className="h-2.5 bg-white/15 rounded-full w-3/4 mb-2" />
              <div className="h-2 bg-white/10 rounded-full w-1/2" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-espresso-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: FiTruck, label: 'Free shipping over R500', sub: 'Fast & reliable' },
              { icon: FiShield, label: 'Secure checkout', sub: 'SSL encrypted' },
              { icon: FiRefreshCw, label: '30-day returns', sub: 'No questions asked' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center justify-center gap-3 py-2 group">
                <div className="w-9 h-9 rounded-full bg-burnt-50 flex items-center justify-center group-hover:bg-burnt-100 transition-colors duration-200">
                  <Icon size={16} className="text-burnt-500" />
                </div>
                <div>
                  <span className="text-sm font-medium text-espresso-700 block">{label}</span>
                  <span className="text-xs text-espresso-400">{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div className="animate-fade-in-up">
              <p className="text-xs font-medium text-burnt-500 uppercase tracking-widest mb-2">New in</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-espresso-800">Latest arrivals</h2>
              <p className="text-sm text-espresso-400 mt-1.5">Fresh picks, just added to the collection.</p>
            </div>
            <Link href="/products" className="text-sm text-burnt-600 hover:text-burnt-700 font-medium flex items-center gap-1.5 transition-colors group">
              View all <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {featured.map((p, i) => (
              <div key={p.id} className={`stagger-${i + 1}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: FiStar, title: 'Quality first', desc: 'Every product is vetted before it hits the catalog.' },
            { icon: FiHeart, title: 'Customer love', desc: 'Read real reviews from real people before you buy.' },
            { icon: FiBox, title: 'Curated catalog', desc: 'Filter by category, price, or just browse at your pace.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-espresso-100/60 p-6 hover:shadow-md hover:shadow-espresso-100/40 hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-burnt-50 flex items-center justify-center mb-4">
                <Icon size={18} className="text-burnt-500" />
              </div>
              <h3 className="font-serif text-lg text-espresso-800 mb-1.5">{title}</h3>
              <p className="text-sm text-espresso-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative bg-gradient-to-r from-espresso-700 to-espresso-800 rounded-3xl p-10 sm:p-14 text-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-burnt-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-burnt-400/10 rounded-full blur-[60px]" />
          
          <div className="relative">
            <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">Ready to shop?</h2>
            <p className="text-espresso-200 text-sm max-w-md mx-auto mb-6">
              Browse the full collection. Filter by category, price, whatever works for you.
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-burnt-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-burnt-600 hover:shadow-lg hover:shadow-burnt-700/30 transition-all duration-300 group">
              Explore products <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
