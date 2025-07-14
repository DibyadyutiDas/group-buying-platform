const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

// Additional security validation for database queries
const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email format');
  }
  
  // Basic email format validation to prevent injection
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email.toLowerCase().trim();
};

const sanitizeId = (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid ID format');
  }
  
  // MongoDB ObjectId validation
  const objectIdRegex = /^[a-f\d]{24}$/i;
  if (!objectIdRegex.test(id)) {
    throw new Error('Invalid ID format');
  }
  
  return id;
};

module.exports = { 
  handleValidationErrors,
  sanitizeEmail,
  sanitizeId
};
