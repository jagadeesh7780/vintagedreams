import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTrashAlt, 
  FaShoppingBag, 
  FaArrowRight, 
  FaShieldAlt, 
  FaTag, 
  FaCheck,
  FaHeart,
  FaBoxes
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
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
  const { addToWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to view or manage your shopping cart', { id: 'cart-auth-req' });
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [isAuthenticated, navigate]);

  const [couponCode, setCouponCode] = useState('VINTAGE10');
  const [couponApplied, setCouponApplied] = useState(true);

  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, subtotal - discount - couponDiscount + deliveryCharge);
  const totalSavings = discount + couponDiscount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'VINTAGE10') {
      setCouponApplied(true);
      toast.success('🎉 10% Extra Discount Applied!');
    } else {
      toast.error('Invalid coupon code. Try VINTAGE10');
    }
  };

  const handleMoveToWishlist = (item) => {
    const itemId = item._id || item.product?._id || item.product;
    addToWishlist({
      _id: item.product?._id || item.product || item._id,
      name: item.name,
      price: item.price,
      images: [item.image],
      category: item.category || 'Fashion'
    });
    removeFromCart(itemId);
    toast.success('Moved to Wishlist ❤️');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center max-w-md w-full space-y-4">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <FaShoppingBag size={32} />
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-gray-900">
            Your Cart is Waiting
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our handcrafted vintage collections and start shopping!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-rose-900/20 transition-all text-xs uppercase tracking-wider"
          >
            <span>Start Shopping Now</span>
            <FaArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading & Controls */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
          <div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
              Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Review items before proceeding to checkout</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              to="/products"
              className="text-xs font-semibold text-gray-600 hover:text-rose-600 hidden sm:inline"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
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
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Link to={`/product/${productRefId}`} className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${productRefId}`}
                        className="font-bold text-gray-900 text-sm sm:text-base hover:text-rose-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>Size: <strong className="text-gray-900 font-bold">{item.size || 'M'}</strong></span>
                        {item.color && (
                          <span>Color: <strong className="text-gray-900 font-bold">{item.color}</strong></span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base font-extrabold text-gray-900">₹{item.price}</span>
                        <span className="text-xs text-gray-400">× {item.quantity || 1} =</span>
                        <span className="text-sm font-extrabold text-rose-600">
                          ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(itemId, (item.quantity || 1) - 1)}
                        className="px-3 py-1 hover:bg-gray-200 text-gray-800 text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3.5 py-1 text-xs font-bold bg-white text-gray-900">{item.quantity || 1}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(itemId, (item.quantity || 1) + 1)}
                        className="px-3 py-1 hover:bg-gray-200 text-gray-800 text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMoveToWishlist(item)}
                      className="text-gray-400 hover:text-rose-600 p-2 transition-colors cursor-pointer"
                      title="Move to Wishlist"
                    >
                      <FaHeart size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromCart(itemId)}
                      className="text-gray-400 hover:text-rose-600 p-2 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <FaTrashAlt size={15} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Coupon Code Strip */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm">
              <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (VINTAGE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full uppercase text-xs font-bold bg-gray-50 rounded-xl px-4 py-3 border border-gray-300 outline-none focus:border-rose-500 pr-10"
                  />
                  <FaTag className="absolute right-3.5 top-3.5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                    couponApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}
                >
                  {couponApplied ? (
                    <>
                      <span>Applied</span>
                      <FaCheck size={11} />
                    </>
                  ) : (
                    <span>Apply Coupon</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Price Summary Card */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
              
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 pb-3 border-b border-gray-100">
                Price Details
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Price ({totalItemsCount} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Special Discount (₹999+)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Coupon ({couponCode})</span>
                    <span className="font-semibold">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>

                <div className="pt-3.5 border-t border-dashed border-gray-200 flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-rose-600 text-xl font-extrabold">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {totalSavings > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5">
                  <FaCheck className="text-emerald-600" />
                  <span>You will save ₹{totalSavings.toLocaleString()} on this order!</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate('/buy-now')}
                className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm uppercase tracking-wide"
              >
                <span>PROCEED TO CHECKOUT</span>
                <FaArrowRight size={13} />
              </button>

              <div className="pt-1 flex items-center justify-center gap-2 text-gray-400 text-xs text-center">
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
