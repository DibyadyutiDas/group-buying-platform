import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const hoverClasses = hover
    ? 'transform transition duration-200 hover:translate-y-[-4px] hover:shadow-lg cursor-pointer'
    : '';
  
  return (
    <div
      className={`
        bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-colors duration-200
        ${hoverClasses}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;