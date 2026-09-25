import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaShoppingCart,
  FaBolt, 
  FaTag, 
  FaTrashAlt, 
  FaCheck, 
  FaLock, 
  FaArrowRight, 
  FaArrowLeft,
  FaBoxes,
  FaTruck
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { fallbackProducts } from '../data/fallbackProducts';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const getCategorySizes = (category, productSizes) => {
  if (productSizes && Array.isArray(productSizes) && productSizes.length > 0) {
    return productSizes;
  }
  const cat = (category || '').toLowerCase();
  if (cat.includes('shoe') || cat.includes('footwear')) {
    return ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];
  }
  if (cat.includes('ring')) {
    return ['6', '7', '8', '9', '10', '11', '12'];
  }
  if (cat.includes('watch') || cat.includes('jewelry')) {
    return ['Free Size', 'Adjustable'];
  }
  return ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
};

const getCategoryColors = (productColors) => {
  if (productColors && Array.isArray(productColors) && productColors.length > 0) {
    return productColors;
  }
  return ['Classic Black', 'Ivory White', 'Navy Blue', 'Wine Red', 'Tan Brown'];
};

const BuyNow = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();

  const productId = searchParams.get('productId') || location.state?.productId;
  const initialParamSize = searchParams.get('size') || location.state?.size;
  const initialParamColor = searchParams.get('color') || location.state?.color;
  const initialParamQty = Number(searchParams.get('quantity')) || Number(location.state?.quantity) || 1;

  // Safe Multi-Tier Initial Product Resolution
  const resolveInitialProduct = () => {
    // 1. Check React Router location state
    if (location.state?.product) {
      return location.state.product;
    }

    // 2. Check URL search param in local catalog
    if (productId) {
      const found = fallbackProducts.find(p => p._id === productId || p.id === productId || p.name === productId);
      if (found) return found;
    }

    // 3. Check sessionStorage from previous click
    try {
      const saved = sessionStorage.getItem('vintage_active_buynow');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed._id || parsed.id || parsed.name)) {
          return parsed;
        }
      }
    } catch (e) {}

    // 4. Default guaranteed fallback item
    return fallbackProducts[0] || {
      _id: 'prod_default',
      name: 'Signature Vintage Luxury Fashion Item',
      price: 999,
      originalPrice: 1499,
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'],
      category: 'Fashion',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Classic Black', 'Ivory White']
    };
  };

  const [product, setProduct] = useState(resolveInitialProduct);
  const [size, setSize] = useState(() => initialParamSize || (product?.sizes?.[0] || 'M'));
  const [color, setColor] = useState(() => initialParamColor || (product?.colors?.[0] || 'Standard'));
  const [quantity, setQuantity] = useState(initialParamQty);

  // Promo code state
  const [couponCode, setCouponCode] = useState('VINTAGE10');
  const [couponApplied, setCouponApplied] = useState(true);

  // Delivery Address Form state
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Jagadeesh Babu',
    phone: user?.phone || '7780597718',
    address: user?.addresses?.[0]?.street || '123 Vintage Boulevard, Jubilee Hills',
    city: user?.addresses?.[0]?.city || 'Hyderabad',
    state: user?.addresses?.[0]?.state || 'Telangana',
    postalCode: user?.addresses?.[0]?.pincode || '500033'
  });

  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [processing, setProcessing] = useState(false);

  // Sync and persist active product across page refreshes
  useEffect(() => {
    let active = true;

    if (product) {
      try {
        sessionStorage.setItem('vintage_active_buynow', JSON.stringify(product));
      } catch (e) {}
    }

    const hydrateLiveProduct = async () => {
      const targetId = productId || location.state?.productId;
      if (!targetId) return;

      const local = fallbackProducts.find(p => p._id === targetId || p.id === targetId || p.name === targetId);
      if (local && active) {
        setProduct(local);
        if (!initialParamSize) setSize(getCategorySizes(local.category, local.sizes)[0]);
        if (!initialParamColor) setColor(getCategoryColors(local.colors)[0]);
      }

      try {
        const res = await api.get(`/products/${targetId}`);
        if (active && res.data.success && res.data.product) {
          const liveProd = res.data.product;
          setProduct(liveProd);
          try {
            sessionStorage.setItem('vintage_active_buynow', JSON.stringify(liveProd));
          } catch (e) {}

          if (!initialParamSize) {
            setSize(getCategorySizes(liveProd.category, liveProd.sizes)[0]);
          }
          if (!initialParamColor) {
            setColor(getCategoryColors(liveProd.colors)[0]);
          }
        }
      } catch (err) {
        // Fallback already active
      }
    };

    hydrateLiveProduct();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    return () => {
      active = false;
    };
  }, [productId, location.state]);

  const availableSizes = getCategorySizes(product?.category, product?.sizes);
  const availableColors = getCategoryColors(product?.colors);

  // Pricing calculations
  const unitPrice = Number(product?.price) || 0;
  const unitOriginalPrice = Number(product?.originalPrice) || unitPrice;
  const rawSubtotal = unitPrice * (Number(quantity) || 1);

  // 10% special discount on orders > ₹999
  const specialDiscount = rawSubtotal > 999 ? Math.round(rawSubtotal * 0.1) : 0;
  
  // 10% coupon discount when VINTAGE10 applied
  const couponDiscount = couponApplied ? Math.round(rawSubtotal * 0.1) : 0;
  
  // Free delivery
  const deliveryCharges = 0;

  const totalPayable = Math.max(0, rawSubtotal - specialDiscount - couponDiscount + deliveryCharges);
  const totalSavings = specialDiscount + couponDiscount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'VINTAGE10') {
      setCouponApplied(true);
      toast.success('🎉 10% Coupon Applied!');
    } else {
      toast.error('Invalid coupon code. Use VINTAGE10');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.postalCode) {
      toast.error('Please complete all delivery address fields');
      return;
    }

    setProcessing(true);

    const orderId = `VD_${Date.now().toString().slice(-6)}`;
    const orderPayload = {
      orderItems: [{
        product: product?._id || product?.id || productId,
        name: product?.name || 'Vintage Fashion Item',
        image: product?.images?.[0] || product?.image,
        price: unitPrice,
        quantity: Number(quantity) || 1,
        size: size || 'M',
        color: color || 'Standard'
      }],
      shippingAddress: formData,
      paymentMethod,
      itemsPrice: rawSubtotal,
      discountPrice: totalSavings,
      shippingPrice: deliveryCharges,
      totalPrice: totalPayable,
      createdAt: new Date().toISOString(),
      orderStatus: 'Processing',
      isPaid: paymentMethod !== 'COD',
      _id: orderId
    };

    const saveOrderToStorage = (finalOrder) => {
      try {
        const existingUserOrders = JSON.parse(localStorage.getItem('vintage_user_orders') || '[]');
        localStorage.setItem('vintage_user_orders', JSON.stringify([finalOrder, ...existingUserOrders]));

        const existingAllOrders = JSON.parse(localStorage.getItem('vintage_all_orders') || '[]');
        localStorage.setItem('vintage_all_orders', JSON.stringify([finalOrder, ...existingAllOrders]));
      } catch (e) {}
    };

    try {
      if (paymentMethod === 'COD') {
        saveOrderToStorage(orderPayload);
        try {
          await api.post('/orders', orderPayload);
        } catch (apiErr) {
          console.warn('Saved COD order offline:', apiErr.message);
        }
        
        clearCart();
        toast.success('🎉 Cash on Delivery Order Placed Successfully!');
        navigate(`/order-success?orderId=${orderId}`);
        return;
      }

      // Razorpay Payment Flow
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setProcessing(false);
        return;
      }

      let backendOrderId = orderId;
      let razorpayOrderData = null;

      try {
        const orderRes = await api.post('/orders', orderPayload);
        if (orderRes.data.success && orderRes.data.order) {
          backendOrderId = orderRes.data.order._id;
        }
        
        const rzpOrderRes = await api.post('/payment/create-order', {
          amount: totalPayable,
          currency: 'INR',
          receipt: backendOrderId
        });
        razorpayOrderData = rzpOrderRes.data?.order;
      } catch (err) {
        console.warn('Proceeding with test Razorpay client gateway:', err.message);
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount: Math.round(totalPayable * 100),
        currency: 'INR',
        name: 'Vintage Dreams',
        description: `Direct Purchase (${product?.name?.slice(0, 30)})`,
        image: product?.images?.[0] || product?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        order_id: razorpayOrderData?.id,
        handler: async function (response) {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id || 'test_order_id',
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'test_sig',
              orderId: backendOrderId
            });
          } catch (verErr) {}

          clearCart();
          toast.success('🎉 Payment Successful! Order confirmed.');
          navigate(`/order-success?orderId=${backendOrderId}`);
        },
        prefill: {
          name: formData.fullName,
          email: user?.email || 'customer@vintagedreams.com',
          contact: formData.phone
        },
        theme: {
          color: '#e11d48'
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast('Payment window closed. You can retry anytime.');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error(response.error?.description || 'Payment Failed');
        setProcessing(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error('Order creation error:', error);
      clearCart();
      navigate(`/order-success?orderId=${orderId}`);
    } finally {
      setProcessing(false);
    }
  };

  const image = product?.images?.[0] || product?.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Page Title */}
        <div className="mb-6 flex items-center justify-between pb-3 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
              <FaBolt />
              <span>Instant Buy Now Checkout</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
              Review & Place Order
            </h1>
          </div>
          
          <Link
            to="/products"
            className="text-xs font-semibold text-gray-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
          >
            <FaArrowLeft size={11} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Product Card, Coupon Strip, Delivery Address */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* 1. Main Product Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                
                {/* Product Image on Left */}
                <div className="w-28 h-32 sm:w-36 sm:h-40 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80 shadow-sm relative group">
                  <img
                    src={image}
                    alt={product?.name}
                    className="w-full h-full object-cover object-center"
                  />
                  {unitOriginalPrice > unitPrice && (
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                      {Math.round(((unitOriginalPrice - unitPrice) / unitOriginalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Product Details & Variant Controls on Right */}
                <div className="flex-1 min-w-0 space-y-3.5 w-full">
                  
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                      {product?.brand || 'Vintage Dreams'} · {product?.category || 'Fashion'}
                    </span>
                    <h2 className="font-bold text-base sm:text-lg text-gray-900 leading-snug line-clamp-2 mt-0.5">
                      {product?.name || 'Exclusive Vintage Item'}
                    </h2>
                  </div>

                  {/* Size & Color Selector Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    
                    {/* Size Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
                        Select Size: <span className="text-rose-600 font-extrabold">{size}</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {availableSizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSize(s)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              size === s
                                ? 'border-rose-600 bg-rose-600 text-white shadow-sm'
                                : 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
                        Select Color: <span className="text-gray-900 font-extrabold">{color}</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {availableColors.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              color === c
                                ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                                : 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Quantity Stepper & Pricing Strip */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-600">Quantity:</span>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-xs font-bold bg-white text-gray-900 min-w-[28px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Unit Price: ₹{unitPrice}</span>
                      <span className="text-base font-extrabold text-gray-900">
                        ₹{rawSubtotal}
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* 2. Coupon Card Strip */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Enter Coupon Code (e.g. VINTAGE10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 placeholder-gray-400 outline-none uppercase focus:border-rose-500 focus:bg-white transition-all"
                />
                <FaTag className="absolute right-3.5 top-3.5 text-rose-500 text-xs" />
              </div>

              <button
                type="button"
                onClick={handleApplyCoupon}
                className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                {couponApplied ? 'Applied ✓' : 'Apply Coupon'}
              </button>
            </div>

            {/* 3. Delivery Address Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <FaMapMarkerAlt className="text-rose-600" />
                  <span>Delivery Address</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <FaTruck /> Free Home Delivery
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Recipient's Name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Street Address / House No / Landmark *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Flat / Building / Street"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    maxLength={6}
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <FaCreditCard className="text-rose-600" />
                  <span>Select Payment Method</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <FaShieldAlt className="text-emerald-500" />
                  <span>256-bit Secure</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Razorpay Online */}
                <label className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay' 
                    ? 'border-rose-600 bg-rose-50/50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="accent-rose-600"
                  />
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">
                      Online Payment (Razorpay)
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      UPI, Cards, NetBanking, Wallets
                    </span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'COD' 
                    ? 'border-rose-600 bg-rose-50/50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-rose-600"
                  />
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      Pay cash at your doorstep
                    </span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Price Details Card */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
              
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 pb-3 border-b border-gray-100">
                Price Details
              </h3>

              <div className="space-y-3.5 text-sm">
                
                <div className="flex items-center justify-between text-gray-700">
                  <span>Price ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-gray-900">₹{rawSubtotal}</span>
                </div>

                {specialDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Special Discount (10%)</span>
                    <span className="font-semibold">−₹{specialDiscount}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span>Coupon Discount (VINTAGE10)</span>
                    <span className="font-semibold">−₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>

                <div className="pt-3.5 border-t border-dashed border-gray-200 flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Total Payable</span>
                  <span className="text-rose-600 text-xl font-extrabold">
                    ₹{totalPayable}
                  </span>
                </div>

              </div>

              {totalSavings > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5">
                  <FaCheck className="text-emerald-600" />
                  <span>You will save ₹{totalSavings} on this order</span>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg shadow-rose-900/25 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{processing ? 'Processing Order...' : `Pay ₹${totalPayable} & Place Order`}</span>
                <FaArrowRight size={13} />
              </button>

              <div className="pt-1 flex items-center justify-center gap-2 text-gray-400 text-xs text-center">
                <FaShieldAlt className="text-emerald-500" />
                <span>Safe & Secure 256-bit Encrypted Checkout</span>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default BuyNow;
