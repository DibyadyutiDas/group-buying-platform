const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { handleValidationErrors, sanitizeEmail } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (sends OTP for verification)
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Debug: Log the incoming request data
    console.log('Registration attempt:', {
      name,
      email: email ? email.substring(0, 3) + '***' : 'undefined',
      passwordProvided: !!password,
      timestamp: new Date().toISOString()
    });

    // Sanitize email to prevent injection
    const sanitizedEmail = sanitizeEmail(email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user (but don't save yet, will save after OTP verification)
    const user = new User({
      name,
      email: sanitizedEmail,
      password,
      isEmailVerified: false
    });

    // Generate OTP for email verification
    const otp = user.generateEmailVerificationOTP();
    
    // Save user with OTP
    await user.save();
    
    // Send OTP email
    const emailResult = await emailService.sendEmailVerificationOTP(sanitizedEmail, otp, name);
    
    if (!emailResult.success) {
      // If email fails, delete the user and return error
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please try again.',
        error: emailResult.error 
      });
    }
    
    console.log('User registered with OTP:', user._id);

    res.status(201).json({
      message: 'Registration successful! Please check your email for the verification code.',
      userId: user._id,
      email: user.email,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'User already exists with this email',
        field: Object.keys(error.keyPattern)[0]
      });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post('/verify-email', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
], handleValidationErrors, async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Sanitize email to prevent injection
    const sanitizedEmail = sanitizeEmail(email);

    // Find user with OTP fields
    const user = await User.findOne({ email: sanitizedEmail })
      .select('+emailVerificationOTP +emailVerificationOTPExpires');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Verify OTP
    if (!user.verifyEmailOTP(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.clearEmailVerificationOTP();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully! You can now log in.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
});

// @route   POST /api/auth/resend-verification-otp
// @desc    Resend email verification OTP
// @access  Public
router.post('/resend-verification-otp', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;

    // Sanitize email to prevent injection
    const sanitizedEmail = sanitizeEmail(email);

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new OTP
    const otp = user.generateEmailVerificationOTP();
    await user.save();

    // Send OTP email
    const emailResult = await emailService.sendEmailVerificationOTP(email, otp, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please try again.',
        error: emailResult.error 
      });
    }

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sanitize email to prevent injection
    const sanitizedEmail = sanitizeEmail(email);

    // Find user and include password field
    const user = await User.findOne({ email: sanitizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        email: user.email
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Mark user as online
    await user.setOnline();

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        isOnline: user.isOnline,
        lastActivity: user.lastActivity
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP
// @access  Public
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;

    // Sanitize email to prevent injection
    const sanitizedEmail = sanitizeEmail(email);

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    // Generate password reset OTP
    const otp = user.generatePasswordResetOTP();
    await user.save();

    // Send OTP email
    const emailResult = await emailService.sendPasswordResetOTP(email, otp, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        message: 'Failed to send password reset email. Please try again.',
        error: emailResult.error 
      });
    }
    
    res.json({ message: 'Password reset code sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify password reset OTP
// @access  Public
router.post('/verify-reset-otp', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
], handleValidationErrors, async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Sanitize email to prevent injection
    const sanitizedEmail = sanitizeEmail(email);

    // Find user with password reset OTP fields
    const user = await User.findOne({ email: sanitizedEmail })
      .select('+passwordResetOTP +passwordResetOTPExpires');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    if (!user.verifyPasswordResetOTP(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ 
      message: 'OTP verified successfully. You can now reset your password.',
      resetToken: otp // Use OTP as temporary reset token
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], handleValidationErrors, async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Sanitize email to prevent injection
    const sanitizedEmail = sanitizeEmail(email);

    // Find user with password reset OTP fields
    const user = await User.findOne({ email: sanitizedEmail })
      .select('+passwordResetOTP +passwordResetOTPExpires +password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    if (!user.verifyPasswordResetOTP(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password and clear OTP
    user.password = newPassword;
    user.clearPasswordResetOTP();
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user and set offline status
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Set user offline
    await req.user.setOffline();
    
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

module.exports = router;
