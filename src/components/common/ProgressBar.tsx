import React from 'react';
import { Users, Target, TrendingUp } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showPercentage?: boolean;
  showNumbers?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  showPercentage = true,
  showNumbers = true,
  variant = 'default',
  size = 'md',
  animated = true,
  className = '',
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return isComplete ? 'bg-green-500' : 'bg-blue-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header with label and stats */}
      {(label || showNumbers || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {label && (
              <span className={`font-medium text-gray-700 dark:text-gray-300 ${getTextSizeClasses()}`}>
                {label}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {showNumbers && (
              <div className={`flex items-center space-x-1 text-gray-600 dark:text-gray-400 ${getTextSizeClasses()}`}>
                <Users className="h-4 w-4" />
                <span className="font-medium">
                  {current.toLocaleString()} / {target.toLocaleString()}
                </span>
              </div>
            )}
            {showPercentage && (
              <span className={`font-semibold ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'} ${getTextSizeClasses()}`}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <div
          className={`${getSizeClasses()} ${getVariantClasses()} rounded-full transition-all duration-500 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Status indicators */}
      {isComplete && (
        <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
          <Target className="h-4 w-4 mr-1" />
          <span className={`font-medium ${getTextSizeClasses()}`}>
            Target Reached! 🎉
          </span>
        </div>
      )}
      
      {percentage >= 80 && !isComplete && (
        <div className="flex items-center mt-2 text-yellow-600 dark:text-yellow-400">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className={`font-medium ${getTextSizeClasses()}`}>
            Almost there! Only {target - current} more needed
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
