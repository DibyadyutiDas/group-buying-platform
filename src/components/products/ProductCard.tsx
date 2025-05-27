import React, { useState } from 'react';
import { Calendar, Users, Bookmark, BookmarkCheck } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  regularPrice: number;
  bulkPrice: number;
  minGroupSize: number;
  currentGroupSize: number;
  deadline: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isSaved, setIsSaved] = useState(false);
  const savingsPercentage = Math.round(
    ((product.regularPrice - product.bulkPrice) / product.regularPrice) * 100
  );
  
  const handleSave = () => {
    setIsSaved(!isSaved);
  };
  
  // Calculate days left until deadline
  const daysLeft = () => {
    const deadline = new Date(product.deadline);
    const today = new Date();
    const diffTime = Math.abs(deadline.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
          Save {savingsPercentage}%
        </div>
        <button 
          onClick={handleSave}
          className="absolute bottom-0 right-0 bg-white p-2 m-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          {isSaved ? (
            <BookmarkCheck className="h-5 w-5 text-teal-600" />
          ) : (
            <Bookmark className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-gray-500 text-sm line-through">${product.regularPrice}</span>
            <span className="text-xl font-bold text-gray-900 ml-2">${product.bulkPrice}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{daysLeft()} days left</span>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Group Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {product.currentGroupSize}/{product.minGroupSize}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full" 
                style={{ width: `${(product.currentGroupSize / product.minGroupSize) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="ml-4 flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-sm">Min: {product.minGroupSize}</span>
          </div>
        </div>
        
        <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Join Group Buy
        </button>
      </div>
    </div>
  );
};

export default ProductCard;