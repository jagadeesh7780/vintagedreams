import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaBolt, 
  FaStar, 
  FaCrown, 
  FaFire,
  FaShieldAlt, 
  FaTruck, 
  FaUndoAlt, 
  FaAward, 
  FaPaperPlane, 
  FaCheckCircle, 
  FaTag,
  FaBars,
  FaTimes,
  FaHeart,
  FaUser,
  FaSearch,
  FaShoppingBag
} from 'react-icons/fa';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { fallbackProducts } from '../data/fallbackProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const customerReviews = [
  {
    id: 1,
    name: 'Aarav Mehta',
    location: 'Mumbai',
    rating: 5,
    title: 'Flawless Plaid Utility Shirt',
    comment: 'The fabric quality on the heavy cotton utility shirt is exceptional. Fits true to size, thick stitching, and arrived in 2 days.',
    verified: true,
    item: 'The Souled Store Plaid Utility Shirt'
  },
  {
    id: 2,
    name: 'Pooja Sharma',
    location: 'Bangalore',
    rating: 5,
    title: 'Exquisite Silk Heritage Saree',
    comment: 'Ordered the Kanjivaram zari silk saree for a family wedding. The sheen and gold border work got so many compliments!',
    verified: true,
    item: 'Pure Kanjivaram Zari Silk Saree'
  },
  {
    id: 3,
    name: 'Rohan Verma',
    location: 'Delhi NCR',
    rating: 5,
    title: 'Genuine Leather Strap Watch',
    comment: 'Minimalist champagne dial with real leather band. Looks significantly more luxurious than its price. Highly recommended.',
    verified: true,
    item: 'LOUIS DEVIN Luxury Analog Watch'
  }
];

