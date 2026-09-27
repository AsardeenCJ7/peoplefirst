import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CommentSection({ achieverId }) {
  const { user, openAuthModal } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadFeedback = useCallback(async () => {
    if (!achieverId) return;
    try {
      setLoading(true);
      const res = await api.get(`/achievers/feedback/achiever/${achieverId}`);
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(c => ({
          id: c._id || c.id,
          user: c.author || 'Anonymous',
          initials: (c.author || 'A').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          comment: c.text,
          time: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB') : 'Recently',
          likes: c.rating || 0,
          liked: false,
        }));
        setComments(mapped);
      }
    } catch (err) {
      console.warn('Could not fetch real feedback for achiever:', err.message);
    } finally {
      setLoading(false);
    }
  }, [achieverId]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const handleLikeComment = (id) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? Math.max(0, c.likes - 1) : c.likes + 1 }
          : c
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const res = await api.post('/achievers/feedback', {
        achieverId: String(achieverId),
        text: newComment,
        author: user.name,
        email: user.email,
        rating: 5,
      });

      if (res.success) {
        setNewComment('');
        setSubmitted(true);
        await loadFeedback();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      console.error('Failed to post comment to database:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="font-manrope font-bold text-text-primary text-xl">
          Public Feedback & Tributes
        </h3>
        <span className="badge-gray">{comments.length}</span>
      </div>

      {/* Comment Form */}
      <div className="card p-5 space-y-4 border-primary/20 bg-dark-200">
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-primary" />
              <span className="text-xs font-bold text-white">Commenting as {user.name} ({user.district || 'National'})</span>
            </>
          ) : (
            <span className="text-xs font-semibold text-amber-400/90 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" />
              Leave a tribute or feedback (Sign in required when posting)
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            placeholder="Share your appreciation or feedback for this achiever..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => {
              if (!user) openAuthModal('login');
            }}
            className="textarea text-xs sm:text-sm bg-dark-300"
            rows={3}
            required
          />
          <div className="flex items-center justify-between">
            <p className="text-text-muted text-[11px]">
              Your feedback will be stored live in the database and reviewed by administrators.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs px-5 py-2.5 gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {submitting ? 'Posting...' : user ? 'Post Tribute' : 'Sign In & Post'}
            </button>
          </div>
          <AnimatePresence>
            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-success text-xs font-medium"
              >
                ✓ Your tribute has been saved to the live database!
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-6 text-text-muted text-xs">Loading live feedback...</div>
      ) : comments.length === 0 ? (
        <div className="card p-6 text-center text-text-muted text-xs bg-dark-200/50">
          No feedback posted yet. Be the first to leave a tribute!
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4 flex gap-3 bg-dark-200/90"
            >
              <div className="shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-xs">
                  {comment.initials || <User className="w-4 h-4" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-text-primary text-xs">{comment.user}</span>
                  <span className="text-text-muted text-[10px] shrink-0">{comment.time}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{comment.comment}</p>
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`mt-2 flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    comment.liked ? 'text-primary font-bold' : 'text-text-muted hover:text-primary'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${comment.liked ? 'fill-primary' : ''}`} />
                  <span>{comment.likes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
