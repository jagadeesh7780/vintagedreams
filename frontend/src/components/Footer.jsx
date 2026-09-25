import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGem, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebook, 
  FaTwitter,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaLock
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-amber-400 flex items-center justify-center mb-3">
              <FaTruck size={22} />
            </div>
            <h4 className="font-semibold text-white text-sm">Free Express Shipping</h4>
            <p className="text-xs text-gray-400 mt-1">On all orders above ₹499</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-emerald-400 flex items-center justify-center mb-3">
              <FaShieldAlt size={22} />
            </div>
            <h4 className="font-semibold text-white text-sm">100% Genuine Products</h4>
            <p className="text-xs text-gray-400 mt-1">Direct from certified artisans</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-rose-400 flex items-center justify-center mb-3">
              <FaUndoAlt size={22} />
            </div>
            <h4 className="font-semibold text-white text-sm">7-Day Easy Returns</h4>
            <p className="text-xs text-gray-400 mt-1">Hassle-free replacement policy</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-blue-400 flex items-center justify-center mb-3">
              <FaLock size={22} />
            </div>
            <h4 className="font-semibold text-white text-sm">Secure Razorpay Payments</h4>
            <p className="text-xs text-gray-400 mt-1">256-bit SSL encrypted checkout</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white">
                <FaGem size={18} />
              </div>
              <span className="font-serif-title text-xl font-bold text-white tracking-wide">
                VINTAGE DREAMS
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
              Curated luxury vintage and contemporary apparel for men and women. We merge classic heritage tailoring with modern streetwear.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://wa.me/917780597718" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <FaFacebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Explore Store
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-rose-400 transition-colors">Home</Link></li>
              <li><Link to="/products?category=vintage-collection" className="hover:text-amber-400 font-bold transition-colors text-amber-300">✨ Vintage Collection (90s)</Link></li>
              <li><Link to="/products" className="hover:text-rose-400 transition-colors">All Products (500+)</Link></li>
              <li><Link to="/products?gender=men" className="hover:text-rose-400 transition-colors">Men's Fashion</Link></li>
              <li><Link to="/products?gender=women" className="hover:text-rose-400 transition-colors">Women's Fashion</Link></li>
              <li><Link to="/orders" className="hover:text-rose-400 transition-colors">Track Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-rose-400 transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-rose-400 transition-colors">Help Center & FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-rose-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/shipping" className="hover:text-rose-400 transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-rose-400 transition-colors">7-Day Easy Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-rose-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-rose-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="hover:text-rose-400 transition-colors">About Vintage Dreams</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Direct Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <FaPhoneAlt className="text-rose-500 mt-1 shrink-0" size={14} />
                <a href="tel:7780597718" className="hover:text-white transition-colors font-medium">+91 77805 97718</a>
              </li>
              <li className="flex items-start gap-2.5">
                <FaWhatsapp className="text-emerald-500 mt-1 shrink-0" size={15} />
                <a href="https://wa.me/917780597718" target="_blank" rel="noreferrer" className="hover:text-white transition-colors font-medium">+91 77805 97718</a>
              </li>
              <li className="flex items-start gap-2.5">
                <FaEnvelope className="text-rose-500 mt-1 shrink-0" size={14} />
                <a href="mailto:info@vintagedreams.com" className="hover:text-white transition-colors truncate">info@vintagedreams.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-rose-500 mt-1 shrink-0" size={14} />
                <span>Jubilee Hills, Hyderabad, India</span>
              </li>
              <li className="pt-2">
                <Link to="/contact" className="inline-block bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors border border-white/10">
                  Send Message Form →
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
        <p>&copy; {new Date().getFullYear()} Vintage Dreams. All rights reserved.</p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
          <span>·</span>
          <Link to="/shipping" className="hover:text-gray-300 transition-colors">Shipping</Link>
          <span>·</span>
          <Link to="/returns" className="hover:text-gray-300 transition-colors">Returns</Link>
          <span>·</span>
          <Link to="/faq" className="hover:text-gray-300 transition-colors">FAQ</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
