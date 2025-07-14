import { API_BASE_URL } from '../utils/api';
import { Product, User, Comment } from '../types';

// Simple fetch wrapper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  register: async (userData: Partial<User>) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  logout: async () => {
    return apiCall('/auth/logout', { method: 'POST' });
  },
  
  refreshToken: async () => {
    return apiCall('/auth/refresh', { method: 'POST' });
  }
};

// Product Services
export const productService = {
  getAll: async () => {
    return apiCall('/products');
  },
  
  getById: async (id: string) => {
    return apiCall(`/products/${id}`);
  },
  
  create: async (productData: Partial<Product>) => {
    return apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },
  
  update: async (id: string, productData: Partial<Product>) => {
    return apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/products/${id}`, { method: 'DELETE' });
  },
  
  search: async (query: string) => {
    return apiCall(`/products/search?q=${encodeURIComponent(query)}`);
  }
};

// Comment Services
export const commentService = {
  getByProductId: async (productId: string) => {
    return apiCall(`/products/${productId}/comments`);
  },
  
  create: async (productId: string, commentData: Partial<Comment>) => {
    return apiCall(`/products/${productId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  },
  
  update: async (commentId: string, commentData: Partial<Comment>) => {
    return apiCall(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(commentData)
    });
  },
  
  delete: async (commentId: string) => {
    return apiCall(`/comments/${commentId}`, { method: 'DELETE' });
  }
};

// User Services
export const userService = {
  getProfile: async () => {
    return apiCall('/users/profile');
  },
  
  updateProfile: async (userData: Partial<User>) => {
    return apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },
  
  getUsers: async () => {
    return apiCall('/users');
  }
};
