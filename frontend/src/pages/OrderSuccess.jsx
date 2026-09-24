import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaBoxOpen, FaTruck, FaHome } from 'react-icons/fa';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || `VD_${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-[80vh] bg-[#f8f9fa] flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12 text-center">
        
        {/* Animated Checkmark Circle */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-6 shadow-inner animate-bounce">
          <FaCheckCircle size={44} />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Payment & Order Confirmed
        </span>

        <h1 className="font-serif-title text-3xl font-bold text-gray-900 mt-3 mb-2">
          Thank You For Your Order!
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-md mx-auto">
          We've received your order and our master tailors & dispatch team are preparing it for shipment.
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Order Reference ID:</span>
            <span className="font-mono font-bold text-gray-900">{orderId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Estimated Delivery:</span>
            <span className="font-semibold text-emerald-600">3 - 5 Business Days</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Order Confirmation Email:</span>
            <span className="font-medium text-gray-800">Sent to your registered email</span>
          </div>
        </div>

        {/* Order Status Tracker */}
        <div className="border-t border-gray-100 pt-6 mb-8">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 text-left">
            Delivery Progression
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-1 shadow">
                ✓
              </div>
              <span className="text-[10px] font-bold text-emerald-700">Confirmed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold mb-1">
                2
              </div>
              <span className="text-[10px] text-gray-500">Packaging</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold mb-1">
                3
              </div>
              <span className="text-[10px] text-gray-500">In Transit</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold mb-1">
                4
              </div>
              <span className="text-[10px] text-gray-500">Delivered</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <FaBoxOpen size={14} />
            <span>View My Orders</span>
          </Link>
          <Link
            to="/products"
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-rose-900/20"
          >
            <FaShoppingBag size={14} />
            <span>Continue Shopping</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
