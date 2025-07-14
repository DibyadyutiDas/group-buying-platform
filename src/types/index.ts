export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
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

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  estimatedPurchaseDate: string;
  createdBy: string;
  createdAt: string;
  interestedUsers: string[];
  status?: 'active' | 'completed' | 'cancelled';
}

export interface Comment {
  id: string;
  productId: string;
  userId: string;
  text: string;
  createdAt: string;
}