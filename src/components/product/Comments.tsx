import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import { Comment, BackendComment } from '../../types';
import { getComments, addComment, getUserById } from '../../utils/storage';
import { apiCall, API_ENDPOINTS } from '../../utils/api';
import { sanitizeAltText, sanitizeText, sanitizeAvatarUrl } from '../../utils/helpers';

interface CommentsProps {
  productId: string;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const user = getUserById(comment.userId);
  
  if (!user) {
    return null;
  }
  
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <div className="py-4 border-b border-gray-200 dark:border-gray-600">
      <div className="flex items-start">
        <img
          src={sanitizeAvatarUrl(user.avatar)}
          alt={sanitizeAltText(user.name)}
          className="h-10 w-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{sanitizeText(user.name)}</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
          </div>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{sanitizeText(comment.text)}</p>
        </div>
      </div>
    </div>
  );
};

const Comments: React.FC<CommentsProps> = ({ productId }) => {
  const { user, isBackendAvailable } = useAuth();
  const { success, error: showError } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const loadComments = useCallback(async () => {
    try {
      setFetchLoading(true);
      
      if (isBackendAvailable) {
        try {
          const response = await apiCall(API_ENDPOINTS.COMMENTS.GET_BY_PRODUCT(productId));
          const commentsData = response.comments || response.data || response;
          
          // Transform backend data to frontend format
          const transformedComments = commentsData.map((comment: BackendComment) => ({
            id: comment._id,
            productId: typeof comment.productId === 'string' ? comment.productId : comment.productId._id,
            userId: typeof comment.userId === 'string' ? comment.userId : comment.userId._id,
            text: comment.text,
            createdAt: comment.createdAt
          }));
          
          setComments(transformedComments);
          return;
        } catch (err) {
          console.warn('Failed to fetch comments from backend, using local storage:', err);
        }
      }
      
      // Fall back to local storage
      const productComments = getComments(productId);
      setComments(productComments);
      
    } catch (error) {
      console.error('Failed to load comments:', error);
      showError('Error', 'Failed to load comments');
    } finally {
      setFetchLoading(false);
    }
  }, [productId, isBackendAvailable, showError]);
  
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showError('Authentication required', 'Please sign in to post a comment');
      return;
    }
    
    if (!newComment.trim()) {
      showError('Invalid input', 'Please enter a comment');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isBackendAvailable) {
        try {
          const response = await apiCall(API_ENDPOINTS.COMMENTS.CREATE, {
            method: 'POST',
            body: JSON.stringify({
              text: newComment.trim(),
              productId: productId
            }),
          });
          
          const newCommentData = response.comment || response.data || response;
          
          // Transform backend response to frontend format
          const transformedComment = {
            id: newCommentData._id || newCommentData.id,
            productId: newCommentData.productId._id || newCommentData.productId,
            userId: newCommentData.userId._id || newCommentData.userId,
            text: newCommentData.text,
            createdAt: newCommentData.createdAt
          };
          
          setComments(prev => [...prev, transformedComment]);
          setNewComment('');
          success('Comment posted', 'Your comment has been added successfully!');
          return;
        } catch (err) {
          console.warn('Backend comment creation failed, using local storage:', err);
          if (err instanceof Error && !err.message.includes('NETWORK_ERROR')) {
            showError('Error', err.message);
            return;
          }
        }
      }
      
      // Fall back to local storage
      const comment = addComment(productId, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment('');
      success('Comment posted', 'Your comment has been added successfully! (Offline mode)');
      
    } catch (error) {
      console.error('Failed to add comment:', error);
      showError('Error', 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Discussion</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Discussion</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start">
            <img
              src={sanitizeAvatarUrl(user.avatar)}
              alt={sanitizeAltText(user.name)}
              className="h-10 w-10 rounded-full mr-3"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add to the discussion..."
                rows={3}
                disabled={loading}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  isLoading={loading}
                  disabled={loading || !newComment.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">Please sign in to join the discussion.</p>
        </div>
      )}
      
      <div>
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No comments yet. Be the first to start the discussion!</p>
        ) : (
          <div>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;