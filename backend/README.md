# Group Buying Platform Backend

A comprehensive backend API for a group buying platform built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with registration, login, and profile management
- **Product Management**: CRUD operations for products with categories, pricing, and interest tracking
- **Comment System**: Nested comments with likes and replies
- **User Profiles**: User statistics, product tracking, and interest management
- **Search & Filtering**: Advanced search capabilities with pagination
- **Security**: Rate limiting, input validation, and security headers
- **Image Upload**: Cloudinary integration for image handling

## Tech Stack

- **Backend Framework**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Image Storage**: Cloudinary
- **Development**: Nodemon for hot reloading

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Password reset

### Products
- `GET /api/products` - Get all products (with pagination, filtering, search)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (authenticated)
- `PUT /api/products/:id` - Update product (creator only)
- `DELETE /api/products/:id` - Delete product (creator only)
- `POST /api/products/:id/interest` - Toggle interest in product
- `GET /api/products/user/:userId` - Get products by user

### Comments
- `GET /api/comments/product/:productId` - Get comments for product
- `POST /api/comments` - Create new comment (authenticated)
- `PUT /api/comments/:id` - Update comment (author only)
- `DELETE /api/comments/:id` - Delete comment (author only)
- `POST /api/comments/:id/like` - Toggle like on comment
- `GET /api/comments/user/:userId` - Get comments by user

### Users
- `GET /api/users/profile` - Get current user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - Get all users (with pagination, search)
- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/users/:id/products` - Get products created by user
- `GET /api/users/:id/interested` - Get products user is interested in

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd group-buying-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `CLOUDINARY_*`: Cloudinary credentials for image uploads
   - `EMAIL_*`: Email service configuration (optional)

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/group-buying-platform
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email settings (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Database Schema

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `avatar`: String (profile image URL)
- `role`: String (user/admin)
- `isActive`: Boolean
- `lastLogin`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Product Model
- `title`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `image`: String (product image URL)
- `category`: String (predefined categories)
- `estimatedPurchaseDate`: Date (required)
- `createdBy`: ObjectId (User reference)
- `interestedUsers`: Array of ObjectIds (User references)
- `status`: String (active/completed/cancelled)
- `minQuantity`: Number (minimum users needed)
- `maxQuantity`: Number (maximum users allowed)
- `currentQuantity`: Number (current interested users)
- `tags`: Array of Strings
- `location`: String
- `createdAt`: Date
- `updatedAt`: Date

### Comment Model
- `text`: String (required)
- `productId`: ObjectId (Product reference)
- `userId`: ObjectId (User reference)
- `parentComment`: ObjectId (Comment reference, for replies)
- `replies`: Array of ObjectIds (Comment references)
- `likes`: Array of ObjectIds (User references)
- `isEdited`: Boolean
- `editedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation using Express Validator
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configured for frontend origin
- **Password Hashing**: bcrypt for password security

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── models/          # Mongoose models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── server.js        # Main server file
├── package.json     # Dependencies
└── .env.example     # Environment variables template
```

## API Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { ... },
  "pagination": { ... } // if applicable
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": [ ... ] // validation errors if applicable
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
