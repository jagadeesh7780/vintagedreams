import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHeart, 
  FaTrashAlt, 
  FaShoppingCart, 
  FaArrowRight, 
  FaUserLock, 
  FaCheckCircle, 
  FaBoxes 
} from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to view or manage your wishlist', { id: 'wishlist-auth-req' });
      navigate('/login', { state: { from: '/wishlist' } });
    }
  }, [isAuthenticated, navigate]);

  const handleMoveToCart = (item) => {
    const productData = item.product && typeof item.product === 'object' ? item.product : item;
    addToCart(productData, 1, 'M', 'Standard');
    removeFromWishlist(item.product?._id || item.product || item._id);
    toast.success('Moved to Shopping Cart! 🛍️');
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      const productData = item.product && typeof item.product === 'object' ? item.product : item;
      addToCart(productData, 1, 'M', 'Standard');
      removeFromWishlist(item.product?._id || item.product || item._id);
    });
    toast.success('All wishlist items moved to cart!');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center max-w-md w-full space-y-4">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <FaHeart size={32} />
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-gray-900">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Save items that you love so you can easily purchase them later or track price drops.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-rose-900/20 transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            <span>Explore Fashion Catalog</span>
            <FaArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Controls */}
        <div className="pb-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
              My Saved Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Your personal curated collection</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMoveAllToCart}
              className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FaShoppingCart size={12} />
              <span>Move All to Cart</span>
            </button>

            <Link
              to="/products"
              className="text-xs font-semibold text-gray-600 hover:text-rose-600 hidden md:inline"
            >
              ← Back to Catalog
            </Link>
          </div>
        </div>

        {/* Not-logged-in Gentle Reminder */}
        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 text-xs">
            <div className="flex items-center gap-2.5">
              <FaUserLock size={16} className="text-amber-600 shrink-0" />
              <span>
                You are viewing a temporary guest wishlist. <strong>Sign in</strong> to sync your wishlist across all your devices permanently.
              </span>
            </div>
            <Link
              to="/login"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs shrink-0 transition-colors shadow-xs"
            >
              Login Now
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => {
            const productId = item.product?._id || item.product || item._id;
            const name = item.product?.name || item.name;
            const price = item.product?.price || item.price;
            const originalPrice = item.product?.originalPrice || item.originalPrice;
            const image = item.product?.images?.[0] || item.product?.image || item.image;
            const category = item.product?.category || item.category || 'Fashion';

            return (
              <div
                key={item._id || productId}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <Link to={`/product/${productId}`} className="w-full h-full block">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(productId)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-gray-400 hover:text-rose-600 hover:bg-white shadow-md flex items-center justify-center transition-all cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <FaTrashAlt size={12} />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mb-0.5">
                      {category}
                    </span>
                    <Link to={`/product/${productId}`}>
                      <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 hover:text-rose-600 transition-colors leading-snug">
                        {name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-extrabold text-gray-900">₹{price}</span>
                      {originalPrice && originalPrice > price && (
                        <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-900/20 cursor-pointer"
                    >
                      <FaShoppingCart size={12} />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Wishlist;
