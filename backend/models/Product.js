const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300/E5E7EB/6B7280?text=Product+Image'
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty', 'Other'],
    trim: true
  },
  estimatedPurchaseDate: {
    type: Date,
    required: [true, 'Estimated purchase date is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interestedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  minQuantity: {
    type: Number,
    default: 2,
    min: [1, 'Minimum quantity must be at least 1']
  },
  maxQuantity: {
    type: Number,
    default: 100,
    min: [1, 'Maximum quantity must be at least 1']
  },
  currentQuantity: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update current quantity based on interested users
productSchema.pre('save', function(next) {
  this.currentQuantity = this.interestedUsers.length;
  next();
});

// Virtual for checking if product has enough interest
productSchema.virtual('hasMinimumInterest').get(function() {
  return this.interestedUsers.length >= this.minQuantity;
});

// Virtual for progress percentage
productSchema.virtual('progressPercentage').get(function() {
  return Math.min((this.interestedUsers.length / this.minQuantity) * 100, 100);
});

// Add indexes for better query performance
productSchema.index({ createdBy: 1, createdAt: -1 });
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ estimatedPurchaseDate: 1 });

module.exports = mongoose.model('Product', productSchema);
