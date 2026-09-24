import React from 'react';
import { FaGem, FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaCheck, FaHeart } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Brand Banner */}
        <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-rose-950 text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
            <FaGem size={30} />
          </div>
          <h1 className="font-serif-title text-3xl sm:text-5xl font-bold mb-4">
            The Vintage Dreams Story
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Born from a passion for timeless tailoring and modern urban street aesthetics. We bring discerning shoppers premium men's and women's fashion curated directly from premier artisans and heritage textile mills.
          </p>
        </div>

        {/* Pillars / Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
              01
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Uncompromising Quality</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every shirt, cargo pant, watch, and 925 silver ring undergoes rigorous multi-point fabric and structural inspections.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-3">
              02
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Direct-to-Consumer Value</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              By removing traditional retail markups, we deliver luxury aesthetics and durable fabrics at honest, accessible prices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
              03
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1.5">Customer-First Service</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Instant WhatsApp support, speedy nationwide shipping, and guaranteed 7-day hassle-free exchanges.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Get In Touch
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              We'd Love to Hear From You
            </h2>
            <p className="text-xs text-gray-500 mt-1">Need styling advice, order tracking, or custom queries? Reach out anytime.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            
            <a 
              href="tel:7780597718"
              className="p-5 rounded-2xl bg-gray-50 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 transition-all flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaPhoneAlt size={18} />
              </div>
              <h4 className="font-bold text-sm text-gray-900">Call Us</h4>
              <p className="text-xs text-gray-600 mt-1 font-mono font-semibold">+91 77805 97718</p>
            </a>

            <a 
              href="https://wa.me/917780597718"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 transition-all flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaWhatsapp size={20} />
              </div>
              <h4 className="font-bold text-sm text-gray-900">WhatsApp</h4>
              <p className="text-xs text-gray-600 mt-1 font-mono font-semibold">+91 77805 97718</p>
            </a>

            <a 
              href="mailto:info@vintagedreams.com"
              className="p-5 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaEnvelope size={18} />
              </div>
              <h4 className="font-bold text-sm text-gray-900">Email Support</h4>
              <p className="text-xs text-gray-600 mt-1 truncate max-w-full">info@vintagedreams.com</p>
            </a>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <FaMapMarkerAlt size={18} />
              </div>
              <h4 className="font-bold text-sm text-gray-900">HQ Location</h4>
              <p className="text-xs text-gray-600 mt-1">Hyderabad, India</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
