const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=User'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String,
    select: false
  },
  emailVerificationOTPExpires: {
    type: Date,
    select: false
  },
  passwordResetOTP: {
    type: String,
    select: false
  },
  passwordResetOTPExpires: {
    type: Date,
    select: false
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification OTP
userSchema.methods.generateEmailVerificationOTP = function() {
  const crypto = require('crypto');
  const otp = crypto.randomInt(100000, 999999).toString();
  
  this.emailVerificationOTP = otp;
  this.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return otp;
};

// Generate password reset OTP
userSchema.methods.generatePasswordResetOTP = function() {
  const crypto = require('crypto');
  const otp = crypto.randomInt(100000, 999999).toString();
  
  this.passwordResetOTP = otp;
  this.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return otp;
};

// Verify email verification OTP
userSchema.methods.verifyEmailOTP = function(otp) {
  if (!this.emailVerificationOTP || !this.emailVerificationOTPExpires) {
    return false;
  }
  
  if (Date.now() > this.emailVerificationOTPExpires) {
    return false;
  }
  
  return this.emailVerificationOTP === otp;
};

// Verify password reset OTP
userSchema.methods.verifyPasswordResetOTP = function(otp) {
  if (!this.passwordResetOTP || !this.passwordResetOTPExpires) {
    return false;
  }
  
  if (Date.now() > this.passwordResetOTPExpires) {
    return false;
  }
  
  return this.passwordResetOTP === otp;
};

// Clear email verification OTP
userSchema.methods.clearEmailVerificationOTP = function() {
  this.emailVerificationOTP = undefined;
  this.emailVerificationOTPExpires = undefined;
};

// Clear password reset OTP
userSchema.methods.clearPasswordResetOTP = function() {
  this.passwordResetOTP = undefined;
  this.passwordResetOTPExpires = undefined;
};

// Set user online status
userSchema.methods.setOnline = async function() {
  this.isOnline = true;
  this.lastActivity = new Date();
  this.lastLogin = new Date();
  return await this.save();
};

// Set user offline status
userSchema.methods.setOffline = async function() {
  this.isOnline = false;
  this.lastActivity = new Date();
  return await this.save();
};

// Update last activity
userSchema.methods.updateActivity = async function() {
  this.lastActivity = new Date();
  if (this.isOnline) {
    return await this.save();
  }
};

// Check if user should be considered offline (inactive for 5 minutes)
userSchema.methods.shouldBeOffline = function() {
  if (!this.lastActivity) return true;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.lastActivity < fiveMinutesAgo;
};

// Static method to clean up inactive users
userSchema.statics.markInactiveUsersOffline = async function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return await this.updateMany(
    { 
      isOnline: true,
      lastActivity: { $lt: fiveMinutesAgo }
    },
    { 
      isOnline: false 
    }
  );
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
