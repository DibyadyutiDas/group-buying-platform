const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');
const { getStats } = require('./utils/database');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

app.use(compression());

// Enhanced logging
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400
}));

app.use(limiter);

// Enhanced CORS configuration for production
const allowedOrigins = [
  'https://dibyadyutidas.github.io',
  'https://dibyadyutidas.github.io/group-buying-platform',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    console.log('CORS check for origin:', origin);
    
    // Check if origin is in allowed list or matches pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (origin === allowedOrigin) return true;
      // More secure domain checking for GitHub Pages with proper URL validation
      if (allowedOrigin === 'https://dibyadyutidas.github.io') {
        try {
          const originUrl = new URL(origin);
          const allowedUrl = new URL(allowedOrigin);
          // Check exact hostname match and secure protocol
          return originUrl.hostname === allowedUrl.hostname && 
                 originUrl.protocol === 'https:';
        } catch (e) {
          return false;
        }
      }
      return false;
    });
    
    if (isAllowed) {
      console.log('CORS allowed for origin:', origin);
      return callback(null, true);
    }
    
    // For debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('CORS Development mode - allowing origin:', origin);
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Request logging middleware for debugging
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const truncatedUserAgent = userAgent ? userAgent.substring(0, 50) + '...' : 'Unknown';
  
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    userAgent: truncatedUserAgent,
    contentType: req.headers['content-type']
  };
  
  console.log('%s - %s %s', logData.timestamp, logData.method, logData.path, {
    origin: logData.origin,
    userAgent: logData.userAgent,
    contentType: logData.contentType
  });
  next();
});

// User activity tracking middleware
const { trackUserActivity, cleanupInactiveUsers } = require('./middleware/userActivity');
app.use(trackUserActivity);

// Start cleanup process for inactive users
cleanupInactiveUsers();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'BulkBuy API Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      comments: '/api/comments',
      users: '/api/users'
    }
  });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    const stats = await getStats();
    res.json({
      status: 'connected',
      ...stats
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({ 
      status: 'error',
      error: 'Failed to get database status',
      message: error.message
    });
  }
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'BulkBuy API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/verify-email': 'Verify email with OTP',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password with OTP'
      },
      products: {
        'GET /api/products': 'Get all products',
        'POST /api/products': 'Create new product (auth required)',
        'GET /api/products/:id': 'Get product by ID',
        'PUT /api/products/:id': 'Update product (creator only)',
        'DELETE /api/products/:id': 'Delete product (creator only)',
        'POST /api/products/:id/interest': 'Toggle interest in product (auth required)'
      },
      comments: {
        'GET /api/comments/product/:productId': 'Get comments for product',
        'POST /api/comments': 'Create comment (auth required)',
        'PUT /api/comments/:id': 'Update comment (author only)',
        'DELETE /api/comments/:id': 'Delete comment (author only)',
        'POST /api/comments/:id/like': 'Toggle like on comment (auth required)'
      },
      users: {
        'GET /api/users/profile': 'Get current user profile (auth required)',
        'PUT /api/users/profile': 'Update user profile (auth required)',
        'GET /api/users/:id': 'Get user by ID',
        'GET /api/users/:id/stats': 'Get user statistics'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed',
      origin: req.headers.origin
    });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'The provided ID is not valid'
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/docs',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/products',
      'POST /api/products'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;