import React from 'react';
import { Tabs, Tab, TabList, TabPanel } from '../components/ui/Tabs';
import DashboardStats from '../components/dashboard/DashboardStats';
import ActiveGroupBuys from '../components/dashboard/ActiveGroupBuys';
import WishlistItems from '../components/dashboard/WishlistItems';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Dashboard</h1>
        
        <DashboardStats />
        
        <div className="mt-8">
          <Tabs>
            <TabList>
              <Tab>Active Group Buys</Tab>
              <Tab>My Wishlist</Tab>
              <Tab>Purchase History</Tab>
              <Tab>Saved Items</Tab>
            </TabList>
            
            <TabPanel>
              <div className="mt-6">
                <ActiveGroupBuys />
              </div>
            </TabPanel>
            
            <TabPanel>
              <div className="mt-6">
                <WishlistItems />
              </div>
            </TabPanel>
            
            <TabPanel>
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-700 mb-4">No Purchase History Yet</h3>
                  <p className="text-gray-500 mb-6">
                    When you complete a group purchase, it will appear here.
                  </p>
                  <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                    Browse Products
                  </button>
                </div>
              </div>
            </TabPanel>
            
            <TabPanel>
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-700 mb-4">No Saved Items Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Save products you're interested in to keep track of them.
                  </p>
                  <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                    Browse Products
                  </button>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;