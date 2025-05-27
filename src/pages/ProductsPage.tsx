import React, { useState } from 'react';
import ProductCard, { Product } from '../components/products/ProductCard';
import { Search, Filter, ChevronDown } from 'lucide-react';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Apple MacBook Pro 14"',
    description: 'M3 Pro, 16GB RAM, 512GB SSD, Space Gray',
    image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 1999,
    bulkPrice: 1699,
    minGroupSize: 20,
    currentGroupSize: 15,
    deadline: '2025-06-15',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Samsung 55" 4K Smart TV',
    description: 'Crystal UHD 4K, Smart Hub, Multiple Voice Assistants',
    image: 'https://images.pexels.com/photos/5721867/pexels-photo-5721867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 699,
    bulkPrice: 549,
    minGroupSize: 10,
    currentGroupSize: 6,
    deadline: '2025-06-10',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Wireless Noise Cancelling Headphones with Auto Noise Cancelling Optimizer',
    image: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 399,
    bulkPrice: 299,
    minGroupSize: 10,
    currentGroupSize: 9,
    deadline: '2025-06-05',
    category: 'Electronics'
  },
  {
    id: '4',
    name: 'Dyson V12 Detect Slim',
    description: 'Cordless Vacuum Cleaner with Laser Detection',
    image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 649.99,
    bulkPrice: 499.99,
    minGroupSize: 15,
    currentGroupSize: 8,
    deadline: '2025-06-20',
    category: 'Home'
  },
  {
    id: '5',
    name: 'iPad Pro 12.9"',
    description: 'M2 chip, Liquid Retina XDR display, 256GB',
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 1099,
    bulkPrice: 949,
    minGroupSize: 12,
    currentGroupSize: 5,
    deadline: '2025-07-15',
    category: 'Electronics'
  },
  {
    id: '6',
    name: 'Herman Miller Aeron Chair',
    description: 'Ergonomic Office Chair with PostureFit SL',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 1495,
    bulkPrice: 1195,
    minGroupSize: 8,
    currentGroupSize: 3,
    deadline: '2025-07-01',
    category: 'Furniture'
  },
  {
    id: '7',
    name: 'Breville Barista Express',
    description: 'Espresso Machine with Built-in Grinder',
    image: 'https://images.pexels.com/photos/6542774/pexels-photo-6542774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 699.95,
    bulkPrice: 599.95,
    minGroupSize: 10,
    currentGroupSize: 7,
    deadline: '2025-06-25',
    category: 'Kitchen'
  },
  {
    id: '8',
    name: 'Sony A7 IV Camera',
    description: 'Full-frame Mirrorless Camera with 28-70mm Lens',
    image: 'https://images.pexels.com/photos/1787235/pexels-photo-1787235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 2499.99,
    bulkPrice: 2199.99,
    minGroupSize: 6,
    currentGroupSize: 2,
    deadline: '2025-07-10',
    category: 'Electronics'
  }
];

const categories = [
  'All Categories',
  'Electronics',
  'Home',
  'Kitchen',
  'Furniture',
  'Fashion',
  'Beauty',
  'Sports',
  'Toys'
];

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter products based on search query and category
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.bulkPrice - b.bulkPrice;
      case 'price_high':
        return b.bulkPrice - a.bulkPrice;
      case 'savings':
        const savingsA = a.regularPrice - a.bulkPrice;
        const savingsB = b.regularPrice - b.bulkPrice;
        return savingsB - savingsA;
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'progress':
        const progressA = a.currentGroupSize / a.minGroupSize;
        const progressB = b.currentGroupSize / b.minGroupSize;
        return progressB - progressA;
      default: // popularity
        return 0; // In a real app, this would use a popularity metric
    }
  });
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Browse Group Buys</h1>
          
          <button 
            className="flex items-center text-teal-600 md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} className="mr-2" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category}`}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="3000"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">$0</span>
                <span className="text-xs text-gray-500">$3000+</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Savings</h3>
              <div className="space-y-2">
                {['Any', '10%', '20%', '30%', '40%+'].map(saving => (
                  <div key={saving} className="flex items-center">
                    <input
                      type="radio"
                      id={`saving-${saving}`}
                      name="saving"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor={`saving-${saving}`} className="ml-2 text-sm text-gray-700">
                      {saving}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Group Progress</h3>
              <div className="space-y-2">
                {['Any', 'Almost Complete (75%+)', 'Halfway (50%+)', 'Just Started (<25%)'].map(progress => (
                  <div key={progress} className="flex items-center">
                    <input
                      type="radio"
                      id={`progress-${progress}`}
                      name="progress"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor={`progress-${progress}`} className="ml-2 text-sm text-gray-700">
                      {progress}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Filters - Mobile */}
          {showFilters && (
            <div className="lg:hidden w-full bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={`mobile-category-${category}`}
                        name="mobile-category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor={`mobile-category-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">$0</span>
                  <span className="text-xs text-gray-500">$3000+</span>
                </div>
              </div>
              
              <button 
                className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          )}
          
          <div className="flex-1">
            {/* Search and Sort Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm text-gray-700 mr-2 whitespace-nowrap">
                    Sort by:
                  </label>
                  <div className="relative">
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="savings">Biggest Savings</option>
                      <option value="deadline">Closing Soon</option>
                      <option value="progress">Nearly Complete</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.length > 0 ? (
                sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Categories');
                    }}
                    className="text-teal-600 font-medium hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;