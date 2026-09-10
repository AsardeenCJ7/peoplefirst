import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight, User, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { isNewsSaved, toggleSaveNews } from '../../data/userActivity';

const categoryColors = {
  Local: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  International: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Sports: 'bg-green-500/15 text-green-400 border-green-500/30',
  Education: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Health: 'bg-red-500/15 text-red-400 border-red-500/30',
  Environment: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Arts: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  Diaspora: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
};

// Format date and time neatly
function formatDateTime(dateStr, timeStr) {
  try {
    const dt = new Date(`${dateStr}T${timeStr || '00:00'}`);
    const formattedDate = dt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = timeStr
      ? dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      : '';
    return { formattedDate, formattedTime };
  } catch {
    return { formattedDate: dateStr, formattedTime: timeStr || '' };
  }
}

export default function NewsCard({ article, index = 0 }) {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.email && article?.id) {
      setSaved(isNewsSaved(user.email, article.id));
    }
  }, [user, article]);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal('login');
      return;
    }
    const isNowSaved = toggleSaveNews(user.email, article.id);
    setSaved(isNowSaved);
  };

  const categoryClass =
    categoryColors[article.category] || 'bg-dark-400 text-text-secondary border-surface-border';
  const { formattedDate, formattedTime } = formatDateTime(article.date, article.time);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group flex flex-col bg-dark-200/90 hover:bg-dark-200 rounded-2xl border border-surface-border hover:border-primary/40 shadow-card hover:shadow-glow-red transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <Link
        to={`/news/${article.id}`}
        className="relative aspect-[16/10] overflow-hidden bg-dark-300 block"
      >
        <img
          src={article.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-100/80 via-transparent to-transparent opacity-60" />

        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border backdrop-blur-md ${categoryClass}`}>
            {article.category}
          </span>
          {article.featured && (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-primary text-white shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Bookmark Quick Button overlay */}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            saved
              ? 'bg-blue-600 text-white shadow-glow'
              : 'bg-dark-100/70 text-text-secondary hover:text-white hover:bg-dark-100'
          }`}
          title={saved ? 'Remove Bookmark' : 'Save Bookmark'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 justify-between space-y-3">
        <div className="space-y-2.5">
          {/* Date & Time header */}
          <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium">
            <span className="flex items-center gap-1 text-text-secondary">
              <Calendar className="w-3 h-3 text-primary" />
              {formattedDate}
            </span>
            {formattedTime && (
              <>
                <span className="text-surface-border">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold" />
                  {formattedTime}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <Link to={`/news/${article.id}`} className="block">
            <h3 className="font-manrope font-bold text-text-primary text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>

          {/* Clean 2-line concise Summary */}
          <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
            {article.summary}
          </p>
        </div>

        {/* Footer info & Read More Link */}
        <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted truncate max-w-[55%]">
            <User className="w-3 h-3 text-text-muted shrink-0" />
            <span className="truncate">{article.author?.replace('PeopleFirst ', '') || 'Editorial'}</span>
          </div>

          <Link
            to={`/news/${article.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-light transition-colors group-hover:translate-x-0.5 transform duration-200"
          >
            <span>{t('readMore')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
