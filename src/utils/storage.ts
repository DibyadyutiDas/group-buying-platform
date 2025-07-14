import { User, Product, Comment } from '../types';

// Mock initial data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Apple MacBook Pro M2',
    description: 'Latest Apple MacBook Pro with M2 chip, 16GB RAM, and 512GB SSD',
    price: 1999.99,
    image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics',
    estimatedPurchaseDate: '2025-06-15',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    interestedUsers: ['2'],
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Wireless Noise Cancelling Headphones with Auto Noise Cancelling Optimizer',
    price: 349.99,
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics',
    estimatedPurchaseDate: '2025-05-20',
    createdBy: '2',
    createdAt: new Date().toISOString(),
    interestedUsers: ['1'],
  },
  {
    id: '3',
    title: 'Ergonomic Office Chair',
    description: 'High-back ergonomic office chair with adjustable height and lumbar support',
    price: 299.99,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Furniture',
    estimatedPurchaseDate: '2025-04-10',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    interestedUsers: [],
  },
];

const mockComments: Comment[] = [
  {
    id: '1',
    productId: '1',
    userId: '1',
    text: 'I\'m planning to buy this next month. Anyone interested in joining?',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    productId: '1',
    userId: '2',
    text: 'I\'m interested! How much discount do you think we could get?',
    createdAt: new Date().toISOString(),
  },
];

// Storage keys
const USERS_KEY = 'bulkbuy_users';
const PRODUCTS_KEY = 'bulkbuy_products';
const COMMENTS_KEY = 'bulkbuy_comments';
const CURRENT_USER_KEY = 'bulkbuy_current_user';

// Initialize local storage with mock data if empty
const initStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
  
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mockProducts));
  }
  
  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(mockComments));
  }
};

// User related functions
export const getUsers = (): User[] => {
  initStorage();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const registerUser = (name: string, email: string, _password: string): User => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    throw new Error('Email already registered');
  }
  
  const newUser: User = {
    id: (users.length + 1).toString(),
    name,
    email,
    avatar: `https://i.pravatar.cc/150?img=${users.length + 3}`,
  };
  
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  
  // In a real app, we would hash the password and store it
  // For this demo, we're just storing the user
  
  return newUser;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loginUser = (email: string, _password: string): User => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // In a real app, we would verify the password hash
  // For this demo, we're just checking the email exists
  
  setCurrentUser(user);
  return user;
};

export const logoutUser = () => {
  setCurrentUser(null);
};

// Product related functions
export const getProducts = (): Product[] => {
  initStorage();
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(product => product.id === id);
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'interestedUsers'>): Product => {
  const products = getProducts();
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  const newProduct: Product = {
    ...product,
    id: (products.length + 1).toString(),
    createdBy: currentUser.id,
    createdAt: new Date().toISOString(),
    interestedUsers: [],
  };
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify([...products, newProduct]));
  
  return newProduct;
};

export const updateProductInterest = (productId: string, interested: boolean): Product => {
  const products = getProducts();
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  const updatedProducts = products.map(product => {
    if (product.id === productId) {
      const interestedUsers = interested
        ? [...product.interestedUsers, currentUser.id]
        : product.interestedUsers.filter(id => id !== currentUser.id);
      
      return { ...product, interestedUsers };
    }
    return product;
  });
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  
  return updatedProducts.find(p => p.id === productId) as Product;
};

// Comment related functions
export const getComments = (productId: string): Comment[] => {
  initStorage();
  const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
  return comments.filter((comment: Comment) => comment.productId === productId);
};

export const addComment = (productId: string, text: string): Comment => {
  const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  const newComment: Comment = {
    id: (comments.length + 1).toString(),
    productId,
    userId: currentUser.id,
    text,
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify([...comments, newComment]));
  
  return newComment;
};