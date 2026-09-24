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
  };

  const clearAllFilters = () => {
    setSearchParams({});
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
                Reset All
              </button>
            </div>

            {/* Gender Selection */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Target Gender
              </h4>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'all', label: 'All Catalog (520+ Items)' },
                  { id: 'men', label: "Men's Collection Only (260+ Items)" },
                  { id: 'women', label: "Women's Collection Only (260+ Items)" }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => updateFilters({ gender: g.id })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      gender === g.id
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{g.label}</span>
                    {gender === g.id && <FaCheck size={11} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender-Aware Categories List */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>{gender === 'men' ? "Men's Categories" : gender === 'women' ? "Women's Categories" : "Categories"}</span>
                <span className="text-[10px] text-gray-400 font-normal">50+ each</span>
              </h4>
              
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                <button
                  onClick={() => updateFilters({ category: 'all' })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between ${
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
                    onClick={() => updateFilters({ category: cat.id, gender: cat.gender })}
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

            {/* Customer Rating */}
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
                    <span>{r}★ & above</span>
                    {rating === r && <FaCheck size={10} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loader text="Loading fashion catalog..." />
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                  <FaTh size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                  No products matched the active criteria. Try resetting filters to explore all 520+ products.
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
