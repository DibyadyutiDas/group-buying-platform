import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={`
          px-3 py-2 bg-white dark:bg-gray-800 border shadow-sm 
          border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500
          text-gray-900 dark:text-white
          focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full 
          rounded-md sm:text-sm focus:ring-1 
          ${error ? 'border-red-500 dark:border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;