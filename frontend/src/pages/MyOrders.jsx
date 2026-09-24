import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaTruck, FaClock, FaCheckCircle, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const MyOrders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/myorders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (loading) return <Loader fullScreen text="Loading your orders..." />;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 pb-3 border-b border-gray-200">
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
            My Orders ({orders.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Track and view previous purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <FaBoxOpen size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No orders placed yet</h3>
            <p className="text-xs text-gray-500 mb-6">
              When you purchase items from Vintage Dreams, your orders will appear here for live tracking.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow transition-colors"
            >
              <span>Explore Collection</span>
              <FaArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
              >
                {/* Order Header */}
                <div className="bg-gray-50/80 p-4 sm:p-5 border-b border-gray-200/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                    <div>
                      <span className="text-gray-400 block uppercase tracking-wider text-[10px] font-bold">Order Placed</span>
                      <span className="font-semibold text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase tracking-wider text-[10px] font-bold">Total Amount</span>
                      <span className="font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase tracking-wider text-[10px] font-bold">Payment</span>
                      <span className="font-semibold text-gray-800">
                        {order.paymentMethod} {order.isPaid ? '(Paid ✓)' : '(Pending)'}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.orderStatus || 'Order Confirmed'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 sm:p-6 divide-y divide-gray-100">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                        />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Qty: <strong className="text-gray-800">{item.quantity}</strong> · Size: <strong className="text-gray-800">{item.size || 'M'}</strong>
                          </p>
                          <p className="text-sm font-bold text-rose-600 mt-1.5">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 sm:text-right">
                        <span className="text-[11px] text-gray-400 block">Deliver to:</span>
                        <span className="font-medium text-gray-800">
                          {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;
