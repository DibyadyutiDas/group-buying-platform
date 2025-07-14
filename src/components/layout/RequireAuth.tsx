import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../loading/Skeleton';

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Skeleton variant="rectangular" height={48} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to login, but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default RequireAuth;