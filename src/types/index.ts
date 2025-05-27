export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
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
}

export interface Comment {
  id: string;
  productId: string;
  userId: string;
  text: string;
  createdAt: string;
}