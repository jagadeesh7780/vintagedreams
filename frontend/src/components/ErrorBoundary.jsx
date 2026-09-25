import React from 'react';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('vintage_guest_cart');
    localStorage.removeItem('vintage_guest_wishlist');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <FaExclamationTriangle size={28} />
            </div>
            <h2 className="text-xl font-serif-title font-bold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              We encountered a display hiccup. Please click below to refresh and resume shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <FaRedo size={12} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <FaHome size={12} />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
