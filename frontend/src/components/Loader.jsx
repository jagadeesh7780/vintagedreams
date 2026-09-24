import React from 'react';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-serif text-xs font-bold text-rose-600">
            VD
          </div>
        </div>
        <p className="text-gray-500 font-medium text-sm animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 rounded-full border-3 border-rose-100 border-t-rose-600 animate-spin"></div>
    </div>
  );
};

export default Loader;
