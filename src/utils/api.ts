// API Configuration
const isDevelopment = import.meta.env.DEV;

// Backend URL configuration
export const API_BASE_URL = (() => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (isDevelopment) {
    return 'http://localhost:5000';
  }
  
  // For production GitHub Pages - CORRECT URL (updated)
  return 'https://group-buying-platform.onrender.com';
})();

console.log('Environment:', isDevelopment ? 'development' : 'production');
console.log('API Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION_OTP: '/api/auth/resend-verification-otp',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_RESET_OTP: '/api/auth/verify-reset-otp',
    RESET_PASSWORD: '/api/auth/reset-password',
    PROFILE: '/api/users/profile',
  },
  PRODUCTS: {
    GET_ALL: '/api/products',
    CREATE: '/api/products',
    GET_BY_ID: (id: string) => `/api/products/${id}`,
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    TOGGLE_INTEREST: (id: string) => `/api/products/${id}/interest`,
  },
  COMMENTS: {
    GET_BY_PRODUCT: (productId: string) => `/api/comments/product/${productId}`,
    CREATE: '/api/comments',
    UPDATE: (id: string) => `/api/comments/${id}`,
    DELETE: (id: string) => `/api/comments/${id}`,
    LIKE: (id: string) => `/api/comments/${id}/like`,
  },
  USERS: {
    GET_ALL: '/api/users',
    GET_BY_ID: (id: string) => `/api/users/${id}`,
    GET_PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    GET_STATS: (id: string) => `/api/users/${id}/stats`,
    GET_PRODUCTS: (id: string) => `/api/users/${id}/products`,
    GET_INTERESTED: (id: string) => `/api/users/${id}/interested`,
  }
};

// Enhanced API call function with better error handling
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };
    
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API call to:', url);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `API call failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        
        // Handle specific error cases
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Authentication required');
        }
        
        if (response.status === 403) {
          throw new Error('Access denied');
        }
        
        if (response.status === 404) {
          throw new Error('Resource not found');
        }
        
        throw new Error(errorMessage);
      } catch (parseError) {
        if (parseError instanceof Error && parseError.message !== errorMessage) {
          throw parseError;
        }
        throw new Error(errorMessage);
      }
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('API Call Error:', error);
    
    // If it's a network error, fall back to local storage
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Network error detected, falling back to local storage');
      throw new Error('NETWORK_ERROR');
    }
    
    throw error;
  }
};

// Health check function with timeout
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    console.log('Checking backend health at:', `${API_BASE_URL}/api/health`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for cold starts
    
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('Health check response status:', response.status);
    console.log('Health check response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Health check data:', data);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Backend health check failed:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
};