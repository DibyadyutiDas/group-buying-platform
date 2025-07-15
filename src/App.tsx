import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import RequireAuth from './components/layout/RequireAuth';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserProfilePage from './pages/UserProfilePage';
import DemoPage from './pages/DemoPage';

function App() {
  // Get basename for GitHub Pages deployment
  const basename = import.meta.env.DEV ? '/' : '/group-buying-platform';
  
  return (
    <ErrorBoundary>
      <Router basename={basename}>
        <ThemeProvider>
          <ToastProvider>
            <NotificationProvider>
              <AuthProvider>
                <ProductProvider>
                  <Routes>
                    <Route path="/" element={<Layout><HomePage /></Layout>} />
                    <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
                    <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
                    <Route 
                      path="/products/new" 
                      element={
                        <RequireAuth>
                          <Layout><AddProductPage /></Layout>
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <RequireAuth>
                          <Layout><DashboardPage /></Layout>
                        </RequireAuth>
                      } 
                    />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/profile/:userId" element={<UserProfilePage />} />
                    <Route path="/demo" element={<Layout><DemoPage /></Layout>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
              </ProductProvider>
            </AuthProvider>
            </NotificationProvider>
          </ToastProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;