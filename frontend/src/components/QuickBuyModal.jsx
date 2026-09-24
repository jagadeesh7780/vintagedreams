import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTimes, 
  FaBolt, 
  FaShoppingCart, 
  FaShieldAlt, 
  FaTruck, 
  FaCheck, 
  FaStar 
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import RatingStars from './RatingStars';

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const QuickBuyModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes;
  const colors = product.colors && product.colors.length > 0 ? product.colors : ['Black', 'White', 'Navy Blue', 'Wine Red'];

  const [selectedSize, setSelectedSize] = useState(sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(colors[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);

  const image = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    onClose();
  };

  const handleProceedToCheckout = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
              Quick Buy Options
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-gray-500 shadow-sm transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Product Header Card */}
          <div className="flex gap-4 items-start bg-rose-50/40 p-3.5 rounded-2xl border border-rose-100/60">
            <img
              src={image}
              alt={product.name}
              className="w-20 h-24 object-cover rounded-xl bg-white border border-gray-200 shrink-0"
            />
            <div className="flex-1 truncate">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                {product.brand || 'Vintage Dreams'} · {product.category}
              </span>
              <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mt-0.5 leading-snug">
                {product.name}
              </h4>
              
              {/* Rating & Price */}
              <div className="flex items-center gap-2 mt-1.5">
                <RatingStars rating={product.rating || 4.5} size={11} />
                <span className="text-[11px] text-gray-500">({product.numReviews || 24})</span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-extrabold text-gray-900">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-xs font-bold text-rose-600">{discountPercent}% OFF</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Select Size: <span className="text-rose-600 font-extrabold">{selectedSize}</span>
              </label>
              <span className="text-[11px] text-gray-500 font-medium">All standard sizes in stock</span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedSize === s
                      ? 'border-rose-600 bg-rose-600 text-white shadow-md'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">
              Select Color: <span className="text-rose-600 font-extrabold">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedColor === c
                      ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-100 bg-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Counter */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">Quantity</span>
              <span className="text-[11px] text-emerald-600 font-semibold">In Stock ({product.stock || 25} available)</span>
            </div>

            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-1.5 hover:bg-gray-200 text-gray-800 text-sm font-bold transition-colors"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-bold bg-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3.5 py-1.5 hover:bg-gray-200 text-gray-800 text-sm font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="bg-gray-50 p-3 rounded-xl text-[11px] text-gray-600 flex items-center justify-around text-center">
            <span className="flex items-center gap-1 font-medium">
              <FaTruck className="text-rose-600" /> Free Shipping ₹499+
            </span>
            <span className="flex items-center gap-1 font-medium">
              <FaShieldAlt className="text-emerald-600" /> 100% Genuine
            </span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <FaShoppingCart size={13} />
            <span>ADD TO CART</span>
          </button>

          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-900/20 transition-all"
          >
            <FaBolt size={13} />
            <span>BUY NOW</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuickBuyModal;
