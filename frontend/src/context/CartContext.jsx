import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem('vintage_guest_cart');
    return localCart ? JSON.parse(localCart) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync cart with backend when logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    } else {
      const localCart = localStorage.getItem('vintage_guest_cart');
      setCartItems(localCart ? JSON.parse(localCart) : []);
    }
  }, [isAuthenticated, token]);

  // Save guest cart in localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('vintage_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const fetchBackendCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success && res.data.cart) {
        setCartItems(res.data.cart.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add Item to Cart
  const addToCart = async (product, quantity = 1, size = 'M', color = 'Standard') => {
    const itemToAdd = {
      product: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      size: size || 'M',
      color: color || 'Standard',
      quantity: Number(quantity)
    };

    if (isAuthenticated) {
      try {
        const res = await api.post('/cart', {
          productId: itemToAdd.product,
          quantity,
          size,
          color
        });
        if (res.data.success) {
          setCartItems(res.data.cart.items);
          toast.success('Added to Cart! 🛍️');
        }
      } catch (error) {
        toast.error('Failed to add item to cart');
      }
    } else {
      // Guest Cart
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => (item.product === itemToAdd.product || item.product?._id === itemToAdd.product) && item.size === size
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex].quantity += Number(quantity);
          toast.success('Cart updated! 🛍️');
          return updated;
        } else {
          toast.success('Added to Cart! 🛍️');
          return [...prevItems, { ...itemToAdd, _id: Date.now().toString() }];
        }
      });
    }
  };

  // Update Item Quantity
  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) {
      removeFromCart(itemId);
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await api.put(`/cart/${itemId}`, { quantity: newQty });
        if (res.data.success) {
          setCartItems(res.data.cart.items);
        }
      } catch (error) {
        toast.error('Failed to update quantity');
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          (item._id === itemId || item.product === itemId) ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  // Remove Item
  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/cart/${itemId}`);
        if (res.data.success) {
          setCartItems(res.data.cart.items);
          toast.success('Item removed from cart');
        }
      } catch (error) {
        toast.error('Failed to remove item');
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId && item.product !== itemId)
      );
      toast.success('Item removed');
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch (error) {
        console.error('Clear cart error:', error);
      }
    }
    setCartItems([]);
    localStorage.removeItem('vintage_guest_cart');
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discount = Math.round(subtotal > 999 ? subtotal * 0.1 : 0); // 10% discount on ₹999+
  const deliveryCharge = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const totalPrice = Math.max(0, subtotal - discount + deliveryCharge);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        totalItemsCount,
        subtotal,
        discount,
        deliveryCharge,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchBackendCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
