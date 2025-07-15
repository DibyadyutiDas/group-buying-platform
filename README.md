# 🛒 BulkBuy: A Smart Group Buying Platform

---

## 📝 Overview
**BulkBuy** is a collaborative purchasing platform that allows users to share their planned future purchases and connect with others interested in buying the same product. By pooling orders together, users can buy in bulk and enjoy lower costs through collective purchasing power.

## 🚀 Live Demo
- **Frontend**: [https://dibyadyutidas.github.io/group-buying-platform](https://dibyadyutidas.github.io/group-buying-platform)
- **Backend API**: [https://group-buying-platform-backend.onrender.com](https://group-buying-platform-backend.onrender.com)

## 🔧 Deployment Setup

### Frontend (GitHub Pages)
The frontend is automatically deployed to GitHub Pages when you push to the main branch.

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the following environment variables in Render:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   FRONTEND_URL=https://dibyadyutidas.github.io/group-buying-platform
   ```

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs)
4. Get your connection string and add it to your Render environment variables

## 🔒 Security Notice
This repository excludes sensitive files for security purposes. See [SECURITY_GUIDELINES.md](SECURITY_GUIDELINES.md) for details on:
- Environment variables setup
- Files not uploaded to the repository
- Security best practices

---

## 🚀 How It Works
✔️ **User Registration & Login** – Users create an account to manage their purchases and group orders.  
✔️ **Product Wishlist & Future Purchase Plans** – Users add products they intend to buy, along with an estimated purchase date.  
✔️ **Group Purchase Matching** – If multiple users want the same product, they can join forces to place a bulk order.  
✔️ **Discounts & Cost Reduction** – Buying in bulk helps users get better deals from suppliers or retailers.  
✔️ **Community Interaction** – A discussion feature allows users to coordinate, finalize orders, and share insights.  

---

## 🔥 Key Features
✅ **Enhanced Security** – Comprehensive protection against XSS, injection attacks, and vulnerabilities  
✅ **Smart Image System** – Category-specific fallback images for better visual experience  
✅ **User-friendly Dashboard** – Easily track upcoming purchases and group deals  
✅ **Smart Matching Algorithm** – Connect users planning to buy the same item  
✅ **Modern UI/UX** – Dark mode support, responsive design, and intuitive navigation  
✅ **Real-time Notifications** – Toast notifications and status indicators  
✅ **Secure Transactions** – Enhanced validation and data protection  
✅ **Admin Controls** – Manage users, verify deals, and oversee transactions  

## 🔐 Security Features
✅ **15 Security Vulnerabilities Fixed** – Complete CodeQL security audit compliance  
✅ **XSS Prevention** – Comprehensive input sanitization across all components  
✅ **Database Protection** – Injection-proof queries with input validation  
✅ **CORS Security** – Proper origin validation and security headers  
✅ **Error Handling** – Secure error messages without data exposure  

---

## 🎯 Why BulkBuy?
- 💰 **Saves Money** – Leverage bulk discounts for better deals.  
- 🤝 **Community-Driven** – Encourages collective purchasing and planning.  
- 📅 **Smarter Shopping** – Helps users plan their purchases and avoid impulse buying.  

---

## 📂 Project Structure
```yaml
BulkBuy/
│-- src/                  # React.js frontend
│-- backend/              # Node.js + Express.js API
│-- .github/workflows/    # CI/CD pipelines
│-- docs/                 # Documentation
│-- README.md             # This file
```

---

## 🛠 Local Development

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)

### Frontend Setup
```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```sh
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Deployment

### Automatic Deployment
- **Frontend**: Automatically deploys to GitHub Pages on push to main branch
- **Backend**: Deploy to Render by connecting your GitHub repository

### Manual Deployment
```sh
# Frontend
npm run build
npm run deploy

# Backend
# Push to your Render-connected repository
git push origin main
```

---

## 🆕 Recent Updates (July 2025)

### 🔐 Security Enhancements
- **Fixed 15 CodeQL Security Vulnerabilities** - Complete security audit and remediation
- **Enhanced Input Validation** - Multi-layer validation on frontend and backend
- **XSS Prevention** - Comprehensive text sanitization across all components
- **Database Security** - Injection-proof queries with proper input sanitization

### 🎨 UI/UX Improvements  
- **Enhanced Image System** - Category-specific fallback images for better visual diversity
- **Navigation Updates** - Customized header navigation as per user preferences
- **Better Error Handling** - User-friendly error messages and fallback mechanisms
- **Performance Optimizations** - Improved loading states and component efficiency

### 📚 Documentation
- **Security Documentation** - Detailed security improvements and best practices
- **Improvement Tracking** - Comprehensive documentation of completed enhancements
- **Updated README** - Reflects current capabilities and features

For detailed information about improvements, see:
- [Security Improvements](./docs/SECURITY_IMPROVEMENTS.md)
- [Completed Improvements](./docs/IMPROVEMENTS_COMPLETED.md)
- [Improvement Suggestions](./docs/IMPROVEMENT_SUGGESTIONS.md)

---

## 🔧 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure your backend URL is correctly configured in the frontend
2. **Database Connection**: Verify your MongoDB Atlas connection string and IP whitelist
3. **Environment Variables**: Check that all required environment variables are set in Render

### Health Checks
- Frontend: Check browser console for errors
- Backend: Visit `/api/health` endpoint
- Database: Check `/api/db-status` endpoint

---

## 💡 Contributing
We welcome contributions! If you'd like to add new features, fix bugs, or improve documentation:
1. **Fork the repository**
2. **Create a new branch**
3. **Make your changes**
4. **Submit a pull request** 🚀

---

## 📜 License
This project is **open-source** and available under the **MIT License**.