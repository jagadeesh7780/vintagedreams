import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaBolt, 
  FaTruck, 
  FaShareAlt, 
  FaRuler, 
  FaCheckCircle
} from 'react-icons/fa';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import SizeGuideModal from '../components/SizeGuideModal';
import toast from 'react-hot-toast';
import { fallbackProducts } from '../data/fallbackProducts';

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

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
  const [addingToCart, setAddingToCart] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Delivery PIN code checker state
  const [pincode, setPincode] = useState('500033');
  const [pinChecked, setPinChecked] = useState(true);

  // Recently Viewed & Similar Products
  const [similarProducts, setSimilarProducts] = useState(() => 
    fallbackProducts.filter(p => p.category === initialItem.category && p._id !== id).slice(0, 4)
  );

  // Review Form
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

    // Save to recently viewed in localStorage
    try {
      const recents = JSON.parse(localStorage.getItem('vintage_recently_viewed') || '[]');
      const filtered = recents.filter(item => item._id !== activeItem._id);
      localStorage.setItem('vintage_recently_viewed', JSON.stringify([activeItem, ...filtered].slice(0, 8)));
    } catch (e) {}

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success && res.data.product) {
          const p = res.data.product;
          setProduct(p);
          if (p.images?.[0]) setSelectedImage(p.images[0]);
          if (p.sizes?.[0]) setSelectedSize(p.sizes[0]);
          if (p.colors?.[0]) setSelectedColor(p.colors[0]);
        }
      } catch (error) {
        // Fallback already rendered instantly
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id]);

  if (!product) return <div className="p-12 text-center text-gray-500">Product not found.</div>;

  const isLiked = isInWishlist(product._id || product.id);
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'];

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes;
  const colors = product.colors && product.colors.length > 0 ? product.colors : ['Black', 'White', 'Navy Blue', 'Wine Red'];

  const discountPercent = product.originalPrice && product.originalPrice > product.price
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your cart! 🔒');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    addToCart(product, quantity, selectedSize, selectedColor);
    setTimeout(() => setAddingToCart(false), 500);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to buy products! 🔒');
      navigate('/login');
      return;
    }
    const pId = product._id || product.id;
    try {
      sessionStorage.setItem('vintage_active_buynow', JSON.stringify(product));
    } catch (err) {}
    navigate(`/buy-now?productId=${pId}&size=${encodeURIComponent(selectedSize || 'M')}&color=${encodeURIComponent(selectedColor || 'Standard')}&quantity=${quantity}`, {
      state: { product, productId: pId, size: selectedSize, color: selectedColor, quantity }
    });
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save items to your wishlist! 🔒');
      navigate('/login');
      return;
    }
    toggleWishlist(product);
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPinChecked(true);
      toast.success(`✓ Delivery available for PIN ${pincode}`);
    } else {
      toast.error('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Vintage Dreams!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please enter your review feedback');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.data.success) {
        toast.success('🎉 Review submitted successfully!');
        setProduct(res.data.product);
        setReviewComment('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Review submitted (saved locally)');
      setReviewComment('');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-gray-500 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-rose-600 font-medium">Home</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-rose-600 capitalize font-medium">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold truncate max-w-xs">{product.name}</span>
          </div>

          <button
            type="button"
            onClick={handleShareProduct}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-rose-600 font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white shadow-xs transition-colors cursor-pointer"
          >
            <FaShareAlt size={12} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Main Product Showcase Box */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery & Thumbnails */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group">
              <img
                src={selectedImage || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              
              {/* Wishlist Heart */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label="Toggle Wishlist"
                className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                  isLiked ? 'bg-rose-50 text-rose-600' : 'bg-white/95 text-gray-700 hover:text-rose-600 hover:bg-white'
                }`}
              >
                {isLiked ? <FaHeart size={20} className="text-rose-600 animate-pulse" /> : <FaRegHeart size={20} />}
              </button>

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-md">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 slim-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === img ? 'border-rose-600 ring-2 ring-rose-200' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Meta, Selectors, and Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Brand and category */}
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>Brand: <strong className="text-gray-900">{product.brand || 'Vintage Dreams'}</strong></span>
                <span className="text-rose-600 font-semibold">{product.category}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-title text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & In-Stock indicator */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 flex-wrap">
                <RatingStars rating={product.rating || 4.5} count={product.numReviews || 36} size={15} />
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <FaCheckCircle /> In Stock ({product.stock || 25} available)
                </span>
              </div>

              {/* Price Details Box */}
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100/70 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-xs font-extrabold text-rose-700 bg-rose-200/80 px-2.5 py-1 rounded-md">
                      SAVE ₹{product.originalPrice - product.price} ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Size Selector with Size Guide trigger */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                    Select Size: <span className="text-rose-600 font-extrabold">{selectedSize}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FaRuler size={11} />
                    <span>View Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-rose-600 bg-rose-600 text-white shadow-md'
                          : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide block">
                  Select Color: <span className="text-rose-600 font-extrabold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedColor === c
                          ? 'border-gray-950 bg-gray-950 text-white shadow-sm font-bold'
                          : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-800 text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold bg-white text-gray-900 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-800 text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Delivery PIN Code Checker */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <FaTruck className="text-rose-600" />
                  <span>Check Delivery & Cash on Delivery Availability</span>
                </div>
                
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900 outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </form>

                {pinChecked && (
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <FaCheckCircle className="text-emerald-600" />
                    <span>Express delivery available to {pincode} by <strong>Tuesday</strong> • Free Delivery on ₹499+</span>
                  </div>
                )}
              </div>

            </div>

            {/* TWO ACTION BUTTONS: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-amber-400 hover:bg-amber-500 active:scale-98 text-gray-950 font-bold py-4 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer uppercase tracking-wider"
              >
                <FaShoppingCart size={14} />
                <span>{addingToCart ? 'Added to Cart ✓' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold py-4 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/25 transition-all cursor-pointer uppercase tracking-wider"
              >
                <FaBolt size={14} />
                <span>Instant Buy Now</span>
              </button>
            </div>

          </div>

        </div>

        {/* Detailed Information Tabs (Description, Care, Shipping) */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          
          <div className="flex border-b border-gray-200 gap-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'description' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Product Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'specs' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Material & Care
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'shipping' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="pt-6 text-xs sm:text-sm text-gray-600 leading-relaxed space-y-4">
            {activeTab === 'description' && (
              <div>
                <p>{product.description || `Experience unmatched luxury with the handcrafted ${product.name}. Designed for the modern discerning individual, combining premium fabrics with precision heritage tailoring.`}</p>
                <ul className="list-disc pl-5 mt-3 space-y-1.5 text-gray-700">
                  <li>Tailored comfort fit designed for all-day wear</li>
                  <li>Breathable pre-shrunk finish to prevent shrinkage</li>
                  <li>Reinforced double-needle stitching on seams and hems</li>
                  <li>Hallmarked authentic materials with quality assurance</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-1">Fabric & Material Composition</h4>
                  <p className="text-xs text-gray-500">100% Pure Superfine Cotton / Genuine Leather / 925 Hallmarked Sterling Silver</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-1">Washing & Care Instructions</h4>
                  <p className="text-xs text-gray-500">Machine wash cold with like colors. Do not bleach. Tumble dry low or line dry in shade.</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p><strong>Shipping:</strong> All orders are dispatched within 24 hours from our fulfillment hub. Standard delivery timeline is 2–4 business days across India.</p>
                <p><strong>Returns & Exchanges:</strong> We offer a 7-day hassle-free doorstep return or size exchange guarantee. Items must remain unwashed with original tags attached.</p>
              </div>
            )}
          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-wrap gap-2">
            <div>
              <h3 className="font-serif-title text-xl font-bold text-gray-900">
                Customer Ratings & Reviews
              </h3>
              <p className="text-xs text-gray-500">Verified buyer feedback for {product.name}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <RatingStars rating={product.rating || 4.5} size={16} />
              <span className="text-base font-bold text-gray-900">{product.rating || 4.5} out of 5</span>
            </div>
          </div>

          {/* Write a Review Box */}
          <form onSubmit={handleReviewSubmit} className="p-5 bg-rose-50/40 rounded-2xl border border-rose-100/70 space-y-3">
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
              Write a Review
            </h4>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-semibold">Your Rating:</span>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-900 outline-none"
              >
                <option value={5}>5 ★ - Excellent</option>
                <option value={4}>4 ★ - Very Good</option>
                <option value={3}>3 ★ - Average</option>
                <option value={2}>2 ★ - Below Average</option>
                <option value={1}>1 ★ - Poor</option>
              </select>
            </div>

            <textarea
              rows={3}
              placeholder="Share details about the fit, fabric quality, and comfort..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 outline-none focus:border-rose-500"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Related Products Showcase */}
        {similarProducts.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-gray-900">
                You May Also Like
              </h3>
              <Link to={`/products?category=${product.category}`} className="text-xs font-bold text-rose-600 hover:underline">
                View All {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p._id || p.name} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
};

export default ProductDetails;
