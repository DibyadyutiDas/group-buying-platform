import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, BackendProduct, BackendUser } from '../types';
import { getProducts, addProduct, updateProductInterest } from '../utils/storage';
import { apiCall, API_ENDPOINTS, checkBackendHealth } from '../utils/api';
import { useToast } from './ToastContext';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => void;
  addNewProduct: (product: Omit<Product, 'id' | 'createdAt' | 'interestedUsers'>) => Promise<Product>;
  toggleInterest: (productId: string, interested: boolean) => Promise<void>;
  isBackendAvailable: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const { success, error: showError } = useToast();

  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check backend availability
      const backendHealth = await checkBackendHealth();
      setIsBackendAvailable(backendHealth);
      
      if (backendHealth) {
        try {
          const response = await apiCall(API_ENDPOINTS.PRODUCTS.GET_ALL);
          const productsData = response.products || response.data || response;
          
          // Transform backend data to frontend format
          const transformedProducts = productsData.map((product: BackendProduct) => ({
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
            estimatedPurchaseDate: product.estimatedPurchaseDate,
            createdBy: typeof product.createdBy === 'string' 
              ? { id: product.createdBy, name: 'Unknown User', email: '', avatar: '' } 
              : { id: product.createdBy._id, name: product.createdBy.name, email: product.createdBy.email, avatar: product.createdBy.avatar || '' },
            createdAt: product.createdAt,
            interestedUsers: product.interestedUsers.map((user: BackendUser | string) => 
              typeof user === 'string' 
                ? { id: user, name: 'Unknown User', email: '', avatar: '' } 
                : { id: user._id, name: user.name, email: user.email, avatar: user.avatar || '' }
            ),
            status: product.status || 'active'
          }));
          
          setProducts(transformedProducts);
          console.log('Products loaded from backend:', transformedProducts.length);
          return;
        } catch (err) {
          console.warn('Failed to fetch from backend, falling back to local storage:', err);
        }
      }
      
      // Fall back to local storage
      const productData = getProducts();
      setProducts(productData);
      console.log('Products loaded from local storage:', productData.length);
      
    } catch (err) {
      setError('Failed to load products');
      console.error('Product fetch error:', err);
      showError('Error', 'Failed to load products');
      
      // Always fall back to local storage on error
      try {
        const productData = getProducts();
        setProducts(productData);
      } catch (localError) {
        console.error('Local storage fallback failed:', localError);
      }
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addNewProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'interestedUsers'>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isBackendAvailable) {
        try {
          const response = await apiCall(API_ENDPOINTS.PRODUCTS.CREATE, {
            method: 'POST',
            body: JSON.stringify(productData),
          });
          
          const newProduct = response.product || response.data || response;
          
          // Transform backend response to frontend format
          const transformedProduct = {
            id: newProduct._id || newProduct.id,
            title: newProduct.title,
            description: newProduct.description,
            price: newProduct.price,
            image: newProduct.image,
            category: newProduct.category,
            estimatedPurchaseDate: newProduct.estimatedPurchaseDate,
            createdBy: typeof newProduct.createdBy === 'string'
              ? { id: newProduct.createdBy, name: 'Unknown User', email: '', avatar: '' }
              : { id: newProduct.createdBy._id, name: newProduct.createdBy.name, email: newProduct.createdBy.email, avatar: newProduct.createdBy.avatar || '' },
            createdAt: newProduct.createdAt,
            interestedUsers: newProduct.interestedUsers?.map((user: BackendUser | string) => 
              typeof user === 'string' 
                ? { id: user, name: 'Unknown User', email: '', avatar: '' }
                : { id: user._id, name: user.name, email: user.email, avatar: user.avatar || '' }
            ) || [],
            status: newProduct.status || 'active'
          };
          
          setProducts(prev => [transformedProduct, ...prev]);
          success('Product added', 'Your product has been added successfully!');
          return transformedProduct;
        } catch (err) {
          console.warn('Backend product creation failed, using local storage:', err);
          if (err instanceof Error && !err.message.includes('NETWORK_ERROR')) {
            showError('Error', err.message);
            throw err;
          }
        }
      }
      
      // Fall back to local storage
      const newProduct = addProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      success('Product added', 'Your product has been added successfully! (Offline mode)');
      return newProduct;
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showError('Error', 'Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = async (productId: string, interested: boolean) => {
    try {
      setError(null);
      
      if (isBackendAvailable) {
        try {
          const response = await apiCall(API_ENDPOINTS.PRODUCTS.TOGGLE_INTEREST(productId), {
            method: 'POST',
          });
          
          const updatedProduct = response.product || response.data || response;
          
          // Transform backend response to frontend format
          const transformedProduct = {
            id: updatedProduct._id || updatedProduct.id,
            title: updatedProduct.title,
            description: updatedProduct.description,
            price: updatedProduct.price,
            image: updatedProduct.image,
            category: updatedProduct.category,
            estimatedPurchaseDate: updatedProduct.estimatedPurchaseDate,
            createdBy: typeof updatedProduct.createdBy === 'string'
              ? { id: updatedProduct.createdBy, name: 'Unknown User', email: '', avatar: '' }
              : { id: updatedProduct.createdBy._id, name: updatedProduct.createdBy.name, email: updatedProduct.createdBy.email, avatar: updatedProduct.createdBy.avatar || '' },
            createdAt: updatedProduct.createdAt,
            interestedUsers: updatedProduct.interestedUsers?.map((user: BackendUser | string) => 
              typeof user === 'string' 
                ? { id: user, name: 'Unknown User', email: '', avatar: '' }
                : { id: user._id, name: user.name, email: user.email, avatar: user.avatar || '' }
            ) || [],
            status: updatedProduct.status || 'active'
          };
          
          setProducts(prev => prev.map(p => p.id === productId ? transformedProduct : p));
          success(
            interested ? 'Interest added' : 'Interest removed',
            interested ? 'You are now interested in this product' : 'You are no longer interested in this product'
          );
          return;
        } catch (err) {
          console.warn('Backend interest toggle failed, using local storage:', err);
          if (err instanceof Error && !err.message.includes('NETWORK_ERROR')) {
            showError('Error', err.message);
            throw err;
          }
        }
      }
      
      // Fall back to local storage
      const updatedProduct = updateProductInterest(productId, interested);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      success(
        interested ? 'Interest added' : 'Interest removed',
        interested ? 'You are now interested in this product (Offline mode)' : 'You are no longer interested in this product (Offline mode)'
      );
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showError('Error', 'Failed to update interest');
      throw err;
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        loading, 
        error, 
        refreshProducts, 
        addNewProduct, 
        toggleInterest,
        isBackendAvailable
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};