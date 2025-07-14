const express = require('express');
const { body, query } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with pagination and filtering
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().trim(),
  query('search').optional().trim(),
  query('sort').optional().isIn(['newest', 'oldest', 'price-low', 'price-high']).withMessage('Invalid sort option')
], handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, search, sort } = req.query;

    // Build query
    const query = { status: 'active' };
    
    // Sanitize inputs
    if (category && category !== 'all' && typeof category === 'string') {
      // Validate category against known values
      const validCategories = ['electronics', 'clothing', 'books', 'home', 'sports', 'other'];
      if (validCategories.includes(category.trim().toLowerCase())) {
        query.category = category.trim().toLowerCase();
      }
    }
    
    if (search && typeof search === 'string') {
      // Sanitize search input and escape regex special characters
      const sanitizedSearch = search.trim().slice(0, 100); // Limit length
      const escapedSearch = sanitizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (escapedSearch.length > 0) {
        query.$or = [
          { title: { $regex: escapedSearch, $options: 'i' } },
          { description: { $regex: escapedSearch, $options: 'i' } },
          { tags: { $in: [new RegExp(escapedSearch, 'i')] } }
        ];
      }
    }

    // Build sort with validation
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort && typeof sort === 'string') {
      const validSorts = ['oldest', 'price-low', 'price-high'];
      if (sort === 'oldest') sortOption = { createdAt: 1 };
      else if (sort === 'price-low') sortOption = { price: 1 };
      else if (sort === 'price-high') sortOption = { price: -1 };
    }

    // Get products with pagination
    const products = await Product.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('interestedUsers', 'name email avatar')
      .sort(sortOption)
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
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('interestedUsers', 'name email avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private
router.post('/', authenticateToken, [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty', 'Other'])
    .withMessage('Invalid category'),
  body('estimatedPurchaseDate')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('minQuantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum quantity must be at least 1'),
  body('maxQuantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum quantity must be at least 1')
], handleValidationErrors, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Validate that estimatedPurchaseDate is in the future
    const purchaseDate = new Date(req.body.estimatedPurchaseDate);
    if (purchaseDate <= new Date()) {
      return res.status(400).json({ message: 'Estimated purchase date must be in the future' });
    }

    // Validate minQuantity <= maxQuantity
    if (productData.minQuantity && productData.maxQuantity && productData.minQuantity > productData.maxQuantity) {
      return res.status(400).json({ message: 'Minimum quantity cannot be greater than maximum quantity' });
    }

    const product = new Product(productData);
    await product.save();

    // Populate the created product before sending response
    await product.populate('createdBy', 'name email avatar');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Only product creator)
router.put('/:id', authenticateToken, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isIn(['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty', 'Other'])
    .withMessage('Invalid category'),
  body('estimatedPurchaseDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
], handleValidationErrors, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the product creator
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Validate estimatedPurchaseDate if provided
    if (req.body.estimatedPurchaseDate) {
      const purchaseDate = new Date(req.body.estimatedPurchaseDate);
      if (purchaseDate <= new Date()) {
        return res.status(400).json({ message: 'Estimated purchase date must be in the future' });
      }
    }

    // Update product
    Object.assign(product, req.body);
    await product.save();

    await product.populate('createdBy', 'name email avatar');
    await product.populate('interestedUsers', 'name email avatar');

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Only product creator)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the product creator
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// @route   POST /api/products/:id/interest
// @desc    Toggle user interest in product
// @access  Private
router.post('/:id/interest', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const userId = req.user._id;
    const isInterested = product.interestedUsers.includes(userId);

    if (isInterested) {
      // Remove interest
      product.interestedUsers = product.interestedUsers.filter(
        id => id.toString() !== userId.toString()
      );
    } else {
      // Add interest
      product.interestedUsers.push(userId);
    }

    await product.save();

    await product.populate('createdBy', 'name email avatar');
    await product.populate('interestedUsers', 'name email avatar');

    res.json({
      message: isInterested ? 'Interest removed' : 'Interest added',
      product,
      isInterested: !isInterested
    });
  } catch (error) {
    console.error('Toggle interest error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while toggling interest' });
  }
});

// @route   GET /api/products/user/:userId
// @desc    Get products created by a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.params.userId })
      .populate('createdBy', 'name email avatar')
      .populate('interestedUsers', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get user products error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error while fetching user products' });
  }
});

module.exports = router;
