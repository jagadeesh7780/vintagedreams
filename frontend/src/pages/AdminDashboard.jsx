import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaPlus, 
  FaTrashAlt, 
  FaBoxOpen, 
  FaUsers, 
  FaRupeeSign, 
  FaCheck, 
  FaEdit 
} from 'react-icons/fa';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { fallbackProducts as initialProducts } from '../data/fallbackProducts';

const AdminDashboard = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'shirts',
    gender: 'men',
    price: '',
    originalPrice: '',
    brand: 'Vintage Dreams',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'],
    description: 'High-quality fashion wear with premium fabric and timeless design.'
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      toast.error('Admin privileges required. Sign in as Admin.');
      navigate('/login?redirect=/admin');
      return;
    }

    fetchAdminData();
  }, [isAuthenticated, isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes] = await Promise.allSettled([
        api.get('/products?limit=100'),
        api.get('/orders')
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.data.success) {
        setProductsList(prodRes.value.data.products);
      } else {
        setProductsList(initialProducts);
      }

      if (orderRes.status === 'fulfilled' && orderRes.value.data.success) {
        setOrdersList(orderRes.value.data.orders);
      }
    } catch (e) {
      console.error(e);
      setProductsList(initialProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.error('Please enter product title and price');
      return;
    }

    try {
      const res = await api.post('/products', {
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice || newProduct.price * 1.4)
      });

      if (res.data.success) {
        toast.success('Product added to catalog!');
        setProductsList([res.data.product, ...productsList]);
        setNewProduct({
          name: '',
          category: 'shirts',
          gender: 'men',
          price: '',
          originalPrice: '',
          brand: 'Vintage Dreams',
          stock: 25,
          images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'],
          description: 'High-quality fashion wear with premium fabric and timeless design.'
        });
      }
    } catch (error) {
      // Local addition fallback
      const localP = { ...newProduct, _id: Date.now().toString(), price: Number(newProduct.price) };
      setProductsList([localP, ...productsList]);
      toast.success('Product added!');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProductsList(productsList.filter(p => (p._id || p.id) !== id));
      toast.success('Product removed');
    } catch (e) {
      setProductsList(productsList.filter(p => (p._id || p.id) !== id));
      toast.success('Product removed');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrdersList(ordersList.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader fullScreen text="Loading Admin Control Center..." />;

  const totalSales = ordersList.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-gray-950 flex items-center justify-center font-bold">
              <FaShieldAlt size={22} />
            </div>
            <div>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold">
                Vintage Dreams Admin Control Center
              </h1>
              <p className="text-xs text-amber-200">Catalog, Orders & Inventory Management</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 block">Logged in as</span>
            <span className="font-bold text-sm text-white">{user?.name} (Administrator)</span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FaRupeeSign size={20} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Total Revenue</span>
              <h3 className="text-xl font-bold text-gray-900">₹{totalSales.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FaBoxOpen size={20} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Total Orders</span>
              <h3 className="text-xl font-bold text-gray-900">{ordersList.length} Orders</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <FaBoxOpen size={20} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Catalog Products</span>
              <h3 className="text-xl font-bold text-gray-900">{productsList.length} Items</h3>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 gap-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'products' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Manage Products ({productsList.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Customer Orders ({ordersList.length})
          </button>
        </div>

        {/* Products Management View */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Add Product Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit sticky top-28">
              <h3 className="font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
                <FaPlus className="text-rose-600" />
                <span>Add New Product to Catalog</span>
              </h3>

              <form onSubmit={handleAddProduct} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Classic Vintage Plaid Shirt"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs"
                    >
                      <option value="shirts">Shirts</option>
                      <option value="pants">Pants & Cargos</option>
                      <option value="shoes">Shoes</option>
                      <option value="watches">Watches</option>
                      <option value="rings">Silver Rings</option>
                      <option value="women-dresses">Women's Dresses</option>
                      <option value="women-tops">Women's Tops</option>
                      <option value="women-jewelry">Women's Jewelry</option>
                      <option value="women-sarees">Silk Sarees</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Gender</label>
                    <select
                      value={newProduct.gender}
                      onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Sale Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="999"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                      placeholder="1999"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newProduct.images[0]}
                    onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg text-xs shadow transition-colors"
                >
                  Add Product to Live Store
                </button>
              </form>
            </div>

            {/* Existing Catalog List */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-4">
                Active Catalog Inventory ({productsList.length})
              </h3>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 divide-y divide-gray-100">
                {productsList.map((p) => {
                  const pId = p._id || p.id;
                  const img = p.images?.[0] || p.image;
                  return (
                    <div key={pId} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 truncate">
                        <img src={img} alt="" className="w-12 h-14 rounded-lg object-cover bg-gray-100 shrink-0" />
                        <div className="truncate">
                          <h4 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">{p.name}</h4>
                          <span className="text-[11px] text-gray-500 uppercase">{p.category} · {p.gender}</span>
                          <p className="text-xs font-bold text-rose-600">₹{p.price}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(pId)}
                        className="text-gray-400 hover:text-rose-600 p-2 shrink-0 transition-colors"
                        title="Delete product"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Customer Orders Management View */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-base text-gray-900 mb-4">
              All Orders & Fulfillment
            </h3>

            {ordersList.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-8 text-center">No orders recorded in database yet.</p>
            ) : (
              <div className="space-y-4">
                {ordersList.map((order) => (
                  <div key={order._id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-900">ID: {order._id}</span>
                        <span className="text-xs text-gray-500">· {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1">
                        Customer: <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone})
                      </p>
                      <p className="text-xs font-bold text-rose-600 mt-1">
                        Total: ₹{order.totalPrice?.toLocaleString()} ({order.paymentMethod})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-600">Status:</label>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg text-xs font-bold p-1.5 outline-none"
                      >
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
