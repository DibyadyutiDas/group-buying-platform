const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Comment = require('./models/Comment');

// Sample data
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Alice Brown',
    email: 'alice@example.com',
    password: 'password123',
    role: 'user'
  }
];

const products = [
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation. Perfect for music lovers and professionals.',
    price: 149.99,
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics',
    minQuantity: 5,
    maxQuantity: 50,
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    location: 'New York, NY'
  },
  {
    title: 'Organic Cotton T-Shirts',
    description: 'Premium organic cotton t-shirts in various colors. Comfortable and eco-friendly.',
    price: 29.99,
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Fashion',
    minQuantity: 10,
    maxQuantity: 100,
    tags: ['organic', 'cotton', 'tshirt', 'clothing'],
    location: 'Los Angeles, CA'
  },
  {
    title: 'Smart Home Security Camera',
    description: '1080p HD security camera with night vision and mobile app control.',
    price: 89.99,
    image: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Electronics',
    minQuantity: 3,
    maxQuantity: 25,
    tags: ['security', 'camera', 'smart-home', 'surveillance'],
    location: 'Chicago, IL'
  },
  {
    title: 'Yoga Mat Set',
    description: 'Non-slip yoga mat with carrying strap and blocks. Perfect for home workouts.',
    price: 49.99,
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Sports',
    minQuantity: 8,
    maxQuantity: 40,
    tags: ['yoga', 'fitness', 'exercise', 'mat'],
    location: 'Austin, TX'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/group-buying-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Comment.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create products with random creators and interested users
    const productsWithCreators = products.map((product, index) => {
      const creator = createdUsers[index % createdUsers.length];
      const interestedUsers = createdUsers
        .filter(user => user._id.toString() !== creator._id.toString())
        .slice(0, Math.floor(Math.random() * 3) + 1)
        .map(user => user._id);

      return {
        ...product,
        createdBy: creator._id,
        interestedUsers,
        estimatedPurchaseDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      };
    });

    const createdProducts = await Product.insertMany(productsWithCreators);
    console.log(`Created ${createdProducts.length} products`);

    // Create some sample comments
    const comments = [
      {
        text: 'Great product! I\'\''m definitely interested in this bulk purchase.',
        productId: createdProducts[0]._id,
        userId: createdUsers[1]._id
      },
      {
        text: 'What\'\''s the quality like? Any reviews?',
        productId: createdProducts[0]._id,
        userId: createdUsers[2]._id
      },
      {
        text: 'Love the organic cotton! When are we planning to order?',
        productId: createdProducts[1]._id,
        userId: createdUsers[0]._id
      },
      {
        text: 'Perfect for my home office setup.',
        productId: createdProducts[2]._id,
        userId: createdUsers[3]._id
      }
    ];

    const createdComments = await Comment.insertMany(comments);
    console.log(`Created ${createdComments.length} comments`);

    console.log('Database seeded successfully!');
    console.log('Sample user credentials:');
    console.log('Admin: john@example.com / password123');
    console.log('User: jane@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seeder
seedDatabase();
