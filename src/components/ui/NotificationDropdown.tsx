import React from 'react';
import { BellRing } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Group Match!',
    message: '3 other users want to buy "Apple MacBook Pro" too!',
    time: '5 minutes ago',
    isRead: false
  },
  {
    id: '2',
    title: 'Price Drop Alert',
    message: 'Bulk price for "Samsung 4K TV" dropped by 15%',
    time: '1 hour ago',
    isRead: false
  },
  {
    id: '3',
    title: 'Purchase Deadline',
    message: 'Group purchase for "Wireless Headphones" closes in 24 hours',
    time: '3 hours ago',
    isRead: true
  }
];

const NotificationDropdown: React.FC = () => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10">
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <span className="text-sm text-teal-600 cursor-pointer hover:underline">
            Mark all as read
          </span>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {mockNotifications.length > 0 ? (
          mockNotifications.map(notification => (
            <div 
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.isRead ? 'bg-teal-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className={`mt-1 mr-3 ${!notification.isRead ? 'text-teal-600' : 'text-gray-400'}`}>
                  <BellRing size={16} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
                {!notification.isRead && (
                  <div className="h-2 w-2 bg-teal-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-gray-500">
            <p>No notifications yet</p>
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 border-t border-gray-100">
        <button className="w-full text-center text-sm text-teal-600 hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;