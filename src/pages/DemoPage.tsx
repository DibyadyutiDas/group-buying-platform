import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/common/ProgressBar';
import CountdownTimer from '../components/common/CountdownTimer';
import UserProfile from '../components/common/UserProfile';
import Card from '../components/common/Card';
import AdvancedSearch from '../components/forms/AdvancedSearch';

interface SearchFilters {
  searchTerm: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  startDate: string;
  endDate: string;
  sortBy: string;
}

const DemoPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    sortBy: 'newest',
  });

  // Demo data
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Passionate about smart shopping and finding great deals through group buying.',
    location: 'San Francisco, CA',
    joinDate: '2025-01-15',
    website: 'https://example.com',
    verified: true,
  };

  const mockStats = {
    totalPurchases: 23,
    totalSavings: 1240.50,
    groupsJoined: 15,
    groupsCreated: 8,
    rating: 4.8,
    reviewCount: 42,
  };

  const mockAchievements = [
    {
      id: '1',
      title: 'Super Saver',
      description: 'Saved over $1000 through group buying',
      icon: '💰',
      earnedDate: '2025-06-15',
      rarity: 'epic' as const,
    },
    {
      id: '2',
      title: 'Community Builder',
      description: 'Created 5+ successful group purchases',
      icon: '👥',
      earnedDate: '2025-05-20',
      rarity: 'rare' as const,
    },
  ];

  const categories = ['Electronics', 'Books', 'Clothing', 'Food', 'Sports', 'Home'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 New Features Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore the latest enhancements to the BulkBuy platform including advanced search, 
            progress tracking, countdown timers, and enhanced user profiles.
          </p>
        </div>

        {/* Advanced Search Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🔍 Advanced Search & Filtering
          </h2>
          <AdvancedSearch
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Current Filters:</h3>
            <pre className="text-sm text-blue-800 dark:text-blue-300">
              {JSON.stringify(filters, null, 2)}
            </pre>
          </div>
        </section>

        {/* Progress Bars Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            📊 Group Buying Progress Bars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">iPhone 15 Pro Group Buy</h3>
              <ProgressBar
                current={7}
                target={10}
                label="Members Joined"
                variant="default"
                size="md"
              />
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Gaming Laptop Deal</h3>
              <ProgressBar
                current={12}
                target={10}
                label="Target Reached!"
                variant="success"
                size="md"
              />
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Smart Watch Bundle</h3>
              <ProgressBar
                current={3}
                target={15}
                label="Early Stage"
                variant="warning"
                size="md"
              />
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Book Collection</h3>
              <ProgressBar
                current={9}
                target={10}
                label="Almost There!"
                variant="default"
                size="md"
              />
            </Card>
          </div>
        </section>

        {/* Countdown Timers Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            ⏱️ Purchase Deadline Countdown Timers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <h4 className="font-medium mb-3">Laptop Deal</h4>
              <CountdownTimer
                targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
                size="sm"
              />
            </Card>
            
            <Card className="p-4 text-center">
              <h4 className="font-medium mb-3">Phone Bundle</h4>
              <CountdownTimer
                targetDate={new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()}
                size="sm"
              />
            </Card>
            
            <Card className="p-4 text-center">
              <h4 className="font-medium mb-3">Camera Kit</h4>
              <CountdownTimer
                targetDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
                size="sm"
                showDays={true}
                showHours={false}
                showMinutes={false}
                showSeconds={false}
              />
            </Card>
            
            <Card className="p-4 text-center">
              <h4 className="font-medium mb-3">Furniture Set</h4>
              <CountdownTimer
                targetDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
                size="sm"
              />
            </Card>
          </div>
        </section>

        {/* User Profile Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            👤 Enhanced User Profiles
          </h2>
          <UserProfile
            user={mockUser}
            stats={mockStats}
            achievements={mockAchievements}
            isOwnProfile={false}
            isFollowing={false}
            onFollow={() => console.log('Follow clicked')}
            onUnfollow={() => console.log('Unfollow clicked')}
            onMessage={() => console.log('Message clicked')}
          />
        </section>

        {/* Features Summary */}
        <section className="mb-8">
          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              ✨ Features Implemented
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  ✅ Completed Features:
                </h3>
                <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                  <li>• Advanced Search & Filtering with price, date, category filters</li>
                  <li>• Group Buying Progress Bars with visual indicators</li>
                  <li>• Purchase Deadline Countdown Timers</li>
                  <li>• Enhanced User Profiles with stats and achievements</li>
                  <li>• Category-specific Image Fallback System</li>
                  <li>• Comprehensive Security Improvements</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  🚀 Ready for Production:
                </h3>
                <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                  <li>• All components are fully responsive</li>
                  <li>• Dark mode support across all features</li>
                  <li>• TypeScript type safety</li>
                  <li>• Accessibility considerations</li>
                  <li>• Optimized performance</li>
                  <li>• Security audit compliance</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default DemoPage;
