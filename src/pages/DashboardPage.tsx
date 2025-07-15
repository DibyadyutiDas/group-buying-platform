import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, ThumbsUp, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import OnlineUsers from '../components/common/OnlineUsers';
import { sanitizeText } from '../utils/helpers';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { products, loading } = useProducts();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [interestedProducts, setInterestedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    if (user && products.length > 0) {
      // Get products created by the user
      const created = products.filter(product => product.createdBy === user.id);
      setMyProducts(created);
      
      // Get products the user is interested in (but didn't create)
      const interested = products.filter(
        product => product.interestedUsers.includes(user.id) && product.createdBy !== user.id
      );
      setInterestedProducts(interested);
    }
  }, [user, products]);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">Please log in to view your dashboard.</p>
            <Link to="/login" className="mt-4 inline-block">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {sanitizeText(user.name)}! Manage your products and group purchases.
            </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to="/products/new">
            <Button leftIcon={<PlusCircle size={18} />}>Add Product</Button>
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
              <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">My Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{myProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
              <ThumbsUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Interested In</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{interestedProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Potential Savings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {interestedProducts.length + myProducts.length > 0 ? '15-40%' : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Dashboard Content */}
        <div className="lg:col-span-3">
          {/* My Products */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Products</h2>
              <Link to="/products/new">
                <Button variant="outline" size="sm">
                  Add New
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-1/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-3/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mt-4 w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : myProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Add products you're planning to purchase to find group buying opportunities.
                </p>
                <Link to="/products/new">
                  <Button>Add Your First Product</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Interested Products */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Products I'm Interested In</h2>
              <Link to="/products">
                <Button variant="outline" size="sm">
                  Browse More
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-1/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-3/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mt-4 w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : interestedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interestedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <ThumbsUp className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No interests yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Browse products and mark ones you're interested in to join group buying opportunities.
                </p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <OnlineUsers className="sticky top-6" />
        </div>
      </div>
      </div>
    </div>
  );
};

export default DashboardPage;