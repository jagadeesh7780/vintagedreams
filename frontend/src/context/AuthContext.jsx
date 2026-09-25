import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('vintage_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('vintage_token'));
  const [loading, setLoading] = useState(true);

  // Load user profile if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('vintage_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Session check:', error?.response?.data?.message || error.message);
          // If token fails, keep cached user for offline testing or logout if explicit 401
          if (error?.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Login (Email or Phone number supported)
  const login = async (identifier, password, role = 'user') => {
    try {
      const res = await api.post('/auth/login', { identifier, password, role });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('vintage_token', res.data.token);
        localStorage.setItem('vintage_user', JSON.stringify(res.data.user));
        toast.success(`Welcome, ${res.data.user.name}!`);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (error) {
      const errData = error.response?.data || {};
      const msg = errData.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { 
        success: false, 
        code: errData.code,
        field: errData.field,
        message: msg 
      };
    }
  };

  // Register Customer (strictly customer accounts)
  const register = async (name, email, phone, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('vintage_token', res.data.token);
        localStorage.setItem('vintage_user', JSON.stringify(res.data.user));
        toast.success(`Account created! Welcome to Vintage Dreams.`);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (error) {
      const errData = error.response?.data || {};
      const msg = errData.message || 'Registration failed. Please check the entered details.';
      toast.error(msg);
      return { 
        success: false, 
        code: errData.code,
        field: errData.field,
        message: msg 
      };
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vintage_token');
    localStorage.removeItem('vintage_user');
    toast.success('Logged out successfully');
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('vintage_user', JSON.stringify(res.data.user));
        toast.success('Profile updated successfully');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Update failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
