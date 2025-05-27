import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, Users, CalendarClock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import Button from '../components/ui/Button';
import Comments from '../components/product/Comments';
import { getUserById } from '../utils/storage';
import { formatDate, formatPrice } from '../utils/helpers';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, toggleInterest } = useProducts();
  const [product, setProduct] = useState(products.find(p => p.id === id));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createdByUser = product ? getUserById(product.createdBy) : undefined;
  const isCreator = user?.id === product?.createdBy;
  
  const isInterested = user && product?.interestedUsers.includes(user.id);
  const interestCount = product?.interestedUsers.length || 0;
  
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
      setError(null);
      await toggleInterest(product.id, !isInterested);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/products')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Products
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="bg-gray-200 h-64 md:h-auto">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full mb-2">
                  {product.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mt-6 flex items-center text-sm text-gray-500">
              <div className="flex items-center mr-6">
                <CalendarClock className="h-5 w-5 mr-1 text-blue-500" />
                <span>Est. purchase: {formatDate(product.estimatedPurchaseDate)}</span>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-1 text-green-500" />
                <span>{interestCount} interested</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <img
                  src={createdByUser?.avatar}
                  alt={createdByUser?.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Added by {createdByUser?.name}</p>
                  <p className="text-xs text-gray-500">
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
                  
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden p-6">
        <Comments productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;