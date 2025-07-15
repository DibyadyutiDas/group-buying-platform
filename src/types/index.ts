export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt?: string;
  isEmailVerified?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  estimatedPurchaseDate: string;
  createdBy: User;
  createdAt: string;
  interestedUsers: User[];
  status?: 'active' | 'completed' | 'cancelled';
}

// Backend data types (with _id instead of id)
export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface BackendProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  estimatedPurchaseDate: string;
  createdBy: BackendUser | string;
  createdAt: string;
  interestedUsers: (BackendUser | string)[];
  status?: 'active' | 'completed' | 'cancelled';
}

export interface BackendComment {
  _id: string;
  productId: BackendProduct | string;
  userId: BackendUser | string;
  text: string;
  createdAt: string;
}