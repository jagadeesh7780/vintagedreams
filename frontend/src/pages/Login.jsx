import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaGem, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaUserShield, 
  FaUser, 
  FaArrowRight, 
  FaExclamationCircle,
  FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'admin'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || (activeTab === 'admin' ? '/admin' : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrorCode('');

    if (!identifier.trim()) {
      setErrorMessage(activeTab === 'customer' 
        ? 'Please enter your registered Email or 10-digit Mobile Number' 
        : 'Please enter Administrator Email');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setLoading(true);
    const result = await login(
      identifier.trim(), 
      password, 
      activeTab === 'admin' ? 'admin' : 'user'
    );
    setLoading(false);

    if (result.success) {
      if (activeTab === 'admin' || result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } else {
      setErrorMessage(result.message);
      setErrorCode(result.code);
    }
  };

  const handleQuickFill = (emailVal, passVal) => {
    setIdentifier(emailVal);
    setPassword(passVal);
    setErrorMessage('');
    setErrorCode('');
  };

  return (
    <div className="min-h-[85vh] bg-[#f8f9fa] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-10 transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-700 to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-900/20">
            <FaGem size={26} />
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900">
            {activeTab === 'customer' ? 'Customer Sign In' : 'Store Owner Portal'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {activeTab === 'customer'
              ? 'Access your saved wishlist, cart & tracked orders'
              : 'Owner & Admin operations management (Authorized Only)'}
          </p>
        </div>

        {/* Tab Switcher: Customer vs Admin */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('customer');
              setErrorMessage('');
              setErrorCode('');
              setIdentifier('');
              setPassword('');
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'customer'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <FaUser size={13} />
            <span>Customer Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMessage('');
              setErrorCode('');
              setIdentifier('admin@vintagedreams.com');
              setPassword('adminpassword123');
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'admin'
                ? 'bg-gray-900 text-amber-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <FaUserShield size={14} />
            <span>Admin / Owner</span>
          </button>
        </div>

        {/* Admin Warning Note (Owner Only, No Signups Allowed) */}
        {activeTab === 'admin' && (
          <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <FaUserShield className="text-amber-700" />
              <span>Restricted Store Owner Access</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Only the authorized business owner has login credentials. Admin self-signup is disabled by policy.
            </p>
          </div>
        )}

        {/* Error Notification & Account redirection prompt */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
            <div className="flex items-start gap-2">
              <FaExclamationCircle className="text-rose-600 mt-0.5 shrink-0" size={14} />
              <span>{errorMessage}</span>
            </div>

            {errorCode === 'USER_NOT_FOUND' && activeTab === 'customer' && (
              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                <span className="text-[11px] text-rose-700 font-semibold">New to Vintage Dreams?</span>
                <Link
                  to={`/register?redirect=${encodeURIComponent(redirect)}`}
                  className="bg-rose-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg hover:bg-rose-700 transition-colors inline-flex items-center gap-1"
                >
                  <span>Sign Up Now</span>
                  <FaArrowRight size={10} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Identifier Input (Email OR 10-digit Phone) */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {activeTab === 'customer' ? 'Email Address or Mobile Number' : 'Administrator Email'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={activeTab === 'customer' ? 'name@gmail.com or 7780597718' : 'admin@vintagedreams.com'}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white transition-all"
              />
              {activeTab === 'customer' ? (
                <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400" size={13} />
              ) : (
                <FaUserShield className="absolute left-3.5 top-3.5 text-gray-400" size={14} />
              )}
            </div>
            {activeTab === 'customer' && (
              <span className="text-[10px] text-gray-400 mt-1 block">
                💡 You can log in using either your email or 10-digit phone number.
              </span>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <span className="text-[11px] text-rose-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white transition-all"
              />
              <FaLock className="absolute left-3.5 top-3.5 text-gray-400" size={13} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-gray-900 hover:bg-black text-amber-300 shadow-gray-900/30'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20'
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{activeTab === 'admin' ? 'SIGN IN TO ADMIN CONTROL' : 'SIGN IN TO ACCOUNT'}</span>
                <FaArrowRight size={12} />
              </>
            )}
          </button>
        </form>

        {/* Fast Fill Demo Pill Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center mb-2">
            ⚡ 1-Click Fast Fill for Testing
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('customer');
                handleQuickFill('user@vintagedreams.com', 'userpassword123');
              }}
              className="bg-rose-50/80 hover:bg-rose-100 text-rose-900 text-[11px] font-semibold py-1.5 px-2 rounded-lg border border-rose-200 transition-colors text-center"
            >
              Customer Fill
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                handleQuickFill('admin@vintagedreams.com', 'adminpassword123');
              }}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-semibold py-1.5 px-2 rounded-lg border border-amber-200 transition-colors text-center"
            >
              Admin Fill
            </button>
          </div>
        </div>

        {/* Bottom Signup Link (Customers Only) */}
        {activeTab === 'customer' && (
          <p className="text-xs text-center text-gray-500 mt-6">
            Don't have an account yet?{' '}
            <Link
              to={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-rose-600 font-bold hover:underline"
            >
              Create Account (Sign Up)
            </Link>
          </p>
        )}

      </div>
    </div>
  );
};

export default Login;
