import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  isNewsLiked,
  toggleLikeNews,
  isAchieverLiked,
  toggleLikeAchiever,
  getItemLikesCount,
  setItemLikesCount,
} from '../../data/userActivity';

export default function LikeButton({ initialLikes = 0, size = 'md', newsId = null, achieverId = null }) {
  const { user, openAuthModal } = useAuth();

  const itemKey = newsId ? `news_${newsId}` : achieverId ? `achiever_${achieverId}` : null;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(() => (itemKey ? getItemLikesCount(itemKey, initialLikes) : initialLikes));
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (itemKey) {
      setCount(getItemLikesCount(itemKey, initialLikes));
    }
  }, [itemKey, initialLikes]);

  useEffect(() => {
    if (user?.email) {
      if (newsId) {
        setLiked(isNewsLiked(user.email, newsId));
      } else if (achieverId) {
        setLiked(isAchieverLiked(user.email, achieverId));
      }
    } else {
      setLiked(false);
    }
  }, [user, newsId, achieverId]);

  const handleLike = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    let isNowLiked = false;
    if (newsId) {
      isNowLiked = toggleLikeNews(user.email, newsId);
    } else if (achieverId) {
      isNowLiked = toggleLikeAchiever(user.email, achieverId);
    } else {
      isNowLiked = !liked;
    }

    setLiked(isNowLiked);
    setCount((prev) => {
      const newCount = isNowLiked ? prev + 1 : Math.max(0, prev - 1);
      if (itemKey) setItemLikesCount(itemKey, newCount);
      return newCount;
    });

    if (isNowLiked) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleLike}
        whileTap={{ scale: 0.9 }}
        className={`relative flex items-center ${sizeClasses[size]} rounded-full border font-semibold transition-all duration-200 overflow-hidden ${
          liked
            ? 'bg-primary/15 border-primary text-primary shadow-glow-red'
            : 'bg-dark-300 border-surface-border text-text-secondary hover:border-primary/50 hover:text-primary'
        }`}
      >
        <motion.div
          animate={burst ? { scale: [1, 1.4, 0.9, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Heart
            className={`w-4 h-4 transition-all ${liked ? 'fill-primary text-primary' : ''}`}
          />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="font-bold tabular-nums"
          >
            {count.toLocaleString()}
          </motion.span>
        </AnimatePresence>
        <span>{liked ? 'Liked' : 'Like'}</span>

        {/* Burst particles */}
        <AnimatePresence>
          {burst && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary pointer-events-none"
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos((i / 6) * Math.PI * 2) * 30,
                    y: Math.sin((i / 6) * Math.PI * 2) * 30,
                    scale: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ left: '20px', top: '50%' }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
