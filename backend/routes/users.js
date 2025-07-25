const express = require('express');
const { body, query } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors, sanitizeEmail, sanitizeId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', authenticateToken, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
], handleValidationErrors, async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    
    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const sanitizedEmail = sanitizeEmail(email);
      const existingUser = await User.findOne({ email: sanitizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Sanitize inputs before database update
    const updateData = {};
    if (name) updateData.name = name.toString().trim();
    if (email) updateData.email = sanitizeEmail(email);
    if (avatar) updateData.avatar = avatar.toString().trim();

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      sanitizeId(req.user._id.toString()),
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error while fetching user' });
  }
});

// @route   GET /api/users
// @desc    Get all users with pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim()
], handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (search) {
      // Escape regex special characters to prevent injection
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Public
router.get('/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get statistics
    const [
      totalProductsCreated,
      totalProductsInterested,
      totalComments,
      activeProducts,
      completedProducts
    ] = await Promise.all([
      Product.countDocuments({ createdBy: userId }),
      Product.countDocuments({ interestedUsers: userId }),
      Comment.countDocuments({ userId }),
      Product.countDocuments({ createdBy: userId, status: 'active' }),
      Product.countDocuments({ createdBy: userId, status: 'completed' })
    ]);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      stats: {
        totalProductsCreated,
        totalProductsInterested,
        totalComments,
        activeProducts,
        completedProducts
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error while fetching user statistics' });
  }
});

// @route   GET /api/users/:id/products
// @desc    Get products created by user
// @access  Public
router.get('/:id/products', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['active', 'completed', 'cancelled']).withMessage('Invalid status')
], handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    // Sanitize user ID parameter
    const sanitizedUserId = sanitizeId(req.params.id);

    // Build query with sanitized inputs
    const query = { createdBy: sanitizedUserId };
    if (status && typeof status === 'string') {
      // Ensure status is a valid enum value
      const validStatuses = ['active', 'inactive', 'pending', 'completed'];
      if (validStatuses.includes(status.trim())) {
        query.status = status.trim();
      }
    }

    // Get products
    const products = await Product.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('interestedUsers', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user products error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error while fetching user products' });
  }
});

// @route   GET /api/users/:id/interested
// @desc    Get products user is interested in
// @access  Public
router.get('/:id/interested', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get products user is interested in
    const products = await Product.find({ interestedUsers: req.params.id })
      .populate('createdBy', 'name email avatar')
      .populate('interestedUsers', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments({ interestedUsers: req.params.id });
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user interested products error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error while fetching interested products' });
  }
});

// @route   GET /api/users/online
// @desc    Get list of online users
// @access  Private
router.get('/online', authenticateToken, async (req, res) => {
  try {
    const onlineUsers = await User.find({ 
      isOnline: true,
      isActive: true 
    })
    .select('name email avatar lastActivity')
    .sort({ lastActivity: -1 })
    .limit(50); // Limit to 50 most recent active users

    res.json({
      users: onlineUsers,
      count: onlineUsers.length
    });
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({ message: 'Error fetching online users' });
  }
});

module.exports = router;
