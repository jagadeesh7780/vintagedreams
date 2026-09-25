import React from 'react';
import { FaMagic } from 'react-icons/fa';

/**
 * TryItNowButton - Reusable Entry Point for Virtual Try-On
 * 
 * Consistent TRY IT NOW button for product cards, product details, quick view modals, etc.
 * Uses the existing product data and triggers the Virtual Try-On modal.
 */
const TryItNowButton = ({ 
  product, 
  onClick, 
  className = '', 
  size = 'md',
  variant = 'gradient' 
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(product);
    }
  };

  const sizeClasses = {
    sm: 'py-1.5 px-2.5 text-[10px] gap-1.5 rounded-xl',
    md: 'py-2.5 px-3.5 text-xs gap-2 rounded-xl',
    lg: 'py-3.5 px-6 text-xs sm:text-sm gap-2.5 rounded-2xl'
  }[size] || 'py-2.5 px-3.5 text-xs gap-2 rounded-xl';

  const variantClasses = {
    gradient: 'bg-gradient-to-r from-gray-950 via-gray-900 to-rose-950 hover:from-black hover:to-rose-900 text-white border border-white/10 shadow-sm',
    solid: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/20',
    outline: 'bg-white hover:bg-rose-50 text-gray-900 border border-gray-300 hover:border-rose-400'
  }[variant] || 'bg-gradient-to-r from-gray-950 via-gray-900 to-rose-950 hover:from-black hover:to-rose-900 text-white border border-white/10 shadow-sm';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Try on ${product?.name || 'product'} in Virtual Try-On Studio`}
      title="Try It Now in Virtual Try-On Studio"
      className={`w-full font-bold inline-flex items-center justify-center transition-all cursor-pointer active:scale-98 ${sizeClasses} ${variantClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0"></span>
      <FaMagic className="text-rose-400 shrink-0" />
      <span className="truncate uppercase tracking-wider font-extrabold">TRY IT NOW</span>
    </button>
  );
};

export default TryItNowButton;
