import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style = {},
  ...props
}) => {
  // Base styles with explicit colors for better visibility
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 border';
  
  // Variant styles with dark mode support
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 text-white border-blue-600 hover:border-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:border-blue-600',
    secondary: 'bg-green-600 hover:bg-green-700 active:bg-green-800 focus:ring-green-500 text-white border-green-600 hover:border-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-600',
    outline: 'bg-white hover:bg-gray-50 active:bg-gray-100 focus:ring-blue-500 text-gray-700 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:border-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 focus:ring-red-500 text-white border-red-600 hover:border-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-600',
  };
  
  const sizeStyles = {
    sm: 'text-sm py-1.5 px-3 min-h-[32px]',
    md: 'text-base py-2 px-4 min-h-[40px]',
    lg: 'text-lg py-2.5 px-5 min-h-[48px]',
  };
  
  const disabledStyles = disabled || isLoading 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer';
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantStyles[variant],
    sizeStyles[size],
    disabledStyles,
    widthStyle,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      style={style}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!isLoading && leftIcon && (
        <span className="mr-2 flex items-center">
          {leftIcon}
        </span>
      )}
      
      <span>
        {children}
      </span>
      
      {!isLoading && rightIcon && (
        <span className="ml-2 flex items-center">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;