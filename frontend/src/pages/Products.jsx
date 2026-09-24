import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FaFilter, 
  FaTimes, 
  FaTh, 
  FaSortAmountDown, 
  FaStar,
  FaCheck
} from 'react-icons/fa';
import api from '../api/axios';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { fallbackProducts } from '../data/fallbackProducts';

const categoriesList = [
  { id: 'all', label: 'All Categories' },
  { id: 'shirts', label: 'Shirts & Polos' },
  { id: 'pants', label: 'Pants & Cargos' },
  { id: 'shoes', label: 'Shoes & Sneakers' },
  { id: 'watches', label: 'Luxury Watches' },
  { id: 'rings', label: '925 Silver Rings' },
  { id: 'women-dresses', label: "Women's Dresses" },
  { id: 'women-tops', label: 'Tops & Kurtis' },
  { id: 'women-jewelry', label: 'Fine Jewelry' },
  { id: 'women-sarees', label: 'Silk Sarees' }
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
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
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(searchParams).toString();
        const res = await api.get(`/products?${queryParams}`);
        
        if (res.data.success && res.data.products) {
          setProducts(res.data.products);
        } else {
          filterFallback();
        }
      } catch (error) {
        filterFallback();
      } finally {
        setLoading(false);
      }
    };

    const filterFallback = () => {
      let filtered = [...fallbackProducts];

      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (gender && gender !== 'all') {
        filtered = filtered.filter(p => p.gender === gender || p.gender === 'unisex');
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
                  <span className="text-gray-700 capitalize">{gender}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 capitalize">
              {keyword ? `Search Results for "${keyword}"` : category === 'all' ? 'All Fashion Collection' : category.replace('-', ' ')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {products.length} items
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

        {/* Filter Drawer / Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit sticky top-36 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <FaFilter className="text-rose-600" size={13} />
                <span>Filters</span>
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                Clear All
              </button>
            </div>

            {/* Gender Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Gender
              </h4>
              <div className="flex flex-wrap gap-2">
                {['all', 'men', 'women'].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateFilters({ gender: g })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      gender === g
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {g === 'all' ? 'All' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Category
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilters({ category: cat.id })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
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

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Price Range
              </h4>
              <div className="space-y-2">
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
                      onClick={() => updateFilters({ minPrice: p.min, maxPrice: p.max })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between ${
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

            {/* Rating Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Minimum Rating
              </h4>
              <div className="space-y-1.5">
                {['4', '3'].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateFilters({ rating: r })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between ${
                      rating === r
                        ? 'bg-amber-50 text-amber-800 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span>{r}★ & above</span>
                    </span>
                    {rating === r && <FaCheck size={10} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-end lg:hidden">
              <div className="w-80 bg-white h-full p-6 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-base text-gray-900">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                    <FaTimes size={18} />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase mb-2">Category</h4>
                  <div className="space-y-2">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          updateFilters({ category: cat.id });
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                          category === cat.id ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-xs font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loader text="Loading catalog..." />
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                  <FaTh size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                  We couldn't find any products matching your active filters. Try clearing some criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm"
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
          </div>

        </div>

      </div>
    </div>
  );
};

export default Products;
