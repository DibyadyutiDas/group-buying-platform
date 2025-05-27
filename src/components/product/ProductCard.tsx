import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Card from '../ui/Card';
import { Product, User } from '../../types';
import { getUserById } from '../../utils/storage';
import { formatDate, formatPrice } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
  showInterestCount?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  showInterestCount = true
}) => {
  const navigate = useNavigate();
  
  const createdByUser: User | undefined = getUserById(product.createdBy);
  const interestCount = product.interestedUsers.length;
  
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };
  
  return (
    <Card hover onClick={handleClick} className="h-full flex flex-col">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        {showInterestCount && interestCount > 0 && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {interestCount} interested
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-1 text-gray-900">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="mt-4 text-xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <img 
              src={createdByUser?.avatar} 
              alt={createdByUser?.name}
              className="h-5 w-5 rounded-full mr-1"
            />
            <span>{createdByUser?.name || 'Anonymous'}</span>
          </div>
          
          <div>
            <span>Est. purchase: {formatDate(product.estimatedPurchaseDate)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;