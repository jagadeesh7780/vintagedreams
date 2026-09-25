import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaGem, 
  FaSearch, 
  FaHeart, 
  FaShoppingCart, 
  FaUserCircle, 
  FaWhatsapp, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt, 
  FaBoxOpen,
  FaShieldAlt,
  FaChevronDown,
  FaFire,
  FaTag,
  FaArrowRight,
  FaUser
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fallbackProducts } from '../data/fallbackProducts';

const popularSearchKeywords = [
  'Utility Shirts',
  'Cargo Pants',
  'Leather Watches',
  '925 Silver Rings',
  'Silk Sarees',
  'Midi Dresses',
  'Chikankari Kurtis',
  'Sneakers'
];

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on page route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSearchFocused(false);
  }, [location.pathname]);

  // Click outside listener for search popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter live search suggestions
  const liveSuggestions = searchTerm.trim().length > 0
    ? fallbackProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchFocused(false);
    }
  };

  const handleSelectSuggestion = (keyword) => {
    setSearchTerm(keyword);
    navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
    setSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-sm transition-all">
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-gray-950 via-rose-950 to-gray-950 text-white text-[11px] py-1.5 px-4 tracking-wide font-medium flex items-center justify-between border-b border-rose-900/30">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-rose-200">
          <FaGem className="text-amber-400" size={12} />
          <span>VINTAGE DREAMS — Timeless Luxury & Handcrafted Heritage</span>
        </span>
        <span className="mx-auto sm:mx-0 font-semibold text-amber-300 flex items-center gap-1">
          <FaTag size={10} />
          <span>Use code <strong>VINTAGE10</strong> for Extra 10% OFF</span>
        </span>
        <a 
          href="https://wa.me/917780597718" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <FaWhatsapp size={13} />
          <span>Support: +91 77805 97718</span>
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-rose-600 hover:bg-gray-100 transition-colors"
          >
            <FaBars size={20} />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <FaGem size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title text-xl font-bold tracking-tight bg-gradient-to-r from-gray-950 via-rose-900 to-amber-900 bg-clip-text text-transparent">
                VINTAGE DREAMS
              </span>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase -mt-1 font-semibold">
                Fashion & Heritage
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-700">
            <Link to="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <Link to="/products?gender=men" className="hover:text-rose-600 transition-colors">
              Men
            </Link>
            <Link to="/products?gender=women" className="hover:text-rose-600 transition-colors">
              Women
            </Link>
            <Link to="/products?sort=newest" className="hover:text-rose-600 transition-colors flex items-center gap-1 text-rose-600">
              <FaFire size={11} />
              <span>New Arrivals</span>
            </Link>
            <Link to="/products" className="hover:text-rose-600 transition-colors">
              Catalog (520+)
            </Link>
          </nav>

          {/* Live Search Bar with Instant Autocomplete */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search shirts, watches, cargo, rings, dresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-gray-100/90 focus:bg-white text-gray-900 text-xs rounded-full pl-10 pr-20 py-2.5 border border-transparent focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all shadow-inner"
              />
              <FaSearch className="absolute left-3.5 top-3 text-gray-400" size={13} />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1 rounded-full transition-colors shadow-sm cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                
                {/* Popular searches pill list when query is short */}
                {searchTerm.trim().length === 0 ? (
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Popular Fashion Searches
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearchKeywords.map((kw) => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => handleSelectSuggestion(kw)}
                          className="bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="text-[11px] font-bold text-gray-500">
                        Matching Results for "{searchTerm}"
                      </span>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <span>View All</span>
                        <FaArrowRight size={9} />
                      </button>
                    </div>

                    {liveSuggestions.length > 0 ? (
                      <div className="space-y-2">
                        {liveSuggestions.map((prod) => (
                          <Link
                            key={prod._id}
                            to={`/product/${prod._id}`}
                            onClick={() => setSearchFocused(false)}
                            className="flex items-center gap-3 p-2 hover:bg-rose-50/50 rounded-xl transition-colors group"
                          >
                            <img
                              src={prod.images?.[0] || prod.image}
                              alt={prod.name}
                              className="w-10 h-12 object-cover rounded-lg bg-gray-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate group-hover:text-rose-600 transition-colors">
                                {prod.name}
                              </p>
                              <span className="text-[10px] text-gray-400 font-semibold uppercase">
                                {prod.category} · ₹{prod.price}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-xs text-gray-500 mb-2">No direct product matches found.</p>
                        <button
                          type="button"
                          onClick={() => handleSelectSuggestion('')}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          Browse Full Catalog (520+ items) →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons (Wishlist, Cart, Account) */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors flex flex-col items-center group"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <FaHeart size={18} className="group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow">
                  {wishlistCount}
                </span>
              )}
              <span className="text-[10px] font-medium hidden sm:inline mt-0.5">Wishlist</span>
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors flex flex-col items-center group"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <FaShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              )}
              <span className="text-[10px] font-medium hidden sm:inline mt-0.5">Cart</span>
            </Link>

            {/* User Account Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-gray-100 transition-colors text-xs font-bold text-gray-800 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline">{user.name?.split(' ')[0]}</span>
                    <FaChevronDown size={9} className="text-gray-400" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in duration-150"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">Signed in as</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{user.name || user.email}</p>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <FaBoxOpen size={14} className="text-gray-400" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <FaHeart size={14} className="text-gray-400" />
                        <span>My Wishlist</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                        >
                          <FaShieldAlt size={14} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <div className="pt-1 mt-1 border-t border-gray-100">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <FaSignOutAlt size={14} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5"
                >
                  <FaUser size={11} />
                  <span>Login</span>
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Slide-in Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex md:hidden animate-in fade-in duration-200">
          <div className="bg-white w-4/5 max-w-sm h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                    <FaGem size={14} />
                  </div>
                  <span className="font-serif-title font-bold text-base text-gray-900">
                    VINTAGE DREAMS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Mobile Search input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search 520+ fashion items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none border border-transparent focus:border-rose-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" size={12} />
              </form>

              {/* Mobile Navigation Links */}
              <nav className="space-y-1 text-sm font-semibold text-gray-800">
                <Link
                  to="/"
                  className="block px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/products?gender=men"
                  className="block px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  Men's Fashion (260+ items)
                </Link>
                <Link
                  to="/products?gender=women"
                  className="block px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  Women's Fashion (260+ items)
                </Link>
                <Link
                  to="/products?sort=newest"
                  className="block px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-rose-600 transition-colors font-bold"
                >
                  🔥 New Arrivals 2026
                </Link>
                <Link
                  to="/products"
                  className="block px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  All Products Catalog (520+)
                </Link>
                <Link
                  to="/wishlist"
                  className="block px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  Wishlist ({wishlistCount})
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  My Orders
                </Link>
              </nav>
            </div>

            {/* Mobile Footer Auth & Support */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={logout}
                  className="w-full bg-rose-50 text-rose-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt />
                  <span>Logout ({user.name})</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <FaUser size={12} />
                  <span>Login / Sign Up</span>
                </Link>
              )}

              <a
                href="https://wa.me/917780597718"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold py-1"
              >
                <FaWhatsapp size={14} />
                <span>WhatsApp Customer Support</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
