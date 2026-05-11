import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, X } from 'lucide-react';
import api from '../utils/api';

const CommentPanel = ({ projectId, socket }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [timestamp, setTimestamp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchComments();

    if (socket) {
      socket.on('new-comment', () => fetchComments());
      socket.on('comment-update', () => fetchComments());
      return () => {
        socket.off('new-comment');
        socket.off('comment-update');
      };
    }
  }, [projectId, socket]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/comments/project/${projectId}`);
      setComments(response.data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post('/api/comments', {
        projectId,
        timestamp,
        text: newComment,
      });

      if (socket) {
        socket.emit('comment-added', {
          projectId,
          comment: response.data,
        });
      }

      setNewComment('');
      setTimestamp(0);
      fetchComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      await api.post(`/api/comments/${commentId}/reply`, {
        text: replyText,
      });

      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <MessageSquare size={24} strokeWidth={1.5} />
        Comments
      </h3>

      <form onSubmit={handleSubmitComment} className="mb-6 pb-6 border-b border-white/[0.06]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Comment at:</span>
            <input
              type="number"
              value={timestamp}
              onChange={(e) => setTimestamp(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="input-field w-24 py-2 text-center"
              placeholder="0"
            />
            <span>seconds</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input-field flex-1"
              placeholder="Add a comment at this timestamp..."
            />
            <motion.button
              type="submit"
              className="btn-primary px-5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send size={20} strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </form>

      <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="text-center py-12 text-text-secondary">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment, i) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`p-4 rounded-2xl border ${
                comment.resolved
                  ? 'bg-white/[0.02] border-white/[0.04] opacity-70'
                  : 'bg-white/[0.03] border-white/[0.06]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-xs font-semibold">
                    {comment.user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{comment.user?.username}</div>
                    <div className="text-xs text-text-muted">
                      {formatTime(comment.timestamp)} • {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {comment.resolved && (
                  <span className="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400">
                    Resolved
                  </span>
                )}
              </div>

              <p className="text-text-primary mb-3">{comment.text}</p>

              {comment.replies?.length > 0 && (
                <div className="ml-4 pl-4 border-l border-white/10 space-y-3 mt-3">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-xs font-semibold shrink-0">
                        {reply.user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{reply.user?.username}</div>
                        <p className="text-text-secondary text-sm">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === comment._id ? (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="input-field flex-1 py-2.5"
                    placeholder="Write a reply..."
                  />
                  <button
                    onClick={() => handleReply(comment._id)}
                    className="btn-secondary px-4 py-2.5"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                    className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(comment._id)}
                  className="text-sm text-accent-blue hover:text-accent-teal mt-2 font-medium transition-colors"
                >
                  Reply
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentPanel;
