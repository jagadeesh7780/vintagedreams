import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrashAlt, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    const productData = item.product && typeof item.product === 'object' ? item.product : item;
    addToCart(productData, 1, 'M');
    removeFromWishlist(item.product?._id || item.product || item._id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-5">
            <FaHeart size={30} />
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-gray-900 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Save items that you love to buy them later or keep track of exclusive discounts.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-rose-900/20 transition-all"
          >
            <span>EXPLORE PRODUCTS</span>
            <FaArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 pb-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
              My Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Saved items from your browsing</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => {
            const productId = item.product?._id || item.product || item._id;
            const name = item.product?.name || item.name;
            const price = item.product?.price || item.price;
            const image = item.product?.images?.[0] || item.image;

            return (
              <div
                key={item._id || productId}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-gray-100">
                  <Link to={`/product/${productId}`}>
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(productId)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-gray-400 hover:text-rose-600 shadow flex items-center justify-center transition-colors"
                    title="Remove from wishlist"
                  >
                    <FaTrashAlt size={13} />
                  </button>
                </div>

                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <Link to={`/product/${productId}`}>
                      <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2 hover:text-rose-600 mb-1">
                        {name}
                      </h3>
                    </Link>
                    <p className="text-sm font-bold text-gray-900">₹{price}</p>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="mt-3 w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <FaShoppingCart size={12} />
                    <span>MOVE TO CART</span>
                  </button>
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
