import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { getProducts, addProduct, updateProductInterest } from '../utils/storage';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => void;
  addNewProduct: (product: Omit<Product, 'id' | 'createdAt' | 'interestedUsers'>) => Promise<Product>;
  toggleInterest: (productId: string, interested: boolean) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = () => {
    try {
      const productData = getProducts();
      setProducts(productData);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addNewProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'interestedUsers'>) => {
    try {
      setLoading(true);
      const newProduct = addProduct(productData);
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = async (productId: string, interested: boolean) => {
    try {
      setLoading(true);
      const updatedProduct = updateProductInterest(productId, interested);
      setProducts(products.map(p => p.id === productId ? updatedProduct : p));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
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
        toggleInterest 
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