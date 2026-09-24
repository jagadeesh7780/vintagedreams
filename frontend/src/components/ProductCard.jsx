import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaBolt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RatingStars from './RatingStars';
import QuickBuyModal from './QuickBuyModal';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);

  const isLiked = isInWishlist(product._id || product.id);
  const image = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';
  
  // Calculate discount percentage
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes?.[0] || 'M', product.colors?.[0] || 'Standard');
  };

  const handleOpenBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickBuyOpen(true);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
        
        {/* Product Image Link */}
        <Link to={`/product/${product._id || product.id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-100 block">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-md">
              {discountPercent}% OFF
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlist}
            aria-label="Wishlist"
            className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              isLiked
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/95 text-gray-600 hover:text-rose-500 hover:bg-white'
            }`}
          >
            {isLiked ? <FaHeart className="text-rose-600 animate-pulse" size={16} /> : <FaRegHeart size={16} />}
          </button>
        </Link>

        {/* Product Details Area */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
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
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-base sm:text-lg font-extrabold text-gray-900">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>

          {/* TWO PROMINENT ACTION BUTTONS (ADD TO CART & BUY NOW) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleQuickAdd}
              type="button"
              className="w-full bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-950 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="Add item to shopping cart"
            >
              <FaShoppingCart size={12} className="shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            <button
              onClick={handleOpenBuyNow}
              type="button"
              className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-900/20"
              title="Buy Now (Select Size & Color)"
            >
              <FaBolt size={12} className="shrink-0" />
              <span className="truncate">Buy Now</span>
            </button>
          </div>

        </div>
      </div>

      {/* Quick Buy Information & Variant Selector Modal */}
      <QuickBuyModal
        product={product}
        isOpen={quickBuyOpen}
        onClose={() => setQuickBuyOpen(false)}
      />
    </>
  );
};

export default ProductCard;
