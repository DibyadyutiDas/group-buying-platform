import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, Users, CalendarClock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Comments from '../components/product/Comments';
import ProgressBar from '../components/loading/ProgressBar';
import { getUserById } from '../utils/storage';
import { formatDate, formatPrice } from '../utils/helpers';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, toggleInterest } = useProducts();
  const { error: showError } = useToast();
  const [product, setProduct] = useState(products.find(p => p.id === id));
  const [loading, setLoading] = useState(false);
  
  const createdByUser = product ? getUserById(product.createdBy) : undefined;
  const isCreator = user?.id === product?.createdBy;
  
  const isInterested = user && product?.interestedUsers.includes(user.id);
  const interestCount = product?.interestedUsers.length || 0;
  const minQuantity = 5; // Default minimum quantity for demo
  
  useEffect(() => {
    // Update product when products state changes
    const updatedProduct = products.find(p => p.id === id);
    if (updatedProduct) {
      setProduct(updatedProduct);
    } else if (products.length > 0 && !updatedProduct) {
      // Product not found, redirect to products page
      navigate('/products');
    }
  }, [products, id, navigate]);
  
  const handleToggleInterest = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    
    if (!product) return;
    
    try {
      setLoading(true);
      await toggleInterest(product.id, !isInterested);
    } catch (err) {
      console.error('Failed to toggle interest:', err);
      showError('Error', 'Failed to update interest');
    } finally {
      setLoading(false);
    }
  };
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image */}
            <div className="bg-gray-200 dark:bg-gray-700 h-64 md:h-auto">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                }}
              />
            </div>
            
            {/* Product Details */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full mb-2">
                    {product.category}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{product.title}</h1>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <ProgressBar
                  current={interestCount}
                  target={minQuantity}
                  label="Group Progress"
                  showNumbers={true}
                />
              </div>
              
              <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center mr-6">
                  <CalendarClock className="h-5 w-5 mr-1 text-blue-500 dark:text-blue-400" />
                  <span>Est. purchase: {formatDate(product.estimatedPurchaseDate)}</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1 text-green-500 dark:text-green-400" />
                  <span>{interestCount} interested</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                  <img
                    src={createdByUser?.avatar}
                    alt={createdByUser?.name}
                    className="h-10 w-10 rounded-full mr-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://i.pravatar.cc/150?img=1';
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Added by {createdByUser?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                
                {!isCreator && (
                  <div className="mt-6">
                    <Button
                      onClick={handleToggleInterest}
                      isLoading={loading}
                      disabled={loading}
                      variant={isInterested ? 'secondary' : 'primary'}
                      leftIcon={<ThumbsUp size={18} />}
                      fullWidth
                    >
                      {isInterested ? "I'm no longer interested" : "I'm interested"}
                    </Button>
                  </div>
                )}
                
                {isCreator && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>You created this product.</strong> Share it with others to get more people interested!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
          <Comments productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;