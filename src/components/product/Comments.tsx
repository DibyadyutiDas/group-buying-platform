import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Comment, User } from '../../types';
import { getComments, addComment, getUserById } from '../../utils/storage';

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
    <div className="py-4 border-b border-gray-200">
      <div className="flex items-start">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-10 w-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
        </div>
      </div>
    </div>
  );
};

const Comments: React.FC<CommentsProps> = ({ productId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadComments();
  }, [productId]);
  
  const loadComments = () => {
    const productComments = getComments(productId);
    setComments(productComments);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      return;
    }
    
    if (!newComment.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      const comment = addComment(productId, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Discussion</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full mr-3"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add to the discussion..."
                rows={3}
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
        <div className="bg-gray-50 rounded-md p-4 mb-6 text-center">
          <p className="text-gray-600">Please sign in to join the discussion.</p>
        </div>
      )}
      
      <div>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to start the discussion!</p>
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