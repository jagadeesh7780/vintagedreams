import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FaChevronDown
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      {/* Top micro-bar for announcement */}
      <div className="bg-gradient-to-r from-gray-900 via-rose-950 to-gray-900 text-white text-[11px] py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-between">
        <span className="hidden sm:inline">✨ VINTAGE DREAMS — Timeless Fashion & Modern Heritage</span>
        <span className="mx-auto sm:mx-0">🎉 Use code <strong>VINTAGE10</strong> for 10% OFF on orders over ₹999</span>
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
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <FaGem size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-rose-900 to-amber-900 bg-clip-text text-transparent">
                VINTAGE DREAMS
              </span>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase -mt-1 font-semibold">
                Fashion & Luxury
              </span>
            </div>
          </Link>

          {/* Search Bar (Flipkart / Amazon style) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for shirts, cargo, watches, rings, dresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100/80 focus:bg-white text-gray-900 text-sm rounded-full pl-11 pr-24 py-2.5 border border-transparent focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all shadow-inner"
              />
              <FaSearch className="absolute left-4 top-3.5 text-gray-400" size={15} />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Nav Icons & User Section */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors flex flex-col items-center"
              title="Wishlist"
            >
              <FaHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0 right-0 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
              <span className="text-[10px] font-medium hidden sm:inline mt-0.5">Wishlist</span>
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors flex flex-col items-center"
              title="Cart"
            >
              <FaShoppingCart size={20} />
              {totalItemsCount > 0 && (
                <span className="absolute 0 top-0 right-0 bg-rose-600 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              )}
              <span className="text-[10px] font-medium hidden sm:inline mt-0.5">Cart</span>
            </Link>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium text-gray-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline">{user.name?.split(' ')[0]}</span>
                    <FaChevronDown size={10} className="text-gray-400" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <FaBoxOpen size={16} />
                        <span>My Orders</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors font-semibold"
                        >
                          <FaShieldAlt size={16} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/about"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <span>About Us</span>
                      </Link>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <FaSignOutAlt size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-rose-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-block text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-rose-600"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 text-sm rounded-full pl-10 pr-20 py-2 border border-transparent focus:border-rose-500 outline-none"
            />
            <FaSearch className="absolute left-3.5 top-3 text-gray-400" size={14} />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              Search
            </button>
          </form>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-gray-800 hover:bg-rose-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-gray-800 hover:bg-rose-50 rounded-lg"
            >
              All Products
            </Link>
            <Link
              to="/products?gender=men"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-gray-800 hover:bg-rose-50 rounded-lg"
            >
              Men's Fashion
            </Link>
            <Link
              to="/products?gender=women"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-gray-800 hover:bg-rose-50 rounded-lg"
            >
              Women's Fashion
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-gray-800 hover:bg-rose-50 rounded-lg"
            >
              My Orders
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-gray-800 hover:bg-rose-50 rounded-lg"
            >
              About & Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-bold text-amber-700 bg-amber-50 rounded-lg"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
