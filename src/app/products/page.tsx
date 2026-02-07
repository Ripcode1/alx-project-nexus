'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getProducts, getCategories } from '@/utils/api';
import { Product, Category, ProductFilters } from '@/types';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import { FiSearch, FiSliders, FiGrid, FiList, FiPackage } from 'react-icons/fi';

const PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [infiniteMode, setInfiniteMode] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(Array.isArray(data) ? data : (data as unknown as { results: Category[] }).results || []);
    }).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async (pageNum: number, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const params: Record<string, string> = { page: String(pageNum), page_size: String(PER_PAGE) };
    if (filters.category) params.category = filters.category;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.in_stock) params.in_stock = filters.in_stock;
    if (filters.ordering) params.ordering = filters.ordering;
    if (filters.search) params.search = filters.search;

    try {
      const data = await getProducts(params);
      if (append) {
        setProducts((prev) => [...prev, ...data.results]);
      } else {
        setProducts(data.results);
      }
      setTotal(data.count);
    } catch {
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!infiniteMode) {
      fetchProducts(page);
    }
  }, [page, fetchProducts, infiniteMode]);

  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1);
  }, [filters, infiniteMode, fetchProducts]);

  // Infinite scroll observer
  useEffect(() => {
    if (!infiniteMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingMore && !loading) {
          const totalPages = Math.ceil(total / PER_PAGE);
          if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProducts(nextPage, true);
          }
        }
      },
      { threshold: 0.1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [infiniteMode, loadingMore, loading, page, total, fetchProducts]);

  function handleFilter(f: ProductFilters) {
    setFilters(f);
    setPage(1);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters({ ...filters, search, page: 1 });
    setPage(1);
  }

  function toggleMode() {
    setInfiniteMode((prev) => !prev);
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso-800">All products</h1>
          <p className="text-sm text-espresso-400 mt-1">
            {loading ? (
              <span className="inline-block w-20 h-4 skeleton-shimmer rounded" />
            ) : (
              <>{total} {total === 1 ? 'item' : 'items'} found</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-52 sm:w-64 pl-9 pr-3 py-2.5 border border-espresso-100 rounded-full text-sm bg-white text-espresso-800 placeholder:text-espresso-300 focus:ring-2 focus:ring-burnt-400/30 focus:border-burnt-400 transition-all duration-200"
              aria-label="Search products"
            />
            <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-300" />
          </form>

          {/* Toggle pagination / infinite scroll */}
          <button
            onClick={toggleMode}
            title={infiniteMode ? 'Switch to pagination' : 'Switch to infinite scroll'}
            className={`p-2.5 border rounded-full transition-all duration-200 ${
              infiniteMode 
                ? 'border-burnt-200 bg-burnt-50 text-burnt-600' 
                : 'border-espresso-100 text-espresso-500 hover:bg-espresso-50'
            }`}
            aria-label={infiniteMode ? 'Switch to pagination' : 'Switch to infinite scroll'}
          >
            {infiniteMode ? <FiList size={16} /> : <FiGrid size={16} />}
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden p-2.5 border border-espresso-100 rounded-full text-espresso-500 hover:bg-espresso-50 transition-colors"
            aria-label="Open filters"
          >
            <FiSliders size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <FilterSidebar
          categories={categories}
          filters={filters}
          onFilterChange={handleFilter}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        <div className="flex-1 min-w-0">
          {loading ? (
            /* Skeleton grid with shimmer */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`bg-white rounded-2xl border border-espresso-100/60 overflow-hidden animate-fade-in stagger-${i + 1}`}>
                  <div className="aspect-[4/3] skeleton-shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 skeleton-shimmer rounded w-3/4" />
                    <div className="h-3 skeleton-shimmer rounded w-1/2" />
                    <div className="flex justify-between items-center">
                      <div className="h-5 skeleton-shimmer rounded w-1/3" />
                      <div className="w-8 h-8 skeleton-shimmer rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-espresso-50 flex items-center justify-center mx-auto mb-4">
                <FiPackage size={24} className="text-espresso-300" />
              </div>
              <p className="text-espresso-500 font-medium mb-1">No products found</p>
              <p className="text-espresso-400 text-sm mb-4">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => { setFilters({}); setSearch(''); setPage(1); }}
                className="text-sm text-burnt-600 underline underline-offset-2 hover:text-burnt-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination mode */}
              {!infiniteMode && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              )}

              {/* Infinite scroll sentinel */}
              {infiniteMode && (
                <div ref={loaderRef} className="py-8 flex justify-center">
                  {loadingMore ? (
                    <div className="flex items-center gap-2 text-espresso-400 text-sm">
                      <div className="w-4 h-4 border-2 border-espresso-200 border-t-burnt-500 rounded-full animate-spin" />
                      Loading more...
                    </div>
                  ) : page >= totalPages ? (
                    <p className="text-espresso-300 text-sm">You&apos;ve seen everything</p>
                  ) : null}
                </div>
              )}
            </>
          )}

          {/* Mode indicator */}
          {products.length > 0 && (
            <div className="mt-4 text-center">
              <span className="text-xs text-espresso-300">
                {infiniteMode ? '∞ Infinite scroll' : '📄 Paginated'} · {products.length} of {total} shown
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
