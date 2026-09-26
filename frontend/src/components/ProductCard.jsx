import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaBolt, 
  FaEye, 
  FaCheck
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import RatingStars from './RatingStars';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const isLiked = isInWishlist(product._id || product.id);
  const image = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';
  
  // Calculate discount percentage
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isLowStock = product.stock && product.stock <= 5;
  const isNewArrival = product.isFeatured || (product.name && product.name.includes('Edition'));
  const isVintage = product.category === 'vintage-collection' || product.isVintage || product.tags?.includes('vintage');

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const savedUser = localStorage.getItem('vintage_user');
    if (!isAuthenticated && !savedUser) {
      toast.error('Please login to add items to your cart! 🔒');
      navigate('/login');
      return;
    }

    setAdding(true);
    addToCart(product, 1, product.sizes?.[0] || 'M', product.colors?.[0] || 'Standard');
    setTimeout(() => {
      setAdding(false);
    }, 600);
  };

  const handleOpenBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const pId = product._id || product.id;
    try {
      sessionStorage.setItem('vintage_active_buynow', JSON.stringify(product));
    } catch (err) {}

    const savedUser = localStorage.getItem('vintage_user');
    if (!isAuthenticated && !savedUser) {
      toast.error('Please login to buy products! 🔒');
      navigate(`/login?redirect=${encodeURIComponent(`/buy-now?productId=${pId}`)}`);
      return;
    }

    navigate(`/buy-now?productId=${pId}`, { state: { product, productId: pId } });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const savedUser = localStorage.getItem('vintage_user');
    if (!isAuthenticated && !savedUser) {
      toast.error('Please login to save items to your wishlist! 🔒');
      navigate('/login');
      return;
    }

    toggleWishlist(product);
  };

  const handleOpenQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(product));
    e.dataTransfer.setData('text/plain', product._id || product.id);
  };

  return (
    <>
      <div 
        draggable={true}
        onDragStart={handleDragStart}
        className="group relative bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing"
      >
        
        {/* Product Image Link Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 block">
          <Link to={`/product/${product._id || product.id}`} className="w-full h-full block">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              decoding="async"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {isVintage && (
              <span className="bg-gradient-to-r from-amber-600 to-amber-800 text-amber-50 text-[10px] font-black px-2 py-0.5 rounded shadow tracking-wider uppercase border border-amber-400/30">
                ✨ VINTAGE ARCHIVE
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                {discountPercent}% OFF
              </span>
            )}
            {isNewArrival && (
              <span className="bg-amber-500 text-gray-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow uppercase">
                NEW
              </span>
            )}
          </div>

          {/* Action Overlay Buttons (Wishlist & QuickView) */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            {/* Wishlist Heart */}
            <button
              onClick={handleWishlist}
              aria-label="Wishlist"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                isLiked
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/95 text-gray-700 hover:text-rose-500 hover:bg-white'
              }`}
            >
              {isLiked ? <FaHeart className="text-rose-600 animate-pulse" size={15} /> : <FaRegHeart size={15} />}
            </button>

            {/* Quick View */}
            <button
              onClick={handleOpenQuickView}
              aria-label="Quick View"
              title="Quick View"
              className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-rose-600 flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer opacity-90 sm:opacity-0 group-hover:opacity-100"
            >
              <FaEye size={14} />
            </button>
          </div>

          {/* Low stock pill */}
          {isLowStock && (
            <div className="absolute bottom-2 left-2 right-2 bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-bold text-center py-0.5 rounded">
              Only {product.stock} left in stock!
            </div>
          )}
        </div>

        {/* Product Details Area */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
          <div>
            {/* Brand & Category */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold">
              <span>{product.brand || 'Vintage Dreams'}</span>
              <span className="text-rose-600 font-semibold">{product.category}</span>
            </div>

            {/* Product Title */}
            <Link to={`/product/${product._id || product.id}`}>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 hover:text-rose-600 transition-colors mb-1.5 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Rating Stars */}
            <div className="mb-2">
              <RatingStars rating={product.rating || 4.5} count={product.numReviews || 24} size={11} />
            </div>

            {/* Price Section */}
            <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
              <span className="text-base sm:text-lg font-extrabold text-gray-900">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>

          {/* TWO PROMINENT ACTION BUTTONS */}
          <div className="flex flex-col xs:grid xs:grid-cols-2 gap-1.5 pt-2 border-t border-gray-100">
            <button
              onClick={handleQuickAdd}
              type="button"
              disabled={adding}
              className="w-full bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-950 font-bold py-2 sm:py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Add item to shopping cart"
            >
              {adding ? <FaCheck size={11} className="text-emerald-950 animate-bounce" /> : <FaShoppingCart size={11} className="shrink-0" />}
              <span className="font-extrabold whitespace-nowrap">{adding ? 'Added ✓' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleOpenBuyNow}
              type="button"
              className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold py-2 sm:py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-900/20 cursor-pointer"
              title="Instant Purchase"
            >
              <FaBolt size={11} className="shrink-0" />
              <span className="font-extrabold whitespace-nowrap">Buy Now</span>
            </button>
          </div>

        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
