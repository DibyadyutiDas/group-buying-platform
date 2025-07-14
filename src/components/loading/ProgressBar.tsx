import React from 'react';
import { Users } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showNumbers?: boolean;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  showNumbers = true,
  className = '',
  variant = 'default',
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  const getVariant = () => {
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'warning';
    return variant;
  };

  const currentVariant = getVariant();

  return (
    <div className={`w-full ${className}`}>
      {(label || showNumbers) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {label}
            </span>
          )}
          {showNumbers && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {current} / {target}
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-out ${variantClasses[currentVariant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage >= 100 && (
        <div className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
          ✓ Minimum quantity reached!
        </div>
      )}
    </div>
  );
};

export default ProgressBar;