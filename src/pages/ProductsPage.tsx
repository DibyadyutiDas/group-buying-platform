import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ProductsPage: React.FC = () => {
  const { products, loading } = useProducts();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique categories from products
  const categories = ['All', ...new Set(products.map(product => product.category))];
  
  useEffect(() => {
    // Apply filters whenever products, searchTerm, or selectedCategory changes
    let filtered = [...products];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.title.toLowerCase().includes(term) || 
          product.description.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse Products</h1>
          <p className="text-gray-600">
            Discover products others are planning to buy and join forces for better deals.
          </p>
        </div>
        
        {user && (
          <div className="mt-4 md:mt-0">
            <Link to="/products/new">
              <Button leftIcon={<Plus size={18} />}>Add Product</Button>
            </Link>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search products..."
              />
            </div>
          </div>
          
          <div>
            <Button
              variant="outline"
              leftIcon={<Filter size={18} />}
              onClick={toggleFilters}
              className="w-full md:w-auto"
            >
              Filters
            </Button>
          </div>
        </div>
        
        {/* Filters section */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Additional filters can be added here */}
          </div>
        )}
      </div>
      
      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-6">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory && ` in ${selectedCategory}`}
        </p>
      )}
      
      {/* Products grid */}
      <ProductGrid 
        products={filteredProducts} 
        loading={loading}
        emptyMessage={
          searchTerm || selectedCategory
            ? "No products match your filters. Try adjusting your search."
            : "No products available yet. Be the first to add one!"
        }
      />
    </div>
  );
};

export default ProductsPage;