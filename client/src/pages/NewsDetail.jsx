import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Tag,
  Share2,
  BookOpen,
  Newspaper,
  Check,
  Eye,
  History,
  Copy,
  ExternalLink,
  Bookmark,
  Heart,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getAllNews } from '../data/news';
import { isNewsSaved, toggleSaveNews } from '../data/userActivity';
import CommentSection from '../components/ui/CommentSection';
import LikeButton from '../components/ui/LikeButton';

const READ_HISTORY_KEY = 'peoplefirst_reading_history';

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

function formatDateTime(dateStr, timeStr) {
  try {
    const dt = new Date(`${dateStr}T${timeStr || '00:00'}`);
    const dateFormatted = dt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeFormatted = timeStr
      ? dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      : null;
    return {
      dateFormatted,
      timeFormatted,
      relative: getRelative(dt),
    };
  } catch {
    return { dateFormatted: dateStr, timeFormatted: timeStr, relative: null };
  }
}

function getRelative(dt) {
  const diff = Date.now() - dt.getTime();
  if (diff < 0) return 'Just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return null;
}

export default function NewsDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const [copied, setCopied] = useState(false);
  const [allNews, setAllNews] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const newsData = getAllNews();
    setAllNews(newsData);

    if (user?.email && id) {
      setSaved(isNewsSaved(user.email, id));
    }

    // Track reading history in localStorage
    try {
      const savedHistory = JSON.parse(localStorage.getItem(READ_HISTORY_KEY) || '[]');
      const articleId = parseInt(id) || id;
      const filtered = savedHistory.filter((savedId) => String(savedId) !== String(articleId));
      const updatedHistory = [articleId, ...filtered].slice(0, 8);
      localStorage.setItem(READ_HISTORY_KEY, JSON.stringify(updatedHistory));

      // Resolve history items (excluding current article)
      const resolved = updatedHistory
        .filter((savedId) => String(savedId) !== String(articleId))
        .map((savedId) => newsData.find((n) => String(n.id) === String(savedId)))
        .filter(Boolean)
        .slice(0, 4);

      setReadingHistory(resolved);
    } catch (e) {
      console.error('Error with reading history', e);
    }
  }, [id, user]);

  const handleToggleSave = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const isNowSaved = toggleSaveNews(user.email, id);
    setSaved(isNowSaved);
  };

  const article = allNews.find((a) => String(a.id) === String(id));

  if (!article) {
    return (
      <div className="min-h-screen bg-dark-100 flex flex-col items-center justify-center gap-4 px-4 py-20">
        <Newspaper className="w-16 h-16 text-primary/40 animate-pulse" />
        <h1 className="font-manrope font-bold text-2xl text-text-primary">Article Not Found</h1>
        <p className="text-text-muted text-sm text-center max-w-md">
          The news story you are looking for might have been moved or does not exist.
        </p>
        <Link to="/news" className="btn-primary text-sm px-6 py-2.5 mt-2">
          ← Back to All News
        </Link>
      </div>
    );
  }

  const { dateFormatted, timeFormatted, relative } = formatDateTime(article.date, article.time);
  const catClass = categoryColors[article.category] || 'bg-dark-400 text-text-secondary border-dark-500';

  // Related articles (same category, excluding current)
  const related = allNews
    .filter((a) => String(a.id) !== String(article.id) && a.category === article.category)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({ title: article.title, url: window.location.href })
        .catch(() => { });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    let shareUrl = '';

    if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 pb-20">
      {/* Top Header & Breadcrumb */}
      <div className="bg-dark-200 border-b border-surface-border sticky top-16 lg:top-20 z-30 backdrop-blur-md bg-dark-200/90">
        <div className="container-main py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary bg-dark-300 hover:bg-dark-400 px-3.5 py-2 rounded-xl transition-all border border-surface-border"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span>{t('back')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all border ${saved
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-glow-sm'
                  : 'bg-dark-300 hover:bg-dark-400 text-text-secondary hover:text-white border-surface-border'
                }`}
              title={saved ? 'Remove bookmark' : 'Save for later'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-blue-400' : ''}`} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3.5 py-2 rounded-xl transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? t('linkCopied') : t('shareStory')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-main pt-6 sm:pt-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Article Header Card */}
          <div className="space-y-4">
            {/* Category & Featured tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${catClass}`}>
                {article.category}
              </span>
              {article.subcategory && (
                <span className="text-text-muted text-xs font-medium">· {article.subcategory}</span>
              )}
              {article.featured && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold">
                  Featured Wire
                </span>
              )}
            </div>

            {/* Headline Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-manrope font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-text-primary leading-tight"
            >
              {article.title}
            </motion.h1>

            {/* Date, Time & Author Meta Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-text-muted pt-2 pb-4 border-b border-surface-border">
              <span className="flex items-center gap-1.5 font-medium text-text-secondary">
                <User className="w-4 h-4 text-primary" />
                {article.author || 'PeopleFirst Editorial'}
              </span>

              <span className="flex items-center gap-1.5 text-text-secondary">
                <Calendar className="w-4 h-4 text-primary" />
                {dateFormatted}
              </span>

              {timeFormatted && (
                <span className="flex items-center gap-1.5 text-gold font-medium">
                  <Clock className="w-4 h-4 text-gold" />
                  {timeFormatted}
                </span>
              )}

              {relative && (
                <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md text-[11px] font-bold">
                  {relative}
                </span>
              )}

              <span className="flex items-center gap-1.5 ml-auto text-[11px] text-text-muted">
                <Eye className="w-3.5 h-3.5" />
                {article.readTime || '3 min read'}
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden border border-surface-border bg-dark-300 shadow-card"
          >
            <img
              src={article.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'}
              alt={article.title}
              className="w-full max-h-[500px] object-cover"
            />
          </motion.div>

          {/* Summary Callout */}
          {article.summary && (
            <div className="p-5 sm:p-6 bg-dark-200/90 border-l-4 border-primary rounded-r-2xl text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed italic">
              "{article.summary}"
            </div>
          )}

          {/* Full Article Content */}
          <div className="prose prose-invert max-w-none space-y-4">
            {(article.content || article.summary || '')
              .split('\n\n')
              .filter(Boolean)
              .map((para, i) => (
                <p
                  key={i}
                  className={`text-text-secondary text-sm sm:text-base leading-relaxed ${i === 0
                      ? 'first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-2 first-letter:float-left first-letter:leading-none'
                      : ''
                    }`}
                >
                  {para}
                </p>
              ))}
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="pt-4 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-text-muted shrink-0 mr-1" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-dark-300 border border-surface-border text-text-secondary text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ==================================================== */}
          {/* BACK & SHARE ACTIONS SHELF (Under News Details) */}
          {/* ==================================================== */}
          <div className="p-5 bg-dark-200 rounded-2xl border border-surface-border flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 btn-secondary text-xs px-4 py-2.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('goBack')}</span>
              </button>
              <Link to="/news" className="btn-ghost text-xs px-3 py-2.5 text-text-secondary hover:text-white">
                {t('allHeadlines')}
              </Link>
              <div className="h-6 w-px bg-surface-border hidden sm:block" />
              <LikeButton newsId={article.id} initialLikes={124} size="sm" />
              <button
                onClick={handleToggleSave}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${saved
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    : 'bg-dark-300 hover:bg-dark-400 text-text-secondary hover:text-white border-surface-border'
                  }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-blue-400' : ''}`} />
                <span>{saved ? 'Saved' : 'Save Story'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-text-muted font-medium mr-1">Share:</span>
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 text-xs font-bold transition-all border border-green-500/30"
              >
                WhatsApp
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 text-xs font-bold transition-all border border-blue-500/30"
              >
                Facebook
              </button>
              <button
                onClick={() => shareToSocial('twitter')}
                className="px-3 py-1.5 rounded-lg bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 text-xs font-bold transition-all border border-sky-500/30"
              >
                X / Twitter
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg bg-dark-300 text-text-secondary hover:text-white text-xs font-bold transition-all border border-surface-border inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? t('linkCopied') : 'Copy'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-surface-border" />

          {/* ==================================================== */}
          {/* FEEDBACK & COMMENTS SECTION (Login-gated) */}
          {/* ==================================================== */}
          <div className="pt-2">
            <CommentSection achieverId={`news_${article.id}`} />
          </div>

          {/* ==================================================== */}
          {/* READING HISTORY / RECENTLY VIEWED UNDER ARTICLE */}
          {/* ==================================================== */}
          {readingHistory.length > 0 && (
            <div className="pt-8 border-t border-surface-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-manrope font-bold text-text-primary text-lg flex items-center gap-2">
                  <History className="w-4 h-4 text-gold" />
                  <span>{t('readingHistory')}</span>
                </h3>
                <span className="text-[11px] text-text-muted">{t('recentlyViewed')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {readingHistory.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="p-3 bg-dark-200 hover:bg-dark-300 rounded-xl border border-surface-border hover:border-primary/40 transition-all block group"
                  >
                    <div className="text-[10px] text-primary font-semibold mb-1 flex items-center justify-between">
                      <span>{item.category}</span>
                      <span className="text-text-muted">{item.date}</span>
                    </div>
                    <p className="font-bold text-xs text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles Section */}
          {related.length > 0 && (
            <div className="pt-6 border-t border-surface-border space-y-4">
              <h2 className="font-manrope font-bold text-text-primary text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {t('relatedStories')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/news/${rel.id}`}
                    className="group card overflow-hidden hover:border-primary/40 transition-all bg-dark-200"
                  >
                    <div className="aspect-video overflow-hidden bg-dark-300">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5">
                      <p className="font-manrope font-bold text-text-primary text-xs leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {rel.title}
                      </p>
                      <p className="text-text-muted text-[10px]">{rel.date} · {rel.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
