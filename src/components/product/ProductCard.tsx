import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Heart } from 'lucide-react';
import Card from '../common/Card';
import ImageWithFallback from '../common/ImageWithFallback';
import ProgressBar from '../loading/ProgressBar';
import { Product, User } from '../../types';
import { getUserById } from '../../utils/storage';
import { formatDate, formatPrice } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
  showInterestCount?: boolean;
  showProgress?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  showInterestCount = true,
  showProgress = true
}) => {
  const navigate = useNavigate();
  
  const createdByUser: User | undefined = getUserById(product.createdBy);
  const interestCount = product.interestedUsers.length;
  const minQuantity = 5; // Default minimum quantity for demo
  
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', product.id);
  };
  
  return (
    <Card hover onClick={handleClick} className="h-full flex flex-col group">
      <div className="relative">
        <ImageWithFallback
          src={product.image}
          alt={product.title}
          className="h-48 w-full"
          enableZoom
          lazy
        />
        
        {/* Wishlist button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        
        {showInterestCount && interestCount > 0 && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {interestCount} interested
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white line-clamp-2">
          {product.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        {showProgress && (
          <div className="mb-3">
            <ProgressBar
              current={interestCount}
              target={minQuantity}
              label="Group Progress"
              showNumbers={false}
            />
          </div>
        )}
        
        <div className="mt-auto">
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {formatPrice(product.price)}
          </div>
          
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <img 
                src={createdByUser?.avatar} 
                alt={createdByUser?.name}
                className="h-5 w-5 rounded-full mr-1"
              />
              <span>{createdByUser?.name || 'Anonymous'}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(product.estimatedPurchaseDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;