import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Layout from '../components/layout/Layout';
import UserProfile from '../components/common/UserProfile';
import Button from '../components/common/Button';
import SkeletonLoader from '../components/loading/SkeletonLoader';
import { User } from '../types';
import { getUserById } from '../utils/storage';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user stats - in real app, this would come from API
  const mockStats = {
    totalPurchases: 23,
    totalSavings: 1240.50,
    groupsJoined: 15,
    groupsCreated: 8,
    rating: 4.8,
    reviewCount: 42,
  };

  // Mock achievements - in real app, this would come from API
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
    {
      id: '3',
      title: 'Early Adopter',
      description: 'One of the first 100 users on the platform',
      icon: '🌟',
      earnedDate: '2025-01-10',
      rarity: 'legendary' as const,
    },
    {
      id: '4',
      title: 'Reliable Buyer',
      description: 'Completed 20+ group purchases',
      icon: '🛒',
      earnedDate: '2025-07-01',
      rarity: 'common' as const,
    },
  ];

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        if (userId) {
          const userData = getUserById(userId);
          if (userData) {
            setUser(userData);
            // Mock following status
            setIsFollowing(Math.random() > 0.5);
          } else {
            showToast('error', 'User not found');
            navigate('/');
          }
        } else if (currentUser) {
          // Show current user's profile
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        showToast('error', 'Failed to load user profile');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, currentUser, showToast, navigate]);

  const handleFollow = () => {
    setIsFollowing(true);
    showToast('success', `Now following ${user?.name}`);
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    showToast('info', `Unfollowed ${user?.name}`);
  };

  const handleMessage = () => {
    showToast('info', 'Messaging feature coming soon!');
  };

  const isOwnProfile = !userId || userId === currentUser?.id;

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              User Not Found
            </h1>
            <Button onClick={() => navigate('/')}>
              Return Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          
          {isOwnProfile && (
            <Button
              variant="outline"
              leftIcon={<Settings size={18} />}
              onClick={() => showToast('info', 'Profile settings coming soon!')}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* User Profile Component */}
        <UserProfile
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: 'Passionate about smart shopping and finding great deals through group buying. Love connecting with like-minded people to save money together!',
            location: 'San Francisco, CA',
            joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A',
            website: 'https://example.com',
            phone: isOwnProfile ? '+1 (555) 123-4567' : undefined,
            verified: user.isEmailVerified,
          }}
          stats={mockStats}
          achievements={mockAchievements}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onMessage={handleMessage}
        />

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Activity feed coming soon! This will show recent purchases, group joins, and other activities.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
