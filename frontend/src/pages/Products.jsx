import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FaFilter, 
  FaTimes, 
  FaTh, 
  FaSortAmountDown, 
  FaStar,
  FaCheck,
  FaMale,
  FaFemale,
  FaThLarge
} from 'react-icons/fa';
import api from '../api/axios';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { fallbackProducts } from '../data/fallbackProducts';

const allCategoriesList = [
  // Men
  { id: 'shirts', label: 'Shirts & Polos (52 items)', gender: 'men' },
  { id: 'pants', label: 'Pants & Cargos (52 items)', gender: 'men' },
  { id: 'shoes', label: 'Shoes & Sneakers (52 items)', gender: 'men' },
  { id: 'watches', label: 'Luxury Watches (52 items)', gender: 'men' },
  { id: 'rings', label: '925 Silver Rings (52 items)', gender: 'men' },

  // Women
  { id: 'women-dresses', label: "Dresses & Gowns (52 items)", gender: 'women' },
  { id: 'women-tops', label: 'Tops & Kurtis (52 items)', gender: 'women' },
  { id: 'women-jewelry', label: 'Fine Jewelry (52 items)', gender: 'women' },
  { id: 'women-sarees', label: 'Silk Sarees (52 items)', gender: 'women' },
  { id: 'women-footwear', label: 'Footwear & Handbags (52 items)', gender: 'women' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states from URL
  const category = searchParams.get('category') || 'all';
  const gender = searchParams.get('gender') || 'all';
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';

  const updateFilters = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };
    
    // Clean empty values
    Object.keys(updated).forEach(key => {
      if (!updated[key] || updated[key] === 'all') {
        delete updated[key];
      }
    });

    setSearchParams(updated);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const clearAllFilters = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Gender-filtered categories for sidebar
  const visibleCategories = allCategoriesList.filter((cat) => {
    if (gender === 'all') return true;
    return cat.gender === gender;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(searchParams);
        params.set('limit', '100'); // Load large batch for complete browsing
        const res = await api.get(`/products?${params.toString()}`);
        
        if (res.data.success && res.data.products?.length > 0) {
          setProducts(res.data.products);
        } else {
          filterFallback();
        }
      } catch (error) {
        filterFallback();
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };

    const filterFallback = () => {
      let filtered = [...fallbackProducts];

      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (gender && gender !== 'all') {
        filtered = filtered.filter(p => p.gender === gender);
      }
      if (keyword) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(keyword.toLowerCase()) || 
          p.tags?.some(t => t.toLowerCase().includes(keyword.toLowerCase()))
        );
      }
      if (minPrice) {
        filtered = filtered.filter(p => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(maxPrice));
      }
      if (rating) {
        filtered = filtered.filter(p => p.rating >= Number(rating));
      }

      // Sort
      if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      setProducts(filtered);
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <CategoryBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb & Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5 font-medium">
              <span>Home</span>
              <span>/</span>
              <span className="text-rose-600 font-semibold uppercase">{category}</span>
              {gender !== 'all' && (
                <>
                  <span>/</span>
                  <span className="text-gray-700 capitalize font-bold">{gender}'s Collection</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 capitalize">
              {keyword 
                ? `Search Results for "${keyword}"` 
                : category === 'all' 
                ? (gender === 'men' ? "Men's Complete Fashion Collection (260+ Items)" : gender === 'women' ? "Women's Complete Fashion Collection (260+ Items)" : "All Catalog (520+ Items)") 
                : category.replace('-', ' ')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing <strong className="text-gray-900">{products.length}</strong> handcrafted products
            </p>
          </div>

          {/* Sort & Mobile filter button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
            >
              <FaFilter />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm text-xs">
              <FaSortAmountDown className="text-gray-400" />
              <label htmlFor="sort" className="font-medium text-gray-600">Sort by:</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-transparent font-semibold text-gray-900 outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="popular">Popularity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips (if any filters applied) */}
        {(category !== 'all' || gender !== 'all' || minPrice || maxPrice || rating || keyword) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
              <FaFilter size={11} className="text-rose-600" /> Active Filters:
            </span>

            {gender !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                <span>{gender === 'men' ? "Men's Wear" : "Women's Wear"}</span>
                <button type="button" onClick={() => updateFilters({ gender: 'all' })} className="hover:text-rose-900">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            {category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                <span className="capitalize">{category.replace('-', ' ')}</span>
                <button type="button" onClick={() => updateFilters({ category: 'all' })} className="hover:text-rose-900">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-200">
                <span>{minPrice && maxPrice ? `₹${minPrice} - ₹${maxPrice}` : minPrice ? `Above ₹${minPrice}` : `Under ₹${maxPrice}`}</span>
                <button type="button" onClick={() => updateFilters({ minPrice: '', maxPrice: '' })} className="hover:text-blue-900">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            {rating && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
                <span>{rating}★ & Above</span>
                <button type="button" onClick={() => updateFilters({ rating: '' })} className="hover:text-amber-900">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            {keyword && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-300">
                <span>Keyword: "{keyword}"</span>
                <button type="button" onClick={() => updateFilters({ keyword: '' })} className="hover:text-gray-950">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold ml-auto hover:underline"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Filter Drawer / Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (Smooth Scrollable Container) */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto slim-scrollbar overscroll-contain space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <FaFilter className="text-rose-600" size={13} />
                <span>Filters & Refinements</span>
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Gender Selection */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Target Department
              </h4>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'all', label: 'All Catalog (520+ Items)' },
                  { id: 'men', label: "Men's Fashion (260+ Items)" },
                  { id: 'women', label: "Women's Fashion (260+ Items)" }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => updateFilters({ gender: g.id })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      gender === g.id
                        ? 'bg-rose-600 text-white shadow-sm font-bold'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{g.label}</span>
                    {gender === g.id && <FaCheck size={11} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender-Aware Categories List (Scrollable Sub-list) */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>{gender === 'men' ? "Men's Categories" : gender === 'women' ? "Women's Categories" : "Categories"}</span>
                <span className="text-[10px] text-rose-600 font-semibold">{visibleCategories.length} Categories</span>
              </h4>
              
              <div className="space-y-1.5 max-h-56 overflow-y-auto slim-scrollbar pr-1">
                <button
                  type="button"
                  onClick={() => updateFilters({ category: 'all' })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    category === 'all'
                      ? 'bg-rose-50 text-rose-600 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>All {gender !== 'all' ? `${gender}'s` : ''} Products</span>
                  {category === 'all' && <FaCheck size={10} />}
                </button>

                {visibleCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateFilters({ category: cat.id, gender: cat.gender })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      category === cat.id
                        ? 'bg-rose-50 text-rose-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {category === cat.id && <FaCheck size={10} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Price Range
              </h4>
              <div className="space-y-1.5">
                {[
                  { label: 'Under ₹500', min: '', max: '500' },
                  { label: '₹500 - ₹1,000', min: '500', max: '1000' },
                  { label: '₹1,000 - ₹2,000', min: '1000', max: '2000' },
                  { label: 'Above ₹2,000', min: '2000', max: '' }
                ].map((p, idx) => {
                  const isSelected = minPrice === p.min && maxPrice === p.max;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateFilters({ minPrice: p.min, maxPrice: p.max })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-rose-50 text-rose-600 font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{p.label}</span>
                      {isSelected && <FaCheck size={10} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Rating */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Customer Rating
              </h4>
              <div className="space-y-1.5">
                {['4', '3'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => updateFilters({ rating: r })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      rating === r
                        ? 'bg-amber-50 text-amber-800 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{r}★ & above</span>
                    {rating === r && <FaCheck size={10} />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <Loader text="Loading fashion catalog..." />
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                  <FaTh size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                  No products matched the active criteria. Try resetting filters to explore all 520+ products.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id || product.name} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile & Tablet Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <FaFilter className="text-rose-600" size={14} />
                <h3 className="font-bold text-sm text-gray-900 uppercase">Filters & Refinements</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-gray-500 shadow-sm"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Scrollable Filters List */}
            <div className="p-5 overflow-y-auto slim-scrollbar flex-1 space-y-6">
              {/* Gender Selection */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Target Department
                </h4>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: 'all', label: 'All Catalog (520+ Items)' },
                    { id: 'men', label: "Men's Fashion (260+ Items)" },
                    { id: 'women', label: "Women's Fashion (260+ Items)" }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => updateFilters({ gender: g.id })}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        gender === g.id
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{g.label}</span>
                      {gender === g.id && <FaCheck size={11} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Categories ({visibleCategories.length})
                </h4>
                <div className="space-y-1.5 max-h-52 overflow-y-auto slim-scrollbar pr-1">
                  <button
                    type="button"
                    onClick={() => updateFilters({ category: 'all' })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                      category === 'all'
                        ? 'bg-rose-50 text-rose-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>All Products</span>
                    {category === 'all' && <FaCheck size={10} />}
                  </button>

                  {visibleCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateFilters({ category: cat.id, gender: cat.gender })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        category === cat.id
                          ? 'bg-rose-50 text-rose-600 font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {category === cat.id && <FaCheck size={10} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Price Range
                </h4>
                <div className="space-y-1.5">
                  {[
                    { label: 'Under ₹500', min: '', max: '500' },
                    { label: '₹500 - ₹1,000', min: '500', max: '1000' },
                    { label: '₹1,000 - ₹2,000', min: '1000', max: '2000' },
                    { label: 'Above ₹2,000', min: '2000', max: '' }
                  ].map((p, idx) => {
                    const isSelected = minPrice === p.min && maxPrice === p.max;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => updateFilters({ minPrice: p.min, maxPrice: p.max })}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-50 text-rose-600 font-bold'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{p.label}</span>
                        {isSelected && <FaCheck size={10} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Customer Rating
                </h4>
                <div className="space-y-1.5">
                  {['4', '3'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateFilters({ rating: r })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        rating === r
                          ? 'bg-amber-50 text-amber-800 font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{r}★ & above</span>
                      {rating === r && <FaCheck size={10} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-3 rounded-xl text-xs"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;

