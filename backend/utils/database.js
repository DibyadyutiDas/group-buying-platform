const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Comment = require('../models/Comment');

/**
 * Database utility functions
 */

// Check if MongoDB is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get database statistics
const getStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const commentCount = await Comment.countDocuments();
    
    return {
      connected: isConnected(),
      database: mongoose.connection.name,
      collections: {
        users: userCount,
        products: productCount,
        comments: commentCount
      },
      dbStats: {
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
        avgObjSize: stats.avgObjSize
      }
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
};

// Clean up test data
const cleanupTestData = async () => {
  try {
    // Remove test users (those with 'test' in email)
    await User.deleteMany({ email: /test/i });
    
    // Remove products older than 30 days with no interested users
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Product.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      interestedUsers: { $size: 0 }
    });
    
    // Remove comments for deleted products
    const existingProductIds = await Product.distinct('_id');
    await Comment.deleteMany({ productId: { $nin: existingProductIds } });
    
    console.log('Test data cleanup completed');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
};

// Create database indexes for better performance
const createIndexes = async () => {
  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ createdAt: -1 });
    
    // Product indexes
    await Product.collection.createIndex({ createdBy: 1, createdAt: -1 });
    await Product.collection.createIndex({ category: 1, createdAt: -1 });
    await Product.collection.createIndex({ status: 1, createdAt: -1 });
    await Product.collection.createIndex({ estimatedPurchaseDate: 1 });
    await Product.collection.createIndex({ 'interestedUsers': 1 });
    
    // Comment indexes
    await Comment.collection.createIndex({ productId: 1, createdAt: -1 });
    await Comment.collection.createIndex({ userId: 1, createdAt: -1 });
    await Comment.collection.createIndex({ parentComment: 1, createdAt: 1 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

// Backup database (creates JSON export)
const backupDatabase = async () => {
  try {
    const users = await User.find({}).lean();
    const products = await Product.find({}).populate('createdBy interestedUsers').lean();
    const comments = await Comment.find({}).populate('userId productId').lean();
    
    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        users: users.length,
        products: products.length,
        comments: comments.length
      }
    };
    
    // In a real application, you'd save this to a file or cloud storage
    console.log('Backup created:', backup);
    return backup;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
};

// Validate data integrity
const validateDataIntegrity = async () => {
  try {
    const issues = [];
    
    // Check for products without valid creators
    const productsWithInvalidCreators = await Product.find({
      createdBy: { $exists: false }
    });
    if (productsWithInvalidCreators.length > 0) {
      issues.push(`Found ${productsWithInvalidCreators.length} products without creators`);
    }
    
    // Check for comments without valid products
    const allProductIds = await Product.distinct('_id');
    const orphanComments = await Comment.find({
      productId: { $nin: allProductIds }
    });
    if (orphanComments.length > 0) {
      issues.push(`Found ${orphanComments.length} orphaned comments`);
    }
    
    // Check for users with invalid email formats
    const usersWithInvalidEmails = await User.find({
      email: { $not: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ }
    });
    if (usersWithInvalidEmails.length > 0) {
      issues.push(`Found ${usersWithInvalidEmails.length} users with invalid emails`);
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  } catch (error) {
    console.error('Error validating data integrity:', error);
    return { isValid: false, issues: ['Validation failed'] };
  }
};

module.exports = {
  isConnected,
  getStats,
  cleanupTestData,
  createIndexes,
  backupDatabase,
  validateDataIntegrity
};
