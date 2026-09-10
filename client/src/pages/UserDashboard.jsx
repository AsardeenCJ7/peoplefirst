import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Award, Heart, Bookmark, MessageSquare, Shield, Settings,
  LogOut, ExternalLink, Trash2, CheckCircle2, ChevronRight,
  MapPin, Calendar, Clock, Trophy, Sparkles, BookOpen, AlertCircle,
  ThumbsUp, RefreshCw, Edit3, Save, ShieldAlert, ArrowRight, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getUserLikedNews,
  getUserSavedNews,
  getUserVotedAwards,
  toggleLikeNews,
  toggleSaveNews,
  toggleVoteAward,
} from '../data/userActivity';
import { getAllFeedback } from '../data/users';

const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Trincomalee', 'Vavuniya',
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
];

export default function UserDashboard() {
  const { user, logout, openAuthModal, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('voted'); // 'voted', 'liked', 'saved', 'comments', 'settings'
  const [likedNews, setLikedNews] = useState([]);
  const [savedNews, setSavedNews] = useState([]);
  const [votedAwards, setVotedAwards] = useState([]);
  const [userComments, setUserComments] = useState([]);
  
  // Settings Form State
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load user data
  useEffect(() => {
    if (user && user.email) {
      setName(user.name || '');
      setDistrict(user.district || 'Colombo');
      setBio(user.bio || 'Passionate reader and community supporter.');
      setAvatar(user.avatar || AVATAR_PRESETS[0]);
      refreshUserData();
    }
  }, [user]);

  const refreshUserData = () => {
    if (!user?.email) return;
    setLikedNews(getUserLikedNews(user.email));
    setSavedNews(getUserSavedNews(user.email));
    setVotedAwards(getUserVotedAwards(user.email));

    // Get user comments from stored feedback
    const allComments = getAllFeedback();
    const myComments = allComments.filter(
      (c) => c.author?.toLowerCase() === user.name?.toLowerCase() || c.email === user.email
    );
    setUserComments(myComments);
  };

  const handleUnlike = (newsId) => {
    if (!user?.email) return;
    toggleLikeNews(user.email, newsId);
    refreshUserData();
  };

  const handleUnsave = (newsId) => {
    if (!user?.email) return;
    toggleSaveNews(user.email, newsId);
    refreshUserData();
  };

  const handleRetractVote = (awardId) => {
    if (!user?.email) return;
    toggleVoteAward(user.email, awardId);
    refreshUserData();
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!user) return;
    updateUserProfile({
      name,
      district,
      bio,
      avatar,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Not Logged In State
  if (!user) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-dark-200 border border-surface-border rounded-2xl p-8 text-center shadow-card relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-5">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-manrope font-extrabold text-2xl text-white mb-2">
            User Portal Access
          </h2>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            Please log in to your account to view your voting awards, liked news, bookmarks, and personalized community activity.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full btn-primary text-sm py-3 justify-center font-bold"
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full btn-secondary text-sm py-3 justify-center"
            >
              Create New Account
            </button>
            <Link
              to="/"
              className="inline-block text-xs text-text-muted hover:text-text-primary pt-2 transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'voted', label: 'Voted Awards', count: votedAwards.length, icon: Trophy, color: 'text-gold' },
    { id: 'liked', label: 'Liked News', count: likedNews.length, icon: Heart, color: 'text-primary' },
    { id: 'saved', label: 'Saved Stories', count: savedNews.length, icon: Bookmark, color: 'text-blue-400' },
    { id: 'comments', label: 'My Comments', count: userComments.length, icon: MessageSquare, color: 'text-emerald-400' },
    { id: 'settings', label: 'Edit Profile', icon: Settings, color: 'text-text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-dark-100 pb-20">
      {/* Profile Header Banner */}
      <div className="relative bg-dark-200 border-b border-surface-border pt-8 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-gold/5 to-transparent pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Profile Card */}
            <div className="flex items-center gap-5">
              <div className="relative group shrink-0">
                <img
                  src={user.avatar || avatar}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-primary/40 shadow-glow"
                />
                <button
                  onClick={() => setActiveTab('settings')}
                  className="absolute -bottom-2 -right-2 bg-dark-300 hover:bg-dark-400 border border-surface-border text-white p-1.5 rounded-lg shadow transition-all"
                  title="Change avatar"
                >
                  <Edit3 className="w-3.5 h-3.5 text-primary" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-manrope font-black text-2xl sm:text-3xl text-text-primary">
                    {user.name}
                  </h1>
                  {user.role === 'admin' ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-gold/20 text-gold border border-gold/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25 text-[11px] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Member
                    </span>
                  )}
                </div>

                <p className="text-text-muted text-xs sm:text-sm mb-3">{user.email}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1 bg-dark-300 px-2.5 py-1 rounded-lg border border-surface-border">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {user.district || 'Colombo'} District
                  </span>
                  <span className="flex items-center gap-1 bg-dark-300 px-2.5 py-1 rounded-lg border border-surface-border">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    Joined {user.joinedDate || '2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 self-start md:self-center">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="btn-gold text-xs px-4 py-2.5 font-bold flex items-center gap-1.5 shadow-glow-gold"
                >
                  <Shield className="w-4 h-4" />
                  Admin Console
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5 text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
            <div className="card p-4 bg-dark-300/80 border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Awards Voted</span>
                <Trophy className="w-4 h-4 text-gold" />
              </div>
              <p className="font-manrope font-extrabold text-2xl text-white mt-1">
                {votedAwards.length}
              </p>
            </div>
            <div className="card p-4 bg-dark-300/80 border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Articles Liked</span>
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <p className="font-manrope font-extrabold text-2xl text-white mt-1">
                {likedNews.length}
              </p>
            </div>
            <div className="card p-4 bg-dark-300/80 border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Saved Stories</span>
                <Bookmark className="w-4 h-4 text-blue-400" />
              </div>
              <p className="font-manrope font-extrabold text-2xl text-white mt-1">
                {savedNews.length}
              </p>
            </div>
            <div className="card p-4 bg-dark-300/80 border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Discussions</span>
                <MessageSquare className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="font-manrope font-extrabold text-2xl text-white mt-1">
                {userComments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="container-main py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-surface-border mb-8 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-primary/15 text-primary border-primary/30 shadow-glow-sm'
                    : 'bg-dark-200 text-text-secondary border-surface-border hover:bg-dark-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-primary text-white' : 'bg-dark-400 text-text-muted'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Voted Awards */}
        {activeTab === 'voted' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-manrope font-bold text-xl text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold" />
                  Your Cast Award Votes
                </h2>
                <p className="text-text-muted text-xs">
                  Laureates and nominees you have supported with your community vote.
                </p>
              </div>
              <Link to="/awards" className="btn-secondary text-xs px-3.5 py-2">
                Browse All Awards →
              </Link>
            </div>

            {votedAwards.length === 0 ? (
              <div className="card p-12 bg-dark-200 border-surface-border text-center">
                <Trophy className="w-12 h-12 text-gold/30 mx-auto mb-3" />
                <h3 className="font-bold text-base text-white mb-1">No Award Votes Cast Yet</h3>
                <p className="text-text-muted text-xs max-w-sm mx-auto mb-4">
                  Vote for your favourite nominees on the PeopleFirst Awards portal to see them recognized.
                </p>
                <Link to="/awards" className="btn-primary text-xs px-5 py-2.5">
                  Explore Nominees & Vote Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {votedAwards.map((award) => (
                  <motion.div
                    key={award.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="card p-5 bg-dark-200 border-surface-border hover:border-gold/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{award.icon || '🏆'}</span>
                          <div>
                            <span className="text-[10px] text-gold font-bold uppercase tracking-wide">
                              {award.category} · {award.year}
                            </span>
                            <h4 className="font-manrope font-bold text-sm text-white line-clamp-1">
                              {award.title}
                            </h4>
                          </div>
                        </div>
                        <span className="badge bg-gold/15 text-gold border-gold/30 text-[10px] shrink-0">
                          {award.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 bg-dark-300 p-2.5 rounded-xl mb-3">
                        <img
                          src={award.thumbnail}
                          alt={award.nominee}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-primary/40"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{award.nominee}</p>
                          <p className="text-[10px] text-text-muted truncate">{award.presenter}</p>
                        </div>
                      </div>

                      <p className="text-text-secondary text-xs line-clamp-2 mb-4 leading-relaxed">
                        {award.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                      <div className="text-[11px] text-text-muted">
                        Total Votes: <span className="text-white font-bold">{award.votes?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRetractVote(award.id)}
                          className="text-[11px] text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-all"
                        >
                          Remove Vote
                        </button>
                        <Link
                          to={`/achievers/${award.nomineeId}`}
                          className="text-[11px] text-primary hover:underline font-bold"
                        >
                          Profile →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Liked News */}
        {activeTab === 'liked' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-manrope font-bold text-xl text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Liked Articles & Features
                </h2>
                <p className="text-text-muted text-xs">
                  News wires and editorials you have appreciated.
                </p>
              </div>
              <Link to="/news" className="btn-secondary text-xs px-3.5 py-2">
                Explore News Feed →
              </Link>
            </div>

            {likedNews.length === 0 ? (
              <div className="card p-12 bg-dark-200 border-surface-border text-center">
                <Heart className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <h3 className="font-bold text-base text-white mb-1">No Liked Articles Yet</h3>
                <p className="text-text-muted text-xs max-w-sm mx-auto mb-4">
                  Hit the like button on any story to save it to your personal reading list.
                </p>
                <Link to="/news" className="btn-primary text-xs px-5 py-2.5">
                  Browse News Headlines
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {likedNews.map((article) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="card overflow-hidden bg-dark-200 border-surface-border hover:border-primary/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-dark-300 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-dark-100/90 backdrop-blur-sm text-primary text-[10px] font-bold border border-surface-border">
                          {article.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-[11px] text-text-muted mb-1.5">
                          <span>{article.date}</span>
                          <span>·</span>
                          <span>{article.readTime || '3 min read'}</span>
                        </div>
                        <h4 className="font-manrope font-bold text-sm text-white line-clamp-2 leading-snug mb-2">
                          {article.title}
                        </h4>
                        <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between border-t border-surface-border/50">
                      <button
                        onClick={() => handleUnlike(article.id)}
                        className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Unlike
                      </button>
                      <Link
                        to={`/news/${article.id}`}
                        className="btn-primary text-xs px-3 py-1.5 font-bold"
                      >
                        Read Full Story
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Stories */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-manrope font-bold text-xl text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-blue-400" />
                  Saved Bookmarks
                </h2>
                <p className="text-text-muted text-xs">
                  Stories bookmarked for later reading and reference.
                </p>
              </div>
              <Link to="/news" className="btn-secondary text-xs px-3.5 py-2">
                Discover More →
              </Link>
            </div>

            {savedNews.length === 0 ? (
              <div className="card p-12 bg-dark-200 border-surface-border text-center">
                <Bookmark className="w-12 h-12 text-blue-400/30 mx-auto mb-3" />
                <h3 className="font-bold text-base text-white mb-1">No Saved Bookmarks</h3>
                <p className="text-text-muted text-xs max-w-sm mx-auto mb-4">
                  Bookmark inspiring news stories and profiles to read them when you have more time.
                </p>
                <Link to="/news" className="btn-primary text-xs px-5 py-2.5">
                  Explore Stories
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedNews.map((article) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="card p-4 bg-dark-200 border-surface-border hover:border-blue-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted mb-1">
                          <span className="text-blue-400 font-bold">{article.category}</span>
                          <span>·</span>
                          <span>{article.date}</span>
                        </div>
                        <h4 className="font-manrope font-bold text-sm text-white line-clamp-1">
                          {article.title}
                        </h4>
                        <p className="text-text-secondary text-xs line-clamp-1 mt-0.5">
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleUnsave(article.id)}
                        className="text-xs text-text-muted hover:text-red-400 p-2 rounded-lg bg-dark-300 hover:bg-dark-400 border border-surface-border transition-all"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/news/${article.id}`}
                        className="btn-secondary text-xs px-3.5 py-2 font-semibold flex items-center gap-1"
                      >
                        Read <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: My Comments */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-manrope font-bold text-xl text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Your Community Comments & Feedback
              </h2>
              <p className="text-text-muted text-xs">
                Feedback and commentary you have posted on profiles and articles.
              </p>
            </div>

            {userComments.length === 0 ? (
              <div className="card p-12 bg-dark-200 border-surface-border text-center">
                <MessageSquare className="w-12 h-12 text-emerald-400/30 mx-auto mb-3" />
                <h3 className="font-bold text-base text-white mb-1">No Comments Posted Yet</h3>
                <p className="text-text-muted text-xs max-w-sm mx-auto mb-4">
                  Engage with achiever profiles and news stories by leaving thoughtful comments.
                </p>
                <Link to="/achievers" className="btn-primary text-xs px-5 py-2.5">
                  Browse Achievers
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userComments.map((c) => (
                  <div key={c.id} className="card p-4 bg-dark-200 border-surface-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-emerald-400">
                        Target: #{c.achieverId || 'Community Post'}
                      </span>
                      <span className="text-[10px] text-text-muted">{c.date || 'Recent'}</span>
                    </div>
                    <p className="text-sm text-text-secondary italic">"{c.text || c.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Profile Settings Form */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-dark-200 border border-surface-border rounded-2xl p-6 sm:p-8 shadow-card">
            <h2 className="font-manrope font-bold text-xl text-white mb-1 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Edit Profile Information
            </h2>
            <p className="text-text-muted text-xs mb-6">
              Update your personal details, location district, and public avatar.
            </p>

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-success/15 border border-success/30 text-success text-xs font-semibold flex items-center gap-2 mb-6"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Profile changes saved successfully!
              </motion.div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-2">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatar(preset)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden ring-2 transition-all shrink-0 ${
                        avatar === preset ? 'ring-primary scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt="Preset" className="w-full h-full object-cover" />
                      {avatar === preset && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Email Address <span className="text-text-muted font-normal">(Account identifier)</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-dark-400 border border-surface-border rounded-xl px-4 py-2.5 text-sm text-text-muted cursor-not-allowed"
                />
              </div>

              {/* District Dropdown */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  District (Sri Lanka)
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d} className="bg-dark-200 text-white">
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Bio / About Me
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short note about your interests..."
                  className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="btn-primary text-xs px-6 py-2.5 font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
