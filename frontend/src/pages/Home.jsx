import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaBolt, 
  FaStar, 
  FaShoppingBag, 
  FaCrown, 
  FaFire,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaAward,
  FaQuoteLeft,
  FaPaperPlane,
  FaCheckCircle,
  FaTag
} from 'react-icons/fa';
import api from '../api/axios';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import { fallbackProducts } from '../data/fallbackProducts';
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
  const [featuredProducts, setFeaturedProducts] = useState(() => fallbackProducts.slice(0, 4));
  const [trendingProducts, setTrendingProducts] = useState(() => fallbackProducts.slice(4, 8));
  const [bestSellers, setBestSellers] = useState(() => fallbackProducts.slice(8, 12));
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
          setBestSellers(allProds.slice(8, 12).length >= 4 ? allProds.slice(8, 12) : allProds.slice(0, 4));
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
      setSubscribed(true);
      toast.success('🎉 Thank you for subscribing to VIP discounts!');
      setNewsletterEmail('');
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      
      {/* Category Strip */}
      <CategoryBar />

      {/* 1. Hero Banner Carousel Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gray-950 via-slate-900 to-rose-950 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d35c73_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-md">
                <FaCrown className="text-amber-400" />
                <span>NEW ARRIVALS 2026 EDITION</span>
              </div>

              <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Discover Your <br />
                <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-200 bg-clip-text text-transparent">
                  Perfect Vintage Style
                </span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Elevate your wardrobe with premium utility shirts, rugged cargo pants, genuine leather watches, pure silk sarees, and 925 sterling silver jewelry.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products?gender=men"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-rose-900/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <FaShoppingBag />
                  <span>Shop Men's Wear</span>
                </Link>

                <Link
                  to="/products?gender=women"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all"
                >
                  <span>Explore Women's</span>
                  <FaArrowRight size={14} />
                </Link>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-center">
                <div>
                  <p className="text-2xl font-bold text-amber-400">100%</p>
                  <p className="text-xs text-gray-400">Pure Fabric</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-rose-400">4.8 ★</p>
                  <p className="text-xs text-gray-400">10k+ Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">FREE</p>
                  <p className="text-xs text-gray-400">Delivery ₹499+</p>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
                  alt="Vintage Dreams Hero Fashion"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
                
                {/* Floating promo badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-xl text-gray-900 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Limited Offer</span>
                    <h4 className="font-bold text-sm">Plaid Utility Shirts & Cargos</h4>
                    <p className="text-xs text-gray-600">Starting from ₹349 only</p>
                  </div>
                  <Link
                    to="/products?category=shirts"
                    className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Featured Collections Split Banners (Men & Women) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Men's Promo */}
          <div className="relative rounded-2xl overflow-hidden shadow-md group h-72 bg-gray-900">
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
              alt="Men Fashion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/50 to-transparent p-8 flex flex-col justify-between">
              <div>
                <span className="bg-amber-500 text-gray-950 text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  Men's Edit
                </span>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white mt-2">
                  Urban Vintage & <br />Classics
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xs">
                  Premium utility shirts, sneakers, leather watches & cargo pants.
                </p>
              </div>

              <Link
                to="/products?gender=men"
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-amber-400 text-xs font-bold px-4 py-2.5 rounded-lg w-max transition-colors"
              >
                <span>EXPLORE MEN</span>
                <FaArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Women's Promo */}
          <div className="relative rounded-2xl overflow-hidden shadow-md group h-72 bg-gray-900">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
              alt="Women Fashion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-950/90 via-rose-950/50 to-transparent p-8 flex flex-col justify-between">
              <div>
                <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  Women's Edit
                </span>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white mt-2">
                  Elegance & Silk <br />Heritage
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xs">
                  A-line midi dresses, Chikankari kurtis, Kanjivaram sarees & fine jewelry.
                </p>
              </div>

              <Link
                to="/products?gender=women"
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-rose-500 hover:text-white text-xs font-bold px-4 py-2.5 rounded-lg w-max transition-colors"
              >
                <span>EXPLORE WOMEN</span>
                <FaArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Featured Products Section (4 Clean Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
              <FaStar />
              <span>HANDPICKED FAVORITES</span>
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
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

      {/* 4. Flash Sale Banner / Deal of the Day */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 bg-black/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
                <FaBolt className="text-amber-300" />
                <span>SPECIAL FESTIVE OFFER — USE CODE VINTAGE10</span>
              </div>
              <h2 className="font-serif-title text-3xl sm:text-4xl font-bold mb-2">
                Up to 60% OFF on Luxury Watches & 925 Silver Rings
              </h2>
              <p className="text-rose-100 text-sm sm:text-base max-w-lg">
                Exclusive hallmarked pure silver rings and genuine leather strap timepieces. Grab yours before stocks run out!
              </p>
            </div>

            <Link
              to="/products?category=watches"
              className="bg-gray-950 hover:bg-black text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 shrink-0"
            >
              SHOP FLASH DEALS
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Trending Picks Section (4 Clean Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
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

      {/* 6. Why Choose Vintage Dreams */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-rose-600 text-xs font-bold uppercase tracking-widest block mb-1">
            THE VINTAGE DREAMS PROMISE
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
            Crafted for Distinction & Longevity
          </h2>
        </div>

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

      {/* 7. Real Customer Testimonials */}
      <section className="bg-gray-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-rose-600 text-xs font-bold uppercase tracking-widest block mb-1">
              CUSTOMER SATISFACTION
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
              Loved by Over 10,000+ Fashion Enthusiasts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm flex flex-col justify-between">
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

      {/* 8. Newsletter Subscription */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-950 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <span className="text-rose-400 text-xs font-bold uppercase tracking-widest">
              JOIN THE VINTAGE DREAMS CLUB
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold">
              Receive 15% OFF On Your Next Order
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Subscribe to get exclusive early access to limited edition drops, secret holiday sales, and curated fashion looks.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-400 outline-none focus:border-rose-500 flex-1"
              />
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
