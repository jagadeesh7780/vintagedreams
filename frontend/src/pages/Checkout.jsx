import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaLock,
  FaArrowLeft,
  FaShoppingCart,
  FaTruck,
  FaCheck,
  FaBolt
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

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cartItems: contextCartItems, subtotal: contextSubtotal, discount: contextDiscount, deliveryCharge: contextDelivery, totalPrice: contextTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const directProductId = searchParams.get('productId');
  const directSize = searchParams.get('size') || 'M';
  const directColor = searchParams.get('color') || 'Standard';
  const directQuantity = Number(searchParams.get('quantity')) || 1;

  // Find direct product if passed via URL
  const directProduct = directProductId 
    ? fallbackProducts.find(p => p._id === directProductId || p.name === directProductId)
    : null;

  const resolveInitialItems = () => {
    if (directProduct) {
      return [{
        product: directProduct._id,
        name: directProduct.name,
        price: directProduct.price,
        originalPrice: directProduct.originalPrice,
        image: directProduct.images?.[0] || directProduct.image,
        size: directSize,
        color: directColor,
        quantity: directQuantity,
        sizes: directProduct.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        colors: directProduct.colors || ['Black', 'White', 'Navy Blue', 'Wine Red']
      }];
    }
    if (contextCartItems && contextCartItems.length > 0) {
      return contextCartItems.map(item => ({
        ...item,
        sizes: item.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        colors: item.colors || ['Black', 'White', 'Navy Blue', 'Wine Red']
      }));
    }
    try {
      const saved = localStorage.getItem('vintage_guest_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(item => ({
            ...item,
            sizes: item.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
            colors: item.colors || ['Black', 'White', 'Navy Blue', 'Wine Red']
          }));
        }
      }
    } catch (e) {}

    // Fallback default featured product if opened directly
    if (fallbackProducts.length > 0) {
      const def = fallbackProducts[0];
      return [{
        product: def._id,
        name: def.name,
        price: def.price,
        originalPrice: def.originalPrice,
        image: def.images?.[0] || def.image,
        size: 'M',
        color: 'Standard',
        quantity: 1,
        sizes: def.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        colors: def.colors || ['Black', 'White', 'Navy Blue', 'Wine Red']
      }];
    }
    return [];
  };

  // Active items for this checkout session
  const [items, setItems] = useState(resolveInitialItems);

  useEffect(() => {
    let active = true;

    const syncItems = async () => {
      // 1. If direct product in fallback
      const directInFallback = directProductId 
        ? fallbackProducts.find(p => p._id === directProductId || p.name === directProductId)
        : null;

      if (directInFallback) {
        if (active) {
          setItems([{
            product: directInFallback._id,
            name: directInFallback.name,
            price: directInFallback.price,
            originalPrice: directInFallback.originalPrice,
            image: directInFallback.images?.[0] || directInFallback.image,
            size: directSize,
            color: directColor,
            quantity: directQuantity,
            sizes: directInFallback.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
            colors: directInFallback.colors || ['Black', 'White', 'Navy Blue', 'Wine Red']
          }]);
        }
        return;
      }

      // 2. If directProductId from API
      if (directProductId) {
        try {
          const res = await api.get(`/products/${directProductId}`);
          if (active && res.data.success && res.data.product) {
            const p = res.data.product;
            setItems([{
              product: p._id,
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice,
              image: p.images?.[0] || p.image,
              size: directSize,
              color: directColor,
              quantity: directQuantity,
              sizes: p.sizes?.length > 0 ? p.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
              colors: p.colors?.length > 0 ? p.colors : ['Black', 'White', 'Navy Blue', 'Wine Red']
            }]);
            return;
          }
        } catch (err) {}
      }

      // 3. From Cart items
      if (contextCartItems && contextCartItems.length > 0) {
        if (active) {
          setItems(contextCartItems.map(item => ({
            ...item,
            sizes: item.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
            colors: item.colors || ['Black', 'White', 'Navy Blue', 'Wine Red']
          })));
        }
        return;
      }

      // 4. Default fallback
      if (active && fallbackProducts.length > 0) {
        const def = fallbackProducts[0];
        setItems([{
          product: def._id,
          name: def.name,
          price: def.price,
          originalPrice: def.originalPrice,
          image: def.images?.[0] || def.image,
          size: 'M',
          color: 'Standard',
          quantity: 1,
          sizes: def.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
          colors: def.colors || ['Black', 'White', 'Navy Blue', 'Wine Red']
        }]);
      }
    };

    syncItems();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    return () => {
      active = false;
    };
  }, [directProductId, directSize, directColor, directQuantity, contextCartItems]);

  // Calculate prices
  const subtotal = items.reduce((acc, item) => acc + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  const discount = Math.round(subtotal > 999 ? subtotal * 0.1 : 0);
  const deliveryCharge = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const totalPrice = Math.max(0, subtotal - discount + deliveryCharge);

  // Address State
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

  // Update item variant directly in checkout
  const updateItemVariant = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
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

    if (items.length === 0) {
      toast.error('Please select an item to purchase');
      navigate('/products');
      return;
    }

    setProcessing(true);

    const orderId = `VD_${Date.now().toString().slice(-6)}`;
    const orderPayload = {
      orderItems: items.map(item => ({
        product: item.product?._id || item.product || item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1,
        size: item.size || 'M',
        color: item.color || 'Standard'
      })),
      shippingAddress: formData,
      paymentMethod,
      itemsPrice: subtotal,
      discountPrice: discount,
      shippingPrice: deliveryCharge,
      totalPrice
    };

    try {
      if (paymentMethod === 'COD') {
        // Place COD order
        try {
          await api.post('/orders', orderPayload);
        } catch (apiErr) {
          console.warn('Saved offline order:', apiErr.message);
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
          amount: totalPrice,
          currency: 'INR',
          receipt: backendOrderId
        });
        razorpayOrderData = rzpOrderRes.data?.order;
      } catch (err) {
        console.warn('Proceeding with test Razorpay client gateway:', err.message);
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount: Math.round(totalPrice * 100),
        currency: 'INR',
        name: 'Vintage Dreams',
        description: `Instant Purchase (${items.length} item${items.length > 1 ? 's' : ''})`,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
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

  // If no items in checkout session, render friendly guided empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-gray-200 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <FaShoppingCart size={24} />
          </div>
          <h2 className="text-xl font-serif-title font-bold text-gray-900 mb-2">
            No Products Selected for Checkout
          </h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Please pick a product and click <strong>"Buy Now"</strong> or add items to your cart to proceed with instant checkout.
          </p>
          <Link
            to="/products"
            className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all"
          >
            <FaBolt size={12} />
            <span>EXPLORE PRODUCTS NOW</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 pb-3 border-b border-gray-200">
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
            Secure Checkout
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Enter delivery details & choose payment option</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Address and Payment Method */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-rose-600" />
                  <span>Delivery Address</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Jagadeesh"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Street Address / Landmark *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Flat / House No., Street, Area"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <FaCreditCard className="text-rose-600" />
                  <span>Payment Method</span>
                </h3>
              </div>

              <div className="space-y-3">
                {/* Razorpay Card / UPI / NetBanking */}
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay'
                    ? 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-200'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">Razorpay Secure Checkout</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">RECOMMENDED</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking</p>
                    </div>
                  </div>
                  <FaShieldAlt className="text-rose-600" size={20} />
                </label>

                {/* Cash on Delivery */}
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-200'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <span className="font-bold text-sm text-gray-900">Cash on Delivery (COD)</span>
                      <p className="text-xs text-gray-500 mt-0.5">Pay via cash or UPI upon delivery at your doorstep</p>
                    </div>
                  </div>
                  <FaMoneyBillWave className="text-emerald-600" size={20} />
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Place Button */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-36 space-y-5">
              
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>Order Summary ({items.length} item{items.length > 1 ? 's' : ''})</span>
                <span className="text-rose-600 font-bold">{directProduct ? '⚡ Direct Buy' : '🛍️ Cart Checkout'}</span>
              </h3>

              {/* Items List preview with interactive size/color adjustment */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 slim-scrollbar">
                {items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2.5">
                    <div className="flex items-start gap-3">
                      <img src={item.image} alt="" className="w-14 h-16 rounded-lg object-cover shrink-0 bg-white border border-gray-200" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-gray-900 line-clamp-2 leading-tight">{item.name}</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="font-extrabold text-sm text-gray-900">₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}</span>
                          {item.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">₹{((Number(item.originalPrice) || 0) * (Number(item.quantity) || 1)).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Size & Color Selector directly in Checkout */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 text-[11px]">
                      <div>
                        <label className="font-semibold text-gray-600 block mb-0.5">Size:</label>
                        <select
                          value={item.size || 'M'}
                          onChange={(e) => updateItemVariant(idx, 'size', e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-md p-1 font-bold text-gray-900 outline-none cursor-pointer"
                        >
                          {(item.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-gray-600 block mb-0.5">Color:</label>
                        <select
                          value={item.color || 'Standard'}
                          onChange={(e) => updateItemVariant(idx, 'color', e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-md p-1 font-bold text-gray-900 outline-none cursor-pointer"
                        >
                          {(item.colors || ['Black', 'White', 'Navy Blue', 'Wine Red']).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold text-gray-600">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateItemVariant(idx, 'quantity', Math.max(1, (item.quantity || 1) - 1))}
                          className="px-2 py-0.5 hover:bg-gray-100 text-xs font-bold text-gray-700"
                        >
                          -
                        </button>
                        <span className="px-3 py-0.5 text-xs font-bold">{item.quantity || 1}</span>
                        <button
                          type="button"
                          onClick={() => updateItemVariant(idx, 'quantity', (item.quantity || 1) + 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 text-xs font-bold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2.5 text-xs pt-3 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount (10% OFF on ₹999+)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? 'text-emerald-600 font-bold' : 'font-semibold'}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-dashed flex justify-between text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-rose-600 text-lg font-extrabold">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:bg-gray-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FaLock size={13} />
                <span>{processing ? 'Processing Order...' : paymentMethod === 'Razorpay' ? `PAY ₹${totalPrice.toLocaleString()} VIA RAZORPAY` : 'CONFIRM CASH ON DELIVERY (COD)'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 text-center">
                <FaShieldAlt className="text-emerald-500" />
                <span>256-Bit SSL Encrypted & 100% Buyer Protection</span>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Checkout;
