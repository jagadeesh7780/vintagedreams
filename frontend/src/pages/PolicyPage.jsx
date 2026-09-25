import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaTruck, 
  FaUndoAlt, 
  FaFileContract, 
  FaLock, 
  FaCheckCircle 
} from 'react-icons/fa';

const PolicyPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine active policy tab
  let activeTab = 'shipping';
  if (currentPath.includes('privacy')) activeTab = 'privacy';
  else if (currentPath.includes('terms')) activeTab = 'terms';
  else if (currentPath.includes('return')) activeTab = 'returns';
  else if (currentPath.includes('shipping')) activeTab = 'shipping';

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 mb-8 border-b border-gray-200 no-scrollbar">
          <Link
            to="/shipping"
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'shipping'
                ? 'bg-gray-950 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FaTruck size={13} />
            <span>Shipping Policy</span>
          </Link>

          <Link
            to="/returns"
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'returns'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FaUndoAlt size={13} />
            <span>7-Day Return & Refund Policy</span>
          </Link>

          <Link
            to="/privacy"
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'privacy'
                ? 'bg-gray-950 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FaLock size={12} />
            <span>Privacy Policy</span>
          </Link>

          <Link
            to="/terms"
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'terms'
                ? 'bg-gray-950 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FaFileContract size={13} />
            <span>Terms of Service</span>
          </Link>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-12 shadow-sm text-gray-700 leading-relaxed space-y-6">
          
          {/* 1. Shipping Policy */}
          {activeTab === 'shipping' && (
            <div>
              <div className="flex items-center gap-3 text-emerald-600 mb-3">
                <FaTruck size={24} />
                <span className="text-xs font-black uppercase tracking-widest">Express Courier Network</span>
              </div>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Shipping & Express Delivery Policy
              </h1>

              <div className="space-y-4 text-xs sm:text-sm">
                <p>
                  At <strong>Vintage Dreams</strong>, every apparel piece, vintage jacket, handbag, wristwatch, and jewelry piece is packaged in tamper-proof reinforced boxes with moisture-lock protective wrapping.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 space-y-2">
                  <h4 className="font-bold text-sm">Delivery Timelines Summary</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Free Express Shipping:</strong> Available on all orders above ₹499 across India.</li>
                    <li><strong>Metro Cities (Hyd, BLR, BOM, DEL, MAA):</strong> 2 to 4 business days.</li>
                    <li><strong>Tier 2 & Tier 3 Cities:</strong> 3 to 6 business days.</li>
                    <li><strong>Live Tracking:</strong> Real-time tracking link dispatched via SMS & Email immediately upon dispatch.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. Returns Policy */}
          {activeTab === 'returns' && (
            <div>
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <FaUndoAlt size={24} />
                <span className="text-xs font-black uppercase tracking-widest">100% Customer Satisfaction</span>
              </div>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                7-Day Easy Returns & Exchange Guarantee
              </h1>

              <div className="space-y-4 text-xs sm:text-sm">
                <p>
                  We stand by the craftsmanship of every garment in our store. If you encounter any sizing discrepancy or style preference change, you are protected by our 7-Day Hassle-Free Return Policy.
                </p>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-950 space-y-2">
                  <h4 className="font-bold text-sm">Return Conditions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Items must be unworn, unwashed, and in their original packaging with tags intact.</li>
                    <li>Reverse courier pickup is scheduled directly from your doorstep without extra pickup fees.</li>
                    <li>Refunds are processed within 24–48 hours of quality inspection at our fulfillment hub.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 3. Privacy Policy */}
          {activeTab === 'privacy' && (
            <div>
              <div className="flex items-center gap-3 text-blue-600 mb-3">
                <FaLock size={22} />
                <span className="text-xs font-black uppercase tracking-widest">Data Protection & Privacy</span>
              </div>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Customer Privacy & Security Notice
              </h1>

              <div className="space-y-4 text-xs sm:text-sm">
                <p>
                  Vintage Dreams respects your privacy. We strictly utilize your personal contact details (Name, Delivery Address, Mobile Number, Email) solely for order fulfillment, shipment tracking, and customer support.
                </p>
                <p>
                  We do not sell, rent, or lease customer data to third-party marketing brokers. All financial transactions are securely processed through Razorpay's encrypted gateway; no raw credit card details or bank passwords are ever stored on our servers.
                </p>
              </div>
            </div>
          )}

          {/* 4. Terms of Service */}
          {activeTab === 'terms' && (
            <div>
              <div className="flex items-center gap-3 text-amber-600 mb-3">
                <FaFileContract size={22} />
                <span className="text-xs font-black uppercase tracking-widest">Platform Terms</span>
              </div>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Terms of Service & Usage Agreement
              </h1>

              <div className="space-y-4 text-xs sm:text-sm">
                <p>
                  By browsing, registering an account, or purchasing products on the Vintage Dreams website, you agree to comply with our commercial terms and conditions. All product images, descriptions, brand logos, and digital assets are proprietary property of Vintage Dreams.
                </p>
                <p>
                  Prices are displayed in Indian National Rupees (INR) inclusive of applicable GST taxes. We reserve the right to modify prices or discontinue items based on fabric availability and artisan capacity.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PolicyPage;
