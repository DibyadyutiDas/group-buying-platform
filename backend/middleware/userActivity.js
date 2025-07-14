const User = require('../models/User');

// Middleware to track user activity and update online status
const trackUserActivity = async (req, res, next) => {
  // Only track activity for authenticated users
  if (req.user && req.user._id) {
    try {
      // Update user's last activity in the background
      // Don't await to avoid slowing down the request
      User.findByIdAndUpdate(
        req.user._id,
        { 
          lastActivity: new Date(),
          isOnline: true
        },
        { new: false }
      ).catch(err => {
        console.error('Error updating user activity:', err);
      });
    } catch (error) {
      console.error('Error in trackUserActivity middleware:', error);
    }
  }
  
  next();
};

// Cleanup inactive users periodically
const cleanupInactiveUsers = () => {
  setInterval(async () => {
    try {
      const result = await User.markInactiveUsersOffline();
      if (result.modifiedCount > 0) {
        console.log(`Marked ${result.modifiedCount} inactive users as offline`);
      }
    } catch (error) {
      console.error('Error cleaning up inactive users:', error);
    }
  }, 60000); // Run every minute
};

module.exports = {
  trackUserActivity,
  cleanupInactiveUsers
};
