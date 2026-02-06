'use client';

import { Category, ProductFilters } from '@/types';
import { FiX } from 'react-icons/fi';

interface Props {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (f: ProductFilters) => void;
  open: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ categories, filters, onFilterChange, open, onClose }: Props) {
  function set(key: string, val: string) {
    const updated = { ...filters, [key]: val, page: 1 };
    if (!val) delete updated[key as keyof ProductFilters];
    onFilterChange(updated);
  }

  const content = (
    <div className="space-y-7">
      <div>
        <h3 className="text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="radio" name="cat" checked={!filters.category} onChange={() => set('category', '')} className="accent-burnt-500" />
            <span className="text-sm text-espresso-600 group-hover:text-espresso-800">All categories</span>
          </label>
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="cat" checked={filters.category === c.slug} onChange={() => set('category', c.slug)} className="accent-burnt-500" />
              <span className="text-sm text-espresso-600 group-hover:text-espresso-800">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-3">Price (R)</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.min_price || ''} onChange={(e) => set('min_price', e.target.value)}
            className="w-full px-3 py-2 border border-espresso-100 rounded-lg text-sm bg-white focus:ring-1 focus:ring-burnt-400 focus:border-burnt-400 text-espresso-800 placeholder:text-espresso-300" />
          <input type="number" placeholder="Max" value={filters.max_price || ''} onChange={(e) => set('max_price', e.target.value)}
            className="w-full px-3 py-2 border border-espresso-100 rounded-lg text-sm bg-white focus:ring-1 focus:ring-burnt-400 focus:border-burnt-400 text-espresso-800 placeholder:text-espresso-300" />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={filters.in_stock === 'true'} onChange={(e) => set('in_stock', e.target.checked ? 'true' : '')} className="accent-burnt-500 rounded" />
          <span className="text-sm text-espresso-600">In stock only</span>
        </label>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-3">Sort</h3>
        <select value={filters.ordering || ''} onChange={(e) => set('ordering', e.target.value)}
          className="w-full px-3 py-2 border border-espresso-100 rounded-lg text-sm bg-white focus:ring-1 focus:ring-burnt-400 focus:border-burnt-400 text-espresso-700">
          <option value="">Default</option>
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>
          <option value="-created_at">Newest</option>
          <option value="name">Name: A → Z</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-60 flex-shrink-0"><div className="sticky top-20">{content}</div></aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-espresso-900/30 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute right-0 top-0 h-full w-80 bg-cream p-6 shadow-xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-lg font-semibold text-espresso-800">Filters</h2>
              <button onClick={onClose} className="text-espresso-400 hover:text-espresso-700"><FiX size={20} /></button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
