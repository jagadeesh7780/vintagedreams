import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTimes, 
  FaBolt, 
  FaShoppingCart, 
  FaHeart, 
  FaRegHeart, 
  FaShieldAlt, 
  FaTruck, 
  FaUndoAlt, 
  FaArrowRight, 
  FaRuler 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RatingStars from './RatingStars';
import SizeGuideModal from './SizeGuideModal';
import toast from 'react-hot-toast';

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  if (!isOpen || !product) return null;

  const isLiked = isInWishlist(product._id || product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'];

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes;
  const colors = product.colors && product.colors.length > 0 ? product.colors : ['Black', 'White', 'Navy Blue', 'Wine Red'];

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your cart! 🔒');
      onClose();
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    addToCart(product, quantity, selectedSize, selectedColor);
    setTimeout(() => {
      setAddingToCart(false);
      onClose();
    }, 400);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to buy products! 🔒');
      onClose();
      navigate('/login');
      return;
    }
    const pId = product._id || product.id;
    try {
      sessionStorage.setItem('vintage_active_buynow', JSON.stringify(product));
    } catch (err) {}
    onClose();
    navigate(`/buy-now?productId=${pId}&size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(selectedColor)}&quantity=${quantity}`, {
      state: { product, productId: pId, size: selectedSize, color: selectedColor, quantity }
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Quick Product Preview
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-gray-500 shadow-sm transition-colors cursor-pointer"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Modal Grid */}
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 slim-scrollbar">
            
            {/* Left: Images */}
            <div className="space-y-3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                <img
                  src={images[selectedImgIdx] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-md shadow">
                    {discountPercent}% OFF
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                    isLiked ? 'bg-rose-50 text-rose-600' : 'bg-white/95 text-gray-700 hover:text-rose-600'
                  }`}
                >
                  {isLiked ? <FaHeart size={18} className="text-rose-600" /> : <FaRegHeart size={18} />}
                </button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImgIdx === idx ? 'border-rose-600 ring-2 ring-rose-200' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info and Selectors */}
            <div className="space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                    <span>{product.brand || 'Vintage Dreams'}</span>
                    <span className="text-rose-600">{product.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-snug">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <RatingStars rating={product.rating || 4.5} count={product.numReviews || 36} size={13} />
                    <span className="text-xs text-emerald-600 font-semibold">• In Stock</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 p-3 bg-rose-50/40 rounded-xl border border-rose-100/60">
                  <span className="text-2xl font-extrabold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                      <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                        Save ₹{product.originalPrice - product.price}
                      </span>
                    </>
                  )}
                </div>

                {/* Size Selector with Size Guide trigger */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Size: <span className="text-rose-600 font-extrabold">{selectedSize}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-[11px] text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FaRuler size={10} />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedSize === s
                            ? 'border-rose-600 bg-rose-600 text-white shadow-sm'
                            : 'border-gray-200 text-gray-700 bg-white hover:border-gray-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wide block mb-2">
                    Color: <span className="text-rose-600 font-extrabold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedColor === c
                            ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                            : 'border-gray-200 text-gray-700 bg-white hover:border-gray-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1 text-gray-800 text-sm font-bold hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1 text-xs font-bold bg-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-1 text-gray-800 text-sm font-bold hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full bg-amber-400 hover:bg-amber-500 active:scale-98 text-gray-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <FaShoppingCart size={13} />
                    <span>{addingToCart ? 'Added ✓' : 'Add to Cart'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-900/20 transition-all cursor-pointer"
                  >
                    <FaBolt size={13} />
                    <span>Buy Now</span>
                  </button>
                </div>

                <Link
                  to={`/product/${product._id || product.id}`}
                  onClick={onClose}
                  className="w-full py-2.5 text-center text-xs font-bold text-gray-600 hover:text-rose-600 block transition-colors"
                >
                  View Full Product Details →
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />
    </>
  );
};

export default QuickViewModal;
