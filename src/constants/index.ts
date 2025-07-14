// API Configuration
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api';

// App Configuration
export const APP_NAME = 'Group Buying Platform';
export const APP_VERSION = '1.0.0';

// UI Constants
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
} as const;

// Component Sizes
export const SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl'
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADD_PRODUCT: '/add-product'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  CART: 'shopping_cart'
} as const;
