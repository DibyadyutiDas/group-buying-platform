import React from 'react';
import SkeletonLoader from './SkeletonLoader';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <SkeletonLoader height="192px" className="w-full" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category badge */}
        <SkeletonLoader width="80px" height="20px" className="rounded-full" />
        
        {/* Title */}
        <SkeletonLoader height="24px" />
        
        {/* Description */}
        <SkeletonLoader variant="text" lines={2} />
        
        {/* Price */}
        <SkeletonLoader width="100px" height="28px" />
        
        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SkeletonLoader variant="circular" width="20px" height="20px" />
            <SkeletonLoader width="80px" height="16px" />
          </div>
          <SkeletonLoader width="120px" height="16px" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;