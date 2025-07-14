const express = require('express');
const { body, query } = require('express-validator');
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/comments/product/:productId
// @desc    Get comments for a specific product
// @access  Public
router.get('/product/:productId', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // First, get top-level comments (no parent)
    const comments = await Comment.find({ 
      productId: req.params.productId, 
      parentComment: null 
    })
      .populate('userId', 'name email avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const totalComments = await Comment.countDocuments({ 
      productId: req.params.productId, 
      parentComment: null 
    });
    const totalPages = Math.ceil(totalComments / limit);

    res.json({
      comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalComments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while fetching comments' });
  }
});

// @route   POST /api/comments
// @desc    Create new comment
// @access  Private
router.post('/', authenticateToken, [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('parentComment')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent comment ID')
], handleValidationErrors, async (req, res) => {
  try {
    const { text, productId, parentComment } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If replying to a comment, verify parent comment exists
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
      if (parentCommentDoc.productId.toString() !== productId) {
        return res.status(400).json({ message: 'Parent comment does not belong to this product' });
      }
    }

    // Create comment
    const comment = new Comment({
      text,
      productId,
      userId: req.user._id,
      parentComment: parentComment || null
    });

    await comment.save();

    // If this is a reply, add it to parent's replies array
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $push: { replies: comment._id }
      });
    }

    // Populate user info before sending response
    await comment.populate('userId', 'name email avatar');

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error while creating comment' });
  }
});

// @route   PUT /api/comments/:id
// @desc    Update comment
// @access  Private (Only comment author)
router.put('/:id', authenticateToken, [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    // Update comment
    comment.text = req.body.text;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    await comment.populate('userId', 'name email avatar');

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }
    res.status(500).json({ message: 'Server error while updating comment' });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private (Only comment author)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // If this comment has a parent, remove it from parent's replies
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id }
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });

    // Delete the comment
    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }
    res.status(500).json({ message: 'Server error while deleting comment' });
  }
});

// @route   POST /api/comments/:id/like
// @desc    Toggle like on comment
// @access  Private
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userId = req.user._id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      // Remove like
      comment.likes = comment.likes.filter(
        id => id.toString() !== userId.toString()
      );
    } else {
      // Add like
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      message: isLiked ? 'Like removed' : 'Like added',
      isLiked: !isLiked,
      likeCount: comment.likes.length
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }
    res.status(500).json({ message: 'Server error while toggling like' });
  }
});

// @route   GET /api/comments/user/:userId
// @desc    Get comments by a specific user
// @access  Public
router.get('/user/:userId', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ userId: req.params.userId })
      .populate('userId', 'name email avatar')
      .populate('productId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalComments = await Comment.countDocuments({ userId: req.params.userId });
    const totalPages = Math.ceil(totalComments / limit);

    res.json({
      comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalComments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error while fetching user comments' });
  }
});

module.exports = router;
