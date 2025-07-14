import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BackendStatus: React.FC = () => {
  const { isBackendAvailable } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {isBackendAvailable ? (
          <>
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400 hidden sm:inline">
              Online
            </span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-yellow-600 dark:text-yellow-400 hidden sm:inline">
              Offline Mode
            </span>
          </>
        )}
      </div>
      
      {!isBackendAvailable && (
        <div 
          className="relative group cursor-help"
          title="Backend server is not available. Using local storage for demo purposes."
        >
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            Backend unavailable - Demo mode
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;
