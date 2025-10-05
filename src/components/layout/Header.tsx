import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Wifi, WifiOff, User, LogOut, CircleUser as UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import Button from '../common/Button';
import ThemeToggle from '../navigation/ThemeToggle';
import NotificationBadge from '../navigation/NotificationBadge';
import { sanitizeText } from '../../utils/helpers';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading, logout, isBackendAvailable: authBackendAvailable } = useAuth();
  const { isBackendAvailable: productBackendAvailable } = useProducts();
  const location = useLocation();
  
  const isBackendAvailable = authBackendAvailable && productBackendAvailable;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };
  
  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Browse Products', path: '/products' },
    { title: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { title: 'Add Product', path: '/products/new', requiresAuth: true },
  ];
  
  const filteredNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && user)
  );

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <ShoppingBag className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">BulkBuy</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {filteredNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                  location.pathname === item.path
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-100'
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isBackendAvailable ? (
              <div className="flex items-center text-green-600 dark:text-green-400" title="Backend Connected">
                <Wifi className="h-4 w-4" />
                <span className="ml-1 text-xs">Online</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-600 dark:text-orange-400" title="Using Local Storage">
                <WifiOff className="h-4 w-4" />
                <span className="ml-1 text-xs">Offline</span>
              </div>
            )}
            <ThemeToggle />
            
            {loading ? (
              <div className="flex space-x-3">
                <div className="w-20 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                <NotificationBadge />
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-gray-200 dark:ring-gray-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {sanitizeText(user.name)}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <UserCircle className="h-4 w-4 mr-3" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-100'
                }`}
                onClick={closeMenu}
              >
                {item.title}
              </Link>
            ))}
          </div>
          
          {/* Mobile user actions */}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="px-4 py-2 space-y-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center px-4 py-2">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-gray-200 dark:ring-gray-700 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">
                      {sanitizeText(user.name)}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {sanitizeText(user.email)}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <NotificationBadge />
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <UserCircle className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-2 space-y-2">
                <Link
                  to="/login"
                  className="block text-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;