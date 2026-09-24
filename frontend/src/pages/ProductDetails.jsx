import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaBolt, 
  FaTruck, 
  FaShieldAlt, 
  FaUndoAlt, 
  FaStar,
  FaCheck,
  FaShareAlt,
  FaWhatsapp
} from 'react-icons/fa';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { fallbackProducts } from '../data/fallbackProducts';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const getInitialProduct = (targetId) => {
    return fallbackProducts.find(p => p._id === targetId || p.name === targetId) || fallbackProducts[0];
  };

  const initialItem = getInitialProduct(id);
  const [product, setProduct] = useState(initialItem);
  const [selectedImage, setSelectedImage] = useState(initialItem?.images?.[0] || initialItem?.image || '');
  const [selectedSize, setSelectedSize] = useState(initialItem?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(initialItem?.colors?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState(() => 
    fallbackProducts.filter(p => p.category === initialItem.category && p._id !== id).slice(0, 4)
  );
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const activeItem = getInitialProduct(id);
    setProduct(activeItem);
    setSelectedImage(activeItem?.images?.[0] || activeItem?.image || '');
    setSelectedSize(activeItem?.sizes?.[0] || 'M');
    setSelectedColor(activeItem?.colors?.[0] || 'Standard');
    setSimilarProducts(fallbackProducts.filter(p => p.category === activeItem.category && p._id !== id).slice(0, 4));

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success && res.data.product) {
          setupProduct(res.data.product);
          fetchSimilar(res.data.product.category);
        }
      } catch (error) {
        // Fallback already rendered instantly
      }
    };

    const setupProduct = (p) => {
      setProduct(p);
      if (!selectedImage) setSelectedImage(p.images?.[0] || p.image || '');
    };

    const fetchSimilar = async (category) => {
      try {
        const res = await api.get(`/products?category=${category}&limit=4`);
        if (res.data.success && res.data.products?.length > 0) {
          setSimilarProducts(res.data.products.filter(p => p._id !== id));
        }
      } catch (e) {
        // Fallback already rendered
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id]);

  if (!product) return <div className="p-12 text-center">Product not found.</div>;

  const isLiked = isInWishlist(product._id || product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please enter review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.data.success) {
        toast.success('Review submitted!');
        setProduct(res.data.product);
        setReviewComment('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-rose-600">Home</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-rose-600 capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isLiked ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-gray-700 hover:text-rose-600'
                }`}
              >
                {isLiked ? <FaHeart size={20} className="text-rose-600" /> : <FaRegHeart size={20} />}
              </button>

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail previews */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img ? 'border-rose-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Buy Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {product.brand || 'Vintage Dreams'}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  In Stock ({product.stock || 20} left)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 mt-2 leading-snug">
                {product.name}
              </h1>

              {/* Rating & Reviews summary */}
              <div className="flex items-center gap-3 mt-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                  <span>{product.rating || 4.5}</span>
                  <FaStar size={11} />
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {product.numReviews || 24} Verified Ratings & Reviews
                </span>
              </div>

              {/* Price Breakdown (Flipkart Style) */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-bold text-rose-600">{discountPercent}% off</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Inclusive of all taxes</p>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Select Size
                    </label>
                    <span className="text-xs text-rose-600 underline font-semibold cursor-pointer">
                      Size Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-11 h-11 px-3 rounded-lg text-xs font-bold border transition-all ${
                          selectedSize === s
                            ? 'border-rose-600 bg-rose-600 text-white shadow-md'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">
                    Select Color: <span className="text-rose-600">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
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
              )}

              {/* Quantity */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Delivery Assurance & Highlights */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200/80 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <FaTruck className="text-rose-600 mb-1" size={18} />
                  <span className="text-[11px] font-bold text-gray-800">Free Delivery</span>
                  <span className="text-[10px] text-gray-500">Orders ₹499+</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaUndoAlt className="text-rose-600 mb-1" size={18} />
                  <span className="text-[11px] font-bold text-gray-800">7-Day Return</span>
                  <span className="text-[10px] text-gray-500">Easy Exchange</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaShieldAlt className="text-rose-600 mb-1" size={18} />
                  <span className="text-[11px] font-bold text-gray-800">100% Original</span>
                  <span className="text-[10px] text-gray-500">Quality Verified</span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Flipkart Style: Add to Cart + Buy Now) */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <FaShoppingCart size={16} />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-rose-900/20 flex items-center justify-center gap-2 transition-all"
              >
                <FaBolt size={16} />
                <span>BUY NOW</span>
              </button>
            </div>

          </div>

        </div>

        {/* Customer Reviews & Add Review Section */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
          <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Customer Reviews ({product.reviews?.length || 0})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900">{rev.userName}</span>
                      <RatingStars rating={rev.rating} size={11} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">
                  No reviews written yet. Be the first to review this product!
                </p>
              )}
            </div>

            {/* Write Review Form */}
            <div className="lg:col-span-5 bg-rose-50/50 p-5 rounded-xl border border-rose-100">
              <h4 className="font-bold text-sm text-gray-900 mb-3">Write a Review</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-medium"
                  >
                    <option value="5">5 ★ - Exceptional Quality</option>
                    <option value="4">4 ★ - Very Good</option>
                    <option value="3">3 ★ - Average</option>
                    <option value="2">2 ★ - Below Expectations</option>
                    <option value="1">1 ★ - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Your Feedback</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with fit, fabric, and styling..."
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-rose-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-lg shadow transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Similar Products Carousel */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="font-serif-title text-xl font-bold text-gray-900 mb-6">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
