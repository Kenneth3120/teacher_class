import React from 'react';

const LoadingSkeleton = ({ type = "card", count = 1, className = "" }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`animate-pulse bg-white rounded-2xl shadow-soft p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-full h-4 bg-gray-200 rounded mb-1"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
          </div>
        );
      
      case 'stats':
        return (
          <div className={`animate-pulse bg-white rounded-2xl shadow-soft p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded mb-1"></div>
            <div className="w-20 h-4 bg-gray-200 rounded mb-1"></div>
            <div className="w-16 h-3 bg-gray-200 rounded"></div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`animate-pulse space-y-2 ${className}`}>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
            <div className="w-4/6 h-4 bg-gray-200 rounded"></div>
          </div>
        );
      
      case 'button':
        return (
          <div className={`animate-pulse h-12 bg-gray-200 rounded-xl ${className}`}></div>
        );
      
      default:
        return (
          <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ height: '200px' }}></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="shimmer-wrapper">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;