import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Users, Zap, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';

const HomePage: React.FC = () => {
  const { products, loading } = useProducts();
  const { user } = useAuth();
  
  // Get the three most recently added products
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:w-7/12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Save More By <span className="text-yellow-300">Buying Together</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Connect with others who want to buy the same products and unlock bulk discounts through collective purchasing power.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Products
                  </Button>
                </Link>
                {!user && (
                  <Link to="/register">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-700">
                      Sign Up for Free
                    </Button>
                  </Link>
                )}
                {user && (
                  <Link to="/dashboard">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:block md:w-5/12">
              <img 
                src="https://images.pexels.com/photos/3184422/pexels-photo-3184422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="People shopping together" 
                className="rounded-lg shadow-2xl transform -rotate-3 border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How BulkBuy Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join forces with other buyers to get better deals through the power of bulk purchasing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center transition-colors duration-200">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. Add Products</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add products you plan to purchase in the future to your wishlist.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center transition-colors duration-200">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. Match with Others</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get matched with other users interested in buying the same products.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center transition-colors duration-200">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Save Together</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join forces to place bulk orders and enjoy significant discounts.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Products</h2>
            <Link to="/products">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-1/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-3/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mt-4 w-1/3"></div>
                  </div>
                </div>
              ))
            ) : recentProducts.length > 0 ? (
              recentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No products available yet. Be the first to add one!</p>
                <Link to="/products/new" className="mt-4 inline-block">
                  <Button>Add Product</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose BulkBuy?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing how people purchase products by harnessing the power of community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md transition-colors duration-200">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Save 15-40% on Average</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Users typically save between 15-40% on their purchases by joining forces with others. The more people join, the bigger the discount.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md transition-colors duration-200">
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mr-4">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Growing Community</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Join thousands of smart shoppers who are already using BulkBuy to save money on their purchases.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md transition-colors duration-200">
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg mr-4">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Simple Process</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our platform makes it easy to find others interested in the same products and coordinate bulk purchases.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md transition-colors duration-200">
              <div className="flex items-start">
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg mr-4">
                  <ShoppingBag className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Wide Range of Products</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    From electronics to furniture, find group buying opportunities across multiple categories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {user ? 'Continue Your Journey' : 'Ready to Start Saving?'}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {user 
              ? 'Explore more products and find great deals through group buying.'
              : 'Join BulkBuy today and connect with others to unlock the power of collective purchasing.'
            }
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {!user && (
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                  Sign Up Now
                </Button>
              </Link>
            )}
            {user && (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            )}
            <Link to="/products">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-700 w-full sm:w-auto">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;