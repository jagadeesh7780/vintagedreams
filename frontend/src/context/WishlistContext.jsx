import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    const localWishlist = localStorage.getItem('vintage_guest_wishlist');
    return localWishlist ? JSON.parse(localWishlist) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync wishlist when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendWishlist();
    } else {
      const localWishlist = localStorage.getItem('vintage_guest_wishlist');
      setWishlistItems(localWishlist ? JSON.parse(localWishlist) : []);
    }
  }, [isAuthenticated, token]);

  // Save guest wishlist
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('vintage_guest_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  const fetchBackendWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      if (res.data.success && res.data.wishlist) {
        setWishlistItems(res.data.wishlist.items || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.product === productId || item.product?._id === productId || item._id === productId
    );
  };

  const toggleWishlist = async (product) => {
    const pId = product._id || product.id;
    const exists = isInWishlist(pId);

    if (exists) {
      // Remove
      await removeFromWishlist(pId);
    } else {
      // Add
      await addToWishlist(product);
    }
  };

  const addToWishlist = async (product) => {
    const pId = product._id || product.id;

    if (isAuthenticated) {
      try {
        const res = await api.post('/wishlist', { productId: pId });
        if (res.data.success) {
          setWishlistItems(res.data.wishlist.items);
          toast.success('Added to Wishlist ❤️');
        }
      } catch (error) {
        toast.error('Item already in wishlist or error occurred');
      }
    } else {
      const newItem = {
        _id: Date.now().toString(),
        product: pId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
        category: product.category
      };
      setWishlistItems((prev) => [...prev, newItem]);
      toast.success('Added to Wishlist ❤️');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/wishlist/${productId}`);
        if (res.data.success) {
          setWishlistItems(res.data.wishlist.items);
          toast.success('Removed from Wishlist');
        }
      } catch (error) {
        toast.error('Failed to remove from wishlist');
      }
    } else {
      setWishlistItems((prev) =>
        prev.filter(
          (item) => item.product !== productId && item.product?._id !== productId && item._id !== productId
        )
      );
      toast.success('Removed from Wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        fetchBackendWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
