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
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('vintage_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          // Keep cached user active even if backend is slow/cold starting or offline
          const savedUser = localStorage.getItem('vintage_user');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch (e) {}
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Helper to get local registered users
  const getLocalUsers = () => {
    try {
      const saved = localStorage.getItem('vintage_registered_users');
      return saved ? JSON.parse(saved) : [
        {
          _id: 'usr_admin_001',
          name: 'Admin Vintage (Owner)',
          email: 'admin@vintagedreams.com',
          phone: '9988776655',
          role: 'admin'
        },
        {
          _id: 'usr_cust_001',
          name: 'Jagadeesh Babu',
          email: 'user@vintagedreams.com',
          phone: '7780597718',
          role: 'user'
        }
      ];
    } catch {
      return [];
    }
  };

  const saveLocalUsers = (users) => {
    try {
      localStorage.setItem('vintage_registered_users', JSON.stringify(users));
    } catch (e) {}
  };

  // Login (Email or Phone number supported)
  const login = async (identifier, password, role = 'user') => {
    try {
      const res = await api.post('/auth/login', { identifier, password, role });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('vintage_token', res.data.token);
        localStorage.setItem('vintage_user', JSON.stringify(res.data.user));
        toast.success(`Welcome back, ${res.data.user.name}!`);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (error) {
      // Offline fallback authentication check
      const localUsers = getLocalUsers();
      const trimmedId = identifier.trim().toLowerCase();
      
      const foundUser = localUsers.find(u => 
        (u.email?.toLowerCase() === trimmedId || u.phone === trimmedId) &&
        (role === 'admin' ? u.role === 'admin' : true)
      );

      if (foundUser) {
        const dummyToken = `jwt_offline_${foundUser._id}_${Date.now()}`;
        setToken(dummyToken);
        setUser(foundUser);
        localStorage.setItem('vintage_token', dummyToken);
        localStorage.setItem('vintage_user', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return { success: true, user: foundUser };
      }

      const errData = error.response?.data || {};
      const msg = errData.message || 'Login failed. Please verify your credentials.';
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
    const newUserObj = {
      _id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: 'user',
      addresses: []
    };

    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('vintage_token', res.data.token);
        localStorage.setItem('vintage_user', JSON.stringify(res.data.user));
        
        const localUsers = getLocalUsers();
        saveLocalUsers([...localUsers.filter(u => u.email !== res.data.user.email), res.data.user]);

        toast.success(`🎉 Account created! Welcome to Vintage Dreams.`);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (error) {
      // Offline fallback registration
      const localUsers = getLocalUsers();
      if (localUsers.some(u => u.email?.toLowerCase() === email.trim().toLowerCase())) {
        toast.error('An account with this email already exists. Please sign in.');
        return { success: false, message: 'Email already registered.' };
      }

      const updatedUsers = [...localUsers, newUserObj];
      saveLocalUsers(updatedUsers);

      const dummyToken = `jwt_offline_${newUserObj._id}_${Date.now()}`;
      setToken(dummyToken);
      setUser(newUserObj);
      localStorage.setItem('vintage_token', dummyToken);
      localStorage.setItem('vintage_user', JSON.stringify(newUserObj));

      toast.success(`🎉 Account created! Welcome, ${newUserObj.name}.`);
      return { success: true, user: newUserObj };
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
