import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../components/product/ProductForm';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add a Product</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Share a product you're planning to purchase to find others interested in buying the same item.
          </p>
          
          <ProductForm />
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;