import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FaFilter, 
  FaTimes, 
  FaTh, 
  FaSortAmountDown, 
  FaStar, 
  FaCheck, 
  FaThLarge,
  FaSearch,
  FaUndoAlt,
  FaBoxes,
  FaMagic,
  FaTshirt
} from 'react-icons/fa';
import api from '../api/axios';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import VirtualMirror360 from '../components/VirtualMirror360';
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

const availableFilterSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];

const availableFilterColors = [
  { name: 'Black', hex: '#18181b' },
  { name: 'White', hex: '#f4f4f5' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Wine Red', hex: '#881337' },
  { name: 'Olive Green', hex: '#3f6212' },
  { name: 'Tan Brown', hex: '#9a3412' }
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states from URL
  const category = searchParams.get('category') || 'all';
  const gender = searchParams.get('gender') || 'all';
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';

  const computeFilteredProducts = () => {
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
        p.tags?.some(t => t.toLowerCase().includes(keyword.toLowerCase())) ||
        p.category?.toLowerCase().includes(keyword.toLowerCase()) ||
        p.brand?.toLowerCase().includes(keyword.toLowerCase())
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
    if (selectedSize) {
      filtered = filtered.filter(p => p.sizes?.includes(selectedSize));
    }
    if (selectedColor) {
      filtered = filtered.filter(p => p.colors?.some(c => c.toLowerCase().includes(selectedColor.toLowerCase())));
    }
    if (inStockOnly) {
      filtered = filtered.filter(p => (p.stock || 25) > 0);
    }

    // Sort
    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'popular') {
      filtered.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
    }

    return filtered;
  };

  const [products, setProducts] = useState(computeFilteredProducts);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMirrorOpen, setIsMirrorOpen] = useState(true);
  const [equippedProduct, setEquippedProduct] = useState(null);

  useEffect(() => {
    const handleEquipEvent = (e) => {
      if (e.detail) {
        setEquippedProduct(e.detail);
        setIsMirrorOpen(true);
      }
    };
    window.addEventListener('vintage_equip_item', handleEquipEvent);
    return () => window.removeEventListener('vintage_equip_item', handleEquipEvent);
  }, []);

  const itemsPerPage = 24;

  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const updateFilters = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };
    
    // Clean empty values
    Object.keys(updated).forEach(key => {
      if (!updated[key] || updated[key] === 'all' || updated[key] === 'false') {
        delete updated[key];
      }
    });

    setSearchParams(updated);
    setCurrentPage(1);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setCurrentPage(1);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Gender-filtered categories for sidebar
  const visibleCategories = allCategoriesList.filter((cat) => {
    if (gender === 'all') return true;
    return cat.gender === gender;
  });

  useEffect(() => {
    // Immediately display filtered local products for instant UI response
    setProducts(computeFilteredProducts());
    setCurrentPage(1);

    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.set('limit', '100');
        const res = await api.get(`/products?${params.toString()}`);
        
        if (res.data.success && res.data.products?.length > 0) {
          setProducts(res.data.products);
        }
      } catch (error) {
        // Fallback already rendered instantly
      }
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
              <Link to="/" className="hover:text-rose-600">Home</Link>
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
                ? (gender === 'men' ? "Men's Complete Collection (260+ Items)" : gender === 'women' ? "Women's Complete Collection (260+ Items)" : "All Catalog (520+ Items)") 
                : category.replace('-', ' ')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing <strong className="text-gray-900">{products.length}</strong> handcrafted products
            </p>
          </div>

          {/* Sort & Mobile filter & Try-On button */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsMirrorOpen(!isMirrorOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-950 via-gray-900 to-rose-950 hover:from-black hover:to-rose-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 border border-white/10"
              title="Toggle 360 Virtual Try-On Fitting Room"
            >
              <FaMagic className="text-rose-400" />
              <span>{isMirrorOpen ? 'Close 360° Mirror' : '✨ 360° Try-On Room'}</span>
            </button>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm cursor-pointer"
            >
              <FaFilter />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3.5 py-2 shadow-sm text-xs">
              <FaSortAmountDown className="text-gray-400" />
              <label htmlFor="sort" className="font-semibold text-gray-600">Sort by:</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-transparent font-bold text-gray-900 outline-none cursor-pointer"
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
        {(category !== 'all' || gender !== 'all' || minPrice || maxPrice || rating || keyword || selectedSize || selectedColor || inStockOnly) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
              <FaFilter size={11} className="text-rose-600" /> Active Filters:
            </span>

            {gender !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                <span>{gender === 'men' ? "Men's Wear" : "Women's Wear"}</span>
                <button type="button" onClick={() => updateFilters({ gender: 'all' })} className="hover:text-rose-900 cursor-pointer">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            {category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                <span className="capitalize">{category.replace('-', ' ')}</span>
                <button type="button" onClick={() => updateFilters({ category: 'all' })} className="hover:text-rose-900 cursor-pointer">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            {selectedSize && (
              <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-purple-200">
                <span>Size: {selectedSize}</span>
                <button type="button" onClick={() => updateFilters({ size: '' })} className="hover:text-purple-900 cursor-pointer">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            {selectedColor && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
                <span>Color: {selectedColor}</span>
                <button type="button" onClick={() => updateFilters({ color: '' })} className="hover:text-amber-900 cursor-pointer">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-200">
                <span>{minPrice && maxPrice ? `₹${minPrice} - ₹${maxPrice}` : minPrice ? `Above ₹${minPrice}` : `Under ₹${maxPrice}`}</span>
                <button type="button" onClick={() => updateFilters({ minPrice: '', maxPrice: '' })} className="hover:text-blue-900 cursor-pointer">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            {keyword && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-300">
                <span>Keyword: "{keyword}"</span>
                <button type="button" onClick={() => updateFilters({ keyword: '' })} className="hover:text-gray-950 cursor-pointer">
                  <FaTimes size={10} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold ml-auto hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main 3-Column Layout: Filters (Left), Products (Center), 360 Virtual Mirror (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`hidden lg:block ${isMirrorOpen ? 'lg:col-span-3' : 'lg:col-span-3'} bg-white p-5 rounded-2xl border border-gray-200 shadow-sm sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto slim-scrollbar overscroll-contain space-y-6`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <FaFilter className="text-rose-600" size={13} />
                <span>Filters & Refinements</span>
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Department */}
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
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

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>{gender === 'men' ? "Men's Categories" : gender === 'women' ? "Women's Categories" : "Categories"}</span>
                <span className="text-[10px] text-rose-600 font-semibold">{visibleCategories.length} Categories</span>
              </h4>
              
              <div className="space-y-1.5 max-h-56 overflow-y-auto slim-scrollbar pr-1">
                <button
                  type="button"
                  onClick={() => updateFilters({ category: 'all' })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
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
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
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

            {/* Size Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Filter by Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {availableFilterSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateFilters({ size: selectedSize === s ? '' : s })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'border-rose-600 bg-rose-600 text-white shadow-sm'
                        : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Filter by Color
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableFilterColors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => updateFilters({ color: selectedColor === c.name ? '' : c.name })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                        : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: c.hex }}></span>
                    <span>{c.name}</span>
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
                      onClick={() => updateFilters({ minPrice: isSelected ? '' : p.min, maxPrice: isSelected ? '' : p.max })}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
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
                    onClick={() => updateFilters({ rating: rating === r ? '' : r })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
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

          {/* Product Grid Main Area */}
          <main className={`${isMirrorOpen ? 'lg:col-span-5' : 'lg:col-span-9'}`}>
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm space-y-4">
                <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                  <FaBoxes size={32} />
                </div>
                <h3 className="text-xl font-bold font-serif-title text-gray-900">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  We couldn't find items matching your exact filters. Try resetting filters or exploring popular fashion categories below.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                    Recommended Categories
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['shirts', 'watches', 'rings', 'women-dresses', 'women-sarees'].map(catId => (
                      <button
                        key={catId}
                        type="button"
                        onClick={() => updateFilters({ category: catId })}
                        className="bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold px-4 py-1.5 rounded-full capitalize transition-colors cursor-pointer"
                      >
                        {catId.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className={`grid ${isMirrorOpen ? 'grid-cols-2 gap-3.5 sm:gap-4' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'}`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard 
                      key={product._id || product.id || product.name} 
                      product={product} 
                      onTryOn={(p) => {
                        setEquippedProduct(p);
                        setIsMirrorOpen(true);
                      }}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 bg-white p-4 rounded-2xl shadow-sm">
                    <span className="text-xs text-gray-500">
                      Showing <strong className="text-gray-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong className="text-gray-900 font-bold">{Math.min(currentPage * itemsPerPage, products.length)}</strong> of <strong className="text-gray-900 font-bold">{products.length}</strong> products
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Previous
                      </button>

                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        if (
                          pageNum === 1 || 
                          pageNum === totalPages || 
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                currentPage === pageNum
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                        }
                        return null;
                      })}

                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* 3. Right-Side 360° AI Virtual Try-On Fitting Room (Matching user screenshot) */}
          {isMirrorOpen && (
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <VirtualMirror360 
                isOpen={isMirrorOpen}
                onClose={() => setIsMirrorOpen(false)}
                activeEquippedProduct={equippedProduct}
                onProductEquip={(p) => setEquippedProduct(p)}
              />
            </div>
          )}

        </div>

        {/* Floating 360 Try-On Mirror FAB */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setIsMirrorOpen(!isMirrorOpen)}
            className="bg-gradient-to-r from-gray-950 via-gray-900 to-rose-900 hover:from-black hover:to-rose-800 text-white font-bold py-3 px-5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs uppercase tracking-wider border border-white/20 active:scale-95 transition-all cursor-pointer group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <FaMagic className="text-rose-400 group-hover:rotate-12 transition-transform" />
            <span>{isMirrorOpen ? 'Docked 360° Mirror' : '✨ Open 360° Try-On'}</span>
          </button>
        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex lg:hidden animate-in fade-in duration-200">
          <div className="bg-white w-4/5 max-w-sm h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl ml-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-bold text-sm text-gray-900">Filter Products</span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 cursor-pointer"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Department */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Department</h4>
                <div className="flex flex-col gap-1.5">
                  {['all', 'men', 'women'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        updateFilters({ gender: g });
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold capitalize ${
                        gender === g ? 'bg-rose-600 text-white font-bold' : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {g === 'all' ? 'All Catalog (520+ Items)' : `${g}'s Fashion (260+ Items)`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Size</h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableFilterSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        updateFilters({ size: selectedSize === s ? '' : s });
                        setMobileFilterOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        selectedSize === s ? 'border-rose-600 bg-rose-600 text-white' : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 bg-gray-100 text-gray-800 font-bold py-2.5 rounded-xl text-xs"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
