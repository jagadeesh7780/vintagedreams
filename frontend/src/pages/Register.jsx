import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaGem, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaArrowRight, 
  FaExclamationCircle,
  FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // Password rules validation
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  // Phone validation
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const isPhoneValid = cleanPhone.length === 10;

  // Email format validation
  const isEmailValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrorCode('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters)');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }

    if (!isPhoneValid) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password meets all security rules');
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), cleanPhone, password);
    setLoading(false);

    if (result.success) {
      navigate(redirect);
    } else {
      setErrorMessage(result.message);
      setErrorCode(result.code);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f8f9fa] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-10 transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-700 to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-900/20">
            <FaGem size={26} />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            Customer Registration
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Create Your Account
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Join the Vintage Dreams fashion circle & enjoy exclusive discounts
          </p>
        </div>

        {/* Error Notification with Direct Sign In Redirect */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
            <div className="flex items-start gap-2">
              <FaExclamationCircle className="text-rose-600 mt-0.5 shrink-0" size={14} />
              <span>{errorMessage}</span>
            </div>

            {(errorCode === 'EMAIL_EXISTS' || errorCode === 'PHONE_EXISTS') && (
              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                <span className="text-[11px] text-rose-700 font-semibold">Already have an account?</span>
                <Link
                  to={`/login?redirect=${encodeURIComponent(redirect)}`}
                  className="bg-rose-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg hover:bg-rose-700 transition-colors inline-flex items-center gap-1"
                >
                  <span>Sign In Here</span>
                  <FaArrowRight size={10} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jagadeesh"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white transition-all"
              />
              <FaUser className="absolute left-3.5 top-3.5 text-gray-400" size={13} />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Email Address *</label>
              {email && (
                <span className={`text-[10px] font-bold ${isEmailValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isEmailValid ? 'Valid Email ✓' : 'Invalid Format'}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white transition-all"
              />
              <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400" size={13} />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Mobile Number (10 Digits) *</label>
              <span className={`text-[10px] font-bold ${cleanPhone.length === 10 ? 'text-emerald-600' : 'text-gray-400'}`}>
                {cleanPhone.length}/10 digits
              </span>
            </div>
            <div className="relative">
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="7780597718"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white transition-all"
              />
              <FaPhone className="absolute left-3.5 top-3.5 text-gray-400" size={13} />
            </div>
          </div>

          {/* Password with rules indicator */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Create Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 chars (letters & numbers)"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-rose-500 focus:bg-white transition-all"
              />
              <FaLock className="absolute left-3.5 top-3.5 text-gray-400" size={13} />
            </div>

            {/* Password Rules Checklist */}
            <div className="mt-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Password Security Requirements:
              </p>
              
              <div className="flex items-center gap-1.5 text-[11px]">
                {hasMinLength ? (
                  <FaCheckCircle className="text-emerald-500 shrink-0" size={12} />
                ) : (
                  <FaTimesCircle className="text-gray-300 shrink-0" size={12} />
                )}
                <span className={hasMinLength ? 'text-emerald-700 font-medium' : 'text-gray-500'}>
                  At least 6 characters
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                {hasLetter ? (
                  <FaCheckCircle className="text-emerald-500 shrink-0" size={12} />
                ) : (
                  <FaTimesCircle className="text-gray-300 shrink-0" size={12} />
                )}
                <span className={hasLetter ? 'text-emerald-700 font-medium' : 'text-gray-500'}>
                  Contains at least one letter (a-z, A-Z)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                {hasNumber ? (
                  <FaCheckCircle className="text-emerald-500 shrink-0" size={12} />
                ) : (
                  <FaTimesCircle className="text-gray-300 shrink-0" size={12} />
                )}
                <span className={hasNumber ? 'text-emerald-700 font-medium' : 'text-gray-500'}>
                  Contains at least one number (0-9)
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl text-xs shadow-md shadow-rose-900/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Creating Your Account...</span>
            ) : (
              <>
                <span>CREATE ACCOUNT & PROCEED</span>
                <FaArrowRight size={12} />
              </>
            )}
          </button>
        </form>

        {/* Bottom Sign In Link */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link
              to={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-rose-600 font-bold hover:underline"
            >
              Sign In to Your Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