const Home = () => {
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const vintageProducts = fallbackProducts.filter(p => p.category === 'vintage-collection' || p.tags?.includes('vintage')).slice(0, 8);
  const [featuredProducts, setFeaturedProducts] = useState(() => fallbackProducts.slice(0, 4));
  const [trendingProducts, setTrendingProducts] = useState(() => fallbackProducts.slice(4, 8));
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const res = await api.get('/products?limit=16');
        if (res.data.success && res.data.products?.length > 0) {
          const allProds = res.data.products;
          const feat = allProds.filter(p => p.isFeatured);
          const finalFeat = feat.length >= 4 
            ? feat.slice(0, 4) 
            : [...feat, ...allProds.filter(p => !p.isFeatured)].slice(0, 4);

          setFeaturedProducts(finalFeat);
          setTrendingProducts(allProds.slice(4, 8).length >= 4 ? allProds.slice(4, 8) : allProds.slice(0, 4));
        }
      } catch (error) {
        // Keeps instant offline fallback
      }
    };

    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      toast.success('🎉 Thank you for subscribing to VIP discounts!');
      setNewsletterEmail('');
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900">
      
      {/* 1. TOP HERO CANVAS WITH EDITORIAL 3-COLUMN LAYOUT */}
      <section className="bg-[#D4D4D6] pt-8 sm:pt-12 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-12 transition-all">
        {/* Hero Content: 3-Column / Asymmetric Layout */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column: Bold Typography & Shop Now Button (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 sm:space-y-8 text-center lg:text-left items-center lg:items-start">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-bold text-black leading-[1.05] tracking-tight font-sans">
              Where<br className="hidden lg:block" />
              {' '}Style<br className="hidden lg:block" />
              {' '}Meets<br className="hidden lg:block" />
              {' '}Elegance
            </h1>

            <div>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-2.5 sm:py-3.5 rounded-full border-[1.8px] sm:border-[2px] border-black text-black font-bold text-sm sm:text-lg tracking-tight bg-transparent hover:bg-black hover:text-white transition-all duration-300 shadow-sm active:scale-95 group"
              >
                <span>Shop Now</span>
              </Link>
            </div>
          </div>

          {/* Center Column: Iconic Arch Portrait (col-span-4) */}
          <div className="lg:col-span-4 flex justify-center items-end">
            <div className="w-full max-w-[260px] xs:max-w-[300px] sm:max-w-[340px] lg:max-w-none h-[320px] xs:h-[380px] sm:h-[460px] lg:h-[540px] rounded-t-full overflow-hidden shadow-sm bg-neutral-300 relative group">
              <img
                src="/images/hero-arch.jpg"
                alt="Woman in green floral dress and sun hat"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <Link 
                to="/products?category=women-dresses" 
                className="absolute inset-0"
                aria-label="Shop Summer Dresses"
              />
            </div>
          </div>

          {/* Right Column: Two Cards (Side-by-side 2-col on mobile, stacked on desktop) */}
          <div className="w-full max-w-[360px] sm:max-w-[500px] lg:max-w-none mx-auto lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-4 lg:gap-6 justify-between">
            
            {/* Top Card: Pink Floral Dress */}
            <div className="h-[130px] xs:h-[155px] sm:h-[210px] lg:h-[258px] rounded-[16px] sm:rounded-[26px] overflow-hidden shadow-sm bg-neutral-300 relative group">
              <img
                src="/images/hero-top-right.jpg"
                alt="Fashion model in chic floral dress"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <Link 
                to="/products?category=women-dresses" 
                className="absolute inset-0"
                aria-label="Shop New Arrivals"
              />
            </div>

            {/* Bottom Card: Meadow Wildflower Summer Dress */}
            <div className="h-[130px] xs:h-[155px] sm:h-[210px] lg:h-[258px] rounded-[16px] sm:rounded-[26px] overflow-hidden shadow-sm bg-neutral-300 relative group">
              <img
                src="/images/hero-bottom-right.jpg"
                alt="Vintage fashion in flower meadow"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <Link 
                to="/products?category=vintage-collection" 
                className="absolute inset-0"
                aria-label="Shop Vintage Archive"
              />
            </div>

          </div>

        </div>

      </section>

      {/* 3. CATEGORY HIGHLIGHT CURATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <Link
            to="/products?category=vintage-collection"
            className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-sm bg-stone-900 p-5 flex flex-col justify-between"
          >
            <img
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80"
              alt="Vintage Archive"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                Archive
              </span>
              <FaArrowRight className="text-white transform group-hover:translate-x-1 transition-transform" size={12} />
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg sm:text-xl font-serif-title">Vintage Archive</h3>
              <p className="text-stone-300 text-xs">Distressed jackets & rare corduroy</p>
            </div>
          </Link>

          <Link
            to="/products?gender=women"
            className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-sm bg-rose-950 p-5 flex flex-col justify-between"
          >
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
              alt="Women Collection"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                Women's
              </span>
              <FaArrowRight className="text-white transform group-hover:translate-x-1 transition-transform" size={12} />
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg sm:text-xl font-serif-title">Elegance Dresses</h3>
              <p className="text-rose-200 text-xs">Silk sarees & midi gowns</p>
            </div>
          </Link>

          <Link
            to="/products?gender=men"
            className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-sm bg-slate-900 p-5 flex flex-col justify-between"
          >
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80"
              alt="Men's Utility Wear"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-white text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                Men's
              </span>
              <FaArrowRight className="text-white transform group-hover:translate-x-1 transition-transform" size={12} />
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg sm:text-xl font-serif-title">Utility & Cargos</h3>
              <p className="text-slate-300 text-xs">Plaid shirts & heavy cotton pants</p>
            </div>
          </Link>

          <Link
            to="/products?category=watches"
            className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-sm bg-neutral-900 p-5 flex flex-col justify-between"
          >
            <img
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
              alt="Luxury Watches & Jewelry"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-amber-300 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                Luxury
              </span>
              <FaArrowRight className="text-white transform group-hover:translate-x-1 transition-transform" size={12} />
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg sm:text-xl font-serif-title">Watches & Rings</h3>
              <p className="text-amber-200 text-xs">925 sterling silver & leather bands</p>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">
              <FaStar className="text-amber-400" />
              <span>HANDPICKED FAVORITES</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-neutral-900">
              Featured Products
            </h2>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id || product.id || product.name} product={product} />
          ))}
        </div>
      </section>

      {/* 5. DISCOUNT & FLASH SALE SECTION (Anchor: #discounts) */}
      <section id="discounts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-neutral-900 via-stone-900 to-black rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 backdrop-blur-sm border border-white/10">
                <FaBolt className="text-amber-300" />
                <span>SPECIAL FESTIVE DISCOUNT — USE CODE VINTAGE10</span>
              </div>
              <h2 className="font-serif-title text-3xl sm:text-4xl font-bold mb-2">
                Up to 60% OFF On Curated Luxury & Vintage Drops
              </h2>
              <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Handcrafted cotton utility shirts, genuine leather watches, pure silk sarees, and hallmarked 925 sterling silver jewelry.
              </p>
            </div>

            <Link
              to="/products"
              className="bg-white hover:bg-amber-400 text-black font-bold text-sm px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 shrink-0"
            >
              SHOP DISCOUNTED DROPS
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TRENDING BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
              <FaFire />
              <span>TRENDING NOW</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
              Best Sellers of the Week
            </h2>
          </div>

          <Link
            to="/products?sort=popular"
            className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
          >
            <span>Explore Trending</span>
            <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id || product.id || product.name} product={product} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS / TESTIMONIALS (Anchor: #reviews) */}
      <section id="reviews" className="bg-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest block mb-1">
              CUSTOMER SATISFACTION
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
              Loved by Over 10,000+ Fashion Lovers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FaCheckCircle size={9} /> Verified Buyer
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-gray-900">"{rev.title}"</h4>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-gray-900">{rev.name}</p>
                    <p className="text-[10px] text-gray-400">{rev.location}</p>
                  </div>
                  <span className="text-[10px] text-rose-600 font-semibold max-w-[120px] truncate text-right">
                    {rev.item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE VINTAGE DREAMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center font-bold">
              <FaAward size={22} />
            </div>
            <h3 className="font-bold text-sm text-gray-900">100% Genuine Fabrics</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Breathable pure cotton, genuine leather, and hallmarked 925 sterling silver with zero compromises.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center font-bold">
              <FaTruck size={22} />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Fast & Free Shipping</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Free nationwide delivery on all orders over ₹499 with real-time package tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold">
              <FaUndoAlt size={22} />
            </div>
            <h3 className="font-bold text-sm text-gray-900">7-Day Easy Returns</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Hassle-free size exchange and doorstep return pickup if the fit isn't 100% perfect.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center font-bold">
              <FaShieldAlt size={22} />
            </div>
            <h3 className="font-bold text-sm text-gray-900">256-Bit SSL Secure Pay</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Encrypted Razorpay payments with support for UPI, Cards, NetBanking, and Cash on Delivery.
            </p>
          </div>

        </div>
      </section>

      {/* 9. NEWSLETTER SUBSCRIPTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-neutral-900 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <span className="text-neutral-400 text-xs font-bold uppercase tracking-widest">
              JOIN THE VINTAGE DREAMS CLUB
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold">
              Receive 15% OFF On Your Next Order
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm">
              Subscribe to get exclusive early access to limited edition drops, secret discount sales, and curated fashion looks.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-400 outline-none focus:border-white flex-1"
              />
              <button
                type="submit"
                className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Subscribe</span>
                <FaPaperPlane size={11} />
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
