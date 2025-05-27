import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from '../ui/NotificationDropdown';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <ShoppingBag className="h-8 w-8 text-teal-600" />
          <span className="ml-2 text-2xl font-bold text-gray-800">BulkBuy</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-teal-600 transition-colors">
            Products
          </Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-teal-600 transition-colors">
            Dashboard
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center space-x-5">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-700 hover:text-teal-600 transition-colors relative"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>
                {showNotifications && <NotificationDropdown />}
              </div>
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.avatar || 'https://i.pravatar.cc/150?u=default'} 
                  alt="User Avatar" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="relative group">
                  <button className="text-gray-700 hover:text-teal-600">
                    {user?.name}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 hidden group-hover:block">
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-teal-50">
                      Dashboard
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors py-2">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-teal-600 transition-colors py-2">
              Products
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-teal-600 transition-colors py-2">
              Dashboard
            </Link>
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 py-2">
                  <img 
                    src={user?.avatar || 'https://i.pravatar.cc/150?u=default'} 
                    alt="User Avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user?.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-teal-600 transition-colors py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-colors text-center"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;