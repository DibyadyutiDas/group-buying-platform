import React, { useEffect, useState } from 'react';
import { Users, Circle } from 'lucide-react';
import { apiCall, API_ENDPOINTS } from '../../utils/api';
import { BackendUser } from '../../types';
import { sanitizeAltText } from '../../utils/helpers';

interface OnlineUsersProps {
  className?: string;
}

const OnlineUsers: React.FC<OnlineUsersProps> = ({ className = '' }) => {
  const [onlineUsers, setOnlineUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await apiCall(API_ENDPOINTS.USERS.GET_ONLINE);
        setOnlineUsers(response.users || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching online users:', err);
        setError('Failed to load online users');
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineUsers();

    // Refresh online users every 30 seconds
    const interval = setInterval(fetchOnlineUsers, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Online Users</h3>
        </div>
        <div className="animate-pulse">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Online Users</h3>
        </div>
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Online Users</h3>
        </div>
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {onlineUsers.length} online
        </span>
      </div>
      
      {onlineUsers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No users currently online</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {onlineUsers.map((user) => (
            <div key={user._id} className="flex items-center">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={sanitizeAltText(user.name)}
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/32/4A90E2/FFFFFF?text=U';
                  }}
                />
                <Circle className="absolute -bottom-1 -right-1 h-3 w-3 text-green-500 fill-current" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Active now
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineUsers;
