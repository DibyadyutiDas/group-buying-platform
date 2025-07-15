import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Star, 
  ShoppingBag, 
  Users, 
  Award,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { sanitizeText } from '../../utils/helpers';
import ImageWithFallback from './ImageWithFallback';
import Button from './Button';

interface UserStats {
  totalPurchases: number;
  totalSavings: number;
  groupsJoined: number;
  groupsCreated: number;
  rating: number;
  reviewCount: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    location?: string;
    joinDate: string;
    website?: string;
    phone?: string;
    verified?: boolean;
  };
  stats: UserStats;
  achievements?: Achievement[];
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onMessage?: () => void;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  stats,
  achievements = [],
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onMessage,
  className = '',
}) => {
  const getRarityColor = () => {
    // Using single color for all achievements
    return 'bg-blue-500 text-white';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header Section */}
      <div className="bg-blue-600 h-32 relative">
        <div className="absolute -bottom-12 left-6">
          <ImageWithFallback
            src={user.avatar || ''}
            alt={sanitizeText(user.name)}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            fallbackSrc="https://i.pravatar.cc/150?img=1"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-16 px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {sanitizeText(user.name)}
              </h1>
              {user.verified && (
                <div title="Verified User">
                  <Award className="h-5 w-5 text-blue-500" />
                </div>
              )}
            </div>
            
            {user.bio && (
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {sanitizeText(user.bio)}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {sanitizeText(user.location)}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {formatDate(user.joinDate)}
              </div>
              {user.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>

            {/* Contact Info (only for own profile) */}
            {isOwnProfile && (
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {user.phone}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant={isFollowing ? "outline" : "primary"}
                onClick={isFollowing ? onUnfollow : onFollow}
                leftIcon={<Users size={16} />}
                size="sm"
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
              <Button
                variant="outline"
                onClick={onMessage}
                leftIcon={<Mail size={16} />}
                size="sm"
              >
                Message
              </Button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <ShoppingBag className="h-5 w-5 text-blue-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalPurchases}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Purchases</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-5 w-5 text-yellow-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.rating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Rating ({stats.reviewCount})
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-5 w-5 text-green-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.groupsJoined}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Groups Joined</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-5 w-5 text-purple-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.totalSavings)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Saved</div>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg ${getRarityColor()}`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm opacity-90">{achievement.description}</p>
                      <p className="text-xs opacity-75 mt-1">
                        Earned {formatDate(achievement.earnedDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {achievements.length > 4 && (
              <Button variant="outline" size="sm" className="mt-3">
                View All Achievements ({achievements.length})
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
