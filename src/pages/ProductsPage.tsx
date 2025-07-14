import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductGrid from '../components/product/ProductGrid';
import AdvancedSearch from '../components/forms/AdvancedSearch';
import Button from '../components/common/Button';

interface SearchFilters {
  searchTerm: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  startDate: string;
  endDate: string;
  sortBy: string;
}

const ProductsPage: React.FC = () => {
  const { products, loading } = useProducts();
  const { user } = useAuth();
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    sortBy: 'newest',
  });
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  useEffect(() => {
    // Apply filters whenever products or filters change
    let filtered = [...products];
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.title.toLowerCase().includes(term) || 
          product.description.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    
    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }
    
    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(product => 
        new Date(product.estimatedPurchaseDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(product => 
        new Date(product.estimatedPurchaseDate) <= new Date(filters.endDate)
      );
    }
    
    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popularity':
          return b.interestedUsers.length - a.interestedUsers.length;
        case 'deadline':
          return new Date(a.estimatedPurchaseDate).getTime() - new Date(b.estimatedPurchaseDate).getTime();
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    setFilteredProducts(filtered);
  }, [products, filters]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Products</h1>
            <p className="text-gray-600 dark:text-gray-300">
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
        
        {/* Advanced Search */}
        <AdvancedSearch
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
        />
        
        {/* Results count */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {filters.searchTerm && ` for "${filters.searchTerm}"`}
              {filters.category && ` in ${filters.category}`}
            </p>
            
            {filteredProducts.length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sorted by: {filters.sortBy.replace('-', ' ')}
              </div>
            )}
          </div>
        )}
        
        {/* Products grid */}
        <ProductGrid 
          products={filteredProducts} 
          loading={loading}
          emptyMessage={
            Object.values(filters).some(value => value !== '' && value !== 'newest')
              ? "No products match your filters. Try adjusting your search criteria."
              : "No products available yet. Be the first to add one!"
          }
        />
      </div>
    </div>
  );
};

export default ProductsPage;