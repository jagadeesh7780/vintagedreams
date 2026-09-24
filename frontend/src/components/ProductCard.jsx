import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RatingStars from './RatingStars';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);

  const isLiked = isInWishlist(product._id || product.id);
  const image = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';
  
  // Calculate discount percentage
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedSize);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link to={`/product/${product._id || product.id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-50 block">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist"
          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
            isLiked
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-gray-600 hover:text-rose-500 hover:bg-white'
          }`}
        >
          {isLiked ? <FaHeart className="text-rose-600 animate-pulse" size={16} /> : <FaRegHeart size={16} />}
        </button>

        {/* Quick Action Overlay on Desktop */}
        <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-900/95 hover:bg-rose-600 text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-sm transition-colors"
          >
            <FaShoppingCart size={13} />
            <span>Add to Cart</span>
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Gender */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">
            <span>{product.brand || 'Vintage Dreams'}</span>
            <span className="text-rose-600 font-medium">{product.category}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product._id || product.id}`}>
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-rose-600 transition-colors mb-1.5 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mb-2">
            <RatingStars rating={product.rating || 4.5} count={product.numReviews || 24} size={12} />
          </div>
        </div>

        {/* Price Section */}
        <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          
          <Link
            to={`/product/${product._id || product.id}`}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline flex items-center gap-1"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
