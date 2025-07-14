import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Product } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';

interface ProductSearchProps {
  products: Product[];
  onFilteredResults: (products: Product[]) => void;
}

interface FilterState {
  search: string;
  priceRange: {
    min: string;
    max: string;
  };
  status: string;
  sortBy: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ products, onFilteredResults }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: {
      min: '',
      max: '',
    },
    status: '',
    sortBy: 'newest',
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Price range filter
    if (filters.priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.priceRange.min));
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.priceRange.max));
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.interestedUsers.length - a.interestedUsers.length);
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, filters]);

  // Update parent component with filtered results
  React.useEffect(() => {
    onFilteredResults(filteredAndSortedProducts);
  }, [filteredAndSortedProducts, onFilteredResults]);

  const clearFilters = () => {
    setFilters({
      search: '',
      priceRange: { min: '', max: '' },
      status: '',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = filters.search || filters.priceRange.min || filters.priceRange.max || filters.status || filters.sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition-colors duration-200"
        />
      </div>

      {/* Filter Toggle and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<SlidersHorizontal size={16} />}
          >
            Filters {hasActiveFilters && <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">•</span>}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="secondary"
              onClick={clearFilters}
              leftIcon={<X size={16} />}
            >
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, min: e.target.value }
                  }))}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, max: e.target.value }
                  }))}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredAndSortedProducts.length} of {products.length} products
      </div>
    </div>
  );
};

export default ProductSearch;
