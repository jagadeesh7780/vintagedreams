import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTrashAlt, 
  FaShoppingBag, 
  FaArrowRight, 
  FaShieldAlt, 
  FaTag, 
  FaCheck
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { 
    cartItems, 
    totalItemsCount, 
    subtotal, 
    discount, 
    deliveryCharge, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'VINTAGE10') {
      const extraDiscount = Math.round(subtotal * 0.1);
      setCouponDiscount(extraDiscount);
      setCouponApplied(true);
      toast.success('🎉 10% Extra Discount Applied!');
    } else {
      toast.error('Invalid coupon code. Try VINTAGE10');
    }
  };

  const finalTotal = Math.max(0, totalPrice - couponDiscount);
  const totalSavings = discount + couponDiscount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-5">
            <FaShoppingBag size={32} />
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Looks like you haven't added anything to your cart yet. Explore our handcrafted collections!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-rose-900/20 transition-all"
          >
            <span>START SHOPPING</span>
            <FaArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
          <div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
              Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Review items before proceeding to checkout</p>
          </div>
          
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => {
              const itemId = item._id || item.product?._id || item.product;
              const productRefId = item.product?._id || item.product || item._id;

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Link to={`/product/${productRefId}`} className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div>
                      <Link
                        to={`/product/${productRefId}`}
                        className="font-semibold text-gray-900 text-sm sm:text-base hover:text-rose-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>Size: <strong className="text-gray-800">{item.size || 'M'}</strong></span>
                        {item.color && (
                          <span>Color: <strong className="text-gray-800">{item.color}</strong></span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base font-bold text-gray-900">₹{item.price}</span>
                        <span className="text-xs text-gray-400">× {item.quantity || 1} =</span>
                        <span className="text-sm font-extrabold text-rose-600">
                          ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(itemId, (item.quantity || 1) - 1)}
                        className="px-3 py-1 hover:bg-gray-200 text-gray-800 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-3.5 py-1 text-xs font-bold bg-white">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(itemId, (item.quantity || 1) + 1)}
                        className="px-3 py-1 hover:bg-gray-200 text-gray-800 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(itemId)}
                      className="text-gray-400 hover:text-rose-600 p-2 transition-colors"
                      title="Remove item"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Coupon Code Strip */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (Try: VINTAGE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="w-full uppercase text-xs font-bold bg-gray-50 rounded-xl px-4 py-3 border border-gray-300 outline-none focus:border-rose-500"
                  />
                  <FaTag className="absolute right-3.5 top-3.5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  disabled={couponApplied || !couponCode}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold transition-colors ${
                    couponApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}
                >
                  {couponApplied ? 'Applied ✓' : 'Apply Coupon'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Price Summary (Flipkart Style) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-36 space-y-5">
              
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 pb-3 border-b border-gray-100">
                Price Details
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Price ({totalItemsCount} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Special Discount</span>
                    <span className="font-semibold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Coupon (VINTAGE10)</span>
                    <span className="font-semibold">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-gray-900'}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-dashed border-gray-200 flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-rose-600 text-lg font-extrabold">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {totalSavings > 0 && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold p-2.5 rounded-lg text-center flex items-center justify-center gap-1.5">
                  <FaCheck />
                  <span>You will save ₹{totalSavings.toLocaleString()} on this order!</span>
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>PROCEED TO CHECKOUT</span>
                <FaArrowRight size={14} />
              </button>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-xs text-center">
                <FaShieldAlt className="text-emerald-500" />
                <span>Safe & Secure 256-bit Encrypted Checkout</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
