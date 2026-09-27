import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Award, Heart, Bookmark, MessageSquare, Shield, Settings,
  LogOut, ExternalLink, Trash2, CheckCircle2, ChevronRight,
  MapPin, Calendar, Clock, Trophy, Sparkles, BookOpen, AlertCircle,
  ThumbsUp, RefreshCw, Edit3, Save, ShieldAlert, ArrowRight, X,
  Phone, Home as HomeIcon, Upload, Lock, Eye, EyeOff, Key, Camera,
  Send, FileText, Star, PlusCircle, CheckSquare, XCircle, FileUp,
  Lightbulb, Users2, Building2
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getUserLikedNews,
  getUserLikedAchievers,
  getUserSavedNews,
  getUserVotedAwards,
  toggleLikeNews,
  toggleLikeAchiever,
  toggleSaveNews,
  toggleVoteAward,
} from '../data/userActivity';
import { getAllAwardCategories, getAllAwards } from '../data/awards';
import { getAllFeedback } from '../data/users';
import { submitAchieverSuggestion, getMySuggestions } from '../data/suggestions';

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
  const { user, logout, openAuthModal, updateUserProfile, changePassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'voted');
  const [likedNews, setLikedNews] = useState([]);
  const [likedAchievers, setLikedAchievers] = useState([]);
  const [savedNews, setSavedNews] = useState([]);
  const [votedAwards, setVotedAwards] = useState([]);
  const [userComments, setUserComments] = useState([]);

  // Suggestion state
  const [mySuggestions, setMySuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestMsg, setSuggestMsg] = useState({ type: '', text: '' });
  const [suggestDocs, setSuggestDocs] = useState([]);
  const [suggestionAchievements, setSuggestionAchievements] = useState(['']);
  const suggestDocRef = useRef(null);
  const [suggestForm, setSuggestForm] = useState({
    name: '', title: '', category: 'Healthcare & Medicine', district: 'Colombo',
    services: '', bio: '', photo: '',
  });

  // Settings Form State
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  // Sync tab with URL search params if present
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['voted', 'liked', 'saved', 'comments', 'settings', 'suggest'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Load user data
  useEffect(() => {
    if (user && user.email) {
      setName(user.name || '');
      setWhatsapp(user.whatsapp || '');
      setDistrict(user.district || 'Colombo');
      setAddress(user.address || '');
      setBio(user.bio || 'Passionate reader and community supporter.');
      setAvatar(user.avatar || AVATAR_PRESETS[0]);
      setSuggestForm(f => ({
        ...f,
        district: user.district || 'Colombo',
      }));
      refreshUserData();
      loadMySuggestions();
    }
  }, [user]);

  const loadMySuggestions = async () => {
    if (!user?.email) return;
    const data = await getMySuggestions();
    setMySuggestions(data);
  };

  const refreshUserData = () => {
    if (!user?.email) return;
    setLikedNews(getUserLikedNews(user.email));
    setLikedAchievers(getUserLikedAchievers(user.email));
    setSavedNews(getUserSavedNews(user.email));
    setVotedAwards(getUserVotedAwards(user.email));

    // Get user comments from stored feedback
    const allComments = getAllFeedback();
    const myComments = allComments.filter(
      (c) => c.author?.toLowerCase() === user.name?.toLowerCase() || c.email === user.email
    );
    setUserComments(myComments);
  };

  // ── Suggestion handlers ────────────────────────────────────────────────────
  const handleSuggestDocChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (suggestDocs.length + files.length > 5) {
      alert('You can upload a maximum of 5 documents.');
      return;
    }
    setSuggestDocs(prev => [...prev, ...files]);
  };

  const removeSuggestDoc = (idx) => {
    setSuggestDocs(prev => prev.filter((_, i) => i !== idx));
  };

  const addAchievement = () => setSuggestionAchievements(prev => [...prev, '']);
  const removeAchievement = (idx) => {
    if (suggestionAchievements.length > 1)
      setSuggestionAchievements(prev => prev.filter((_, i) => i !== idx));
  };
  const setAchievementVal = (idx, val) => {
    setSuggestionAchievements(prev => prev.map((a, i) => i === idx ? val : a));
  };

  const handleSuggestSubmit = async (e) => {
    e.preventDefault();
    setSuggestMsg({ type: '', text: '' });
    if (!suggestForm.name.trim()) {
      setSuggestMsg({ type: 'error', text: 'Achiever name is required.' });
      return;
    }
    if (!suggestForm.services.trim() && !suggestForm.bio.trim()) {
      setSuggestMsg({ type: 'error', text: 'Please describe their services or contributions.' });
      return;
    }

    setSuggestLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', suggestForm.name);
      fd.append('title', suggestForm.title);
      fd.append('category', suggestForm.category);
      fd.append('district', suggestForm.district);
      fd.append('services', suggestForm.services);
      fd.append('bio', suggestForm.bio);
      fd.append('photo', suggestForm.photo);
      fd.append('submitterName', user.name || '');
      fd.append('submitterEmail', user.email || '');
      fd.append('submitterPhone', user.whatsapp || '');
      const filteredAch = suggestionAchievements.filter(a => a.trim());
      fd.append('achievements', JSON.stringify(filteredAch));
      suggestDocs.forEach(file => fd.append('documents', file));

      const res = await submitAchieverSuggestion(fd);
      if (res.success) {
        setSuggestMsg({ type: 'success', text: res.message || 'Suggestion submitted successfully!' });
        setSuggestForm({ name: '', title: '', category: 'Healthcare & Medicine', district: user.district || 'Colombo', services: '', bio: '', photo: '' });
        setSuggestionAchievements(['']);
        setSuggestDocs([]);
        await loadMySuggestions();
      } else {
        setSuggestMsg({ type: 'error', text: res.message || 'Submission failed. Please try again.' });
      }
    } catch (err) {
      setSuggestMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleUnlike = (newsId) => {
    if (!user?.email) return;
    toggleLikeNews(user.email, newsId);
    refreshUserData();
  };

  const handleUnlikeAchiever = (achieverId) => {
    if (!user?.email) return;
    toggleLikeAchiever(user.email, achieverId);
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

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Image file size must be less than 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    const res = await updateUserProfile({
      name,
      whatsapp,
      district,
      address,
      bio,
      avatar,
    });
    if (res && res.success !== false) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ type: '', text: '' });
    if (!newPassword || newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const res = await changePassword({ currentPassword, newPassword });
    if (res.success) {
      setPwMsg({ type: 'success', text: res.message || 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwMsg({ type: '', text: '' }), 2000);
    } else {
      setPwMsg({ type: 'error', text: res.message || 'Password update failed. Check your current password.' });
    }
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
    { id: 'voted', label: 'Awards', count: votedAwards.length, icon: Trophy, color: 'text-gold' },
    { id: 'liked', label: 'Liked', count: likedNews.length + likedAchievers.length, icon: Heart, color: 'text-primary' },
    { id: 'saved', label: 'Saved', count: savedNews.length, icon: Bookmark, color: 'text-blue-400' },
    { id: 'comments', label: 'Comments', count: userComments.length, icon: MessageSquare, color: 'text-emerald-400' },
    { id: 'suggest', label: 'Suggest Achiever', count: mySuggestions.length || undefined, icon: Lightbulb, color: 'text-amber-400' },
    { id: 'settings', label: 'Profile', icon: Settings, color: 'text-text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-dark-100 pb-20">
      {/* Profile Header Banner */}
      <div className="relative bg-dark-200 border-b border-surface-border pt-6 sm:pt-8 pb-8 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-gold/5 to-transparent pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            {/* User Profile Card */}
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={user.avatar || avatar}
                  alt={user.name}
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-primary/40 shadow-glow"
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
                  <h1 className="font-manrope font-black text-xl sm:text-3xl text-text-primary">
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

                <p className="text-text-muted text-xs sm:text-sm mb-2 sm:mb-3">{user.email}</p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                  <span className="flex items-center gap-1 bg-dark-300 px-2 sm:px-2.5 py-1 rounded-lg border border-surface-border">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {user.district || 'Colombo'}
                  </span>
                  <span className="flex items-center gap-1 bg-dark-300 px-2 sm:px-2.5 py-1 rounded-lg border border-surface-border">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {user.joinedDate || '2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="btn-gold text-xs px-3 sm:px-4 py-2 sm:py-2.5 font-bold flex items-center gap-1.5 shadow-glow-gold"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Console</span>
                  <span className="sm:hidden">Admin</span>
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-secondary text-xs px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-1.5 text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-6 sm:mt-8">
            <div className="card p-3 sm:p-4 bg-dark-300/80 border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-text-muted">Awards Voted</span>
                <Trophy className="w-4 h-4 text-gold" />
              </div>
              <p className="font-manrope font-extrabold text-xl sm:text-2xl text-white mt-1">
                {votedAwards.length}
              </p>
            </div>
            <div className="card p-3 sm:p-4 bg-dark-300/80 border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-text-muted">Stories Liked</span>
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <p className="font-manrope font-extrabold text-xl sm:text-2xl text-white mt-1">
                {likedNews.length + likedAchievers.length}
              </p>
            </div>
            <div className="card p-3 sm:p-4 bg-dark-300/80 border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-text-muted">Saved Stories</span>
                <Bookmark className="w-4 h-4 text-blue-400" />
              </div>
              <p className="font-manrope font-extrabold text-xl sm:text-2xl text-white mt-1">
                {savedNews.length}
              </p>
            </div>
            <div className="card p-3 sm:p-4 bg-dark-300/80 border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-text-muted">Discussions</span>
                <MessageSquare className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="font-manrope font-extrabold text-xl sm:text-2xl text-white mt-1">
                {userComments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="container-main py-6 sm:py-8">
        {/* Navigation Tabs - compact on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 border-b border-surface-border mb-6 sm:mb-8 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border shrink-0 ${
                  isActive
                    ? 'bg-primary/15 text-primary border-primary/30 shadow-glow-sm'
                    : 'bg-dark-200 text-text-secondary border-surface-border hover:bg-dark-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color} shrink-0`} />
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

        {/* Tab 1: Voted Awards / My Ballots */}
        {activeTab === 'voted' && (() => {
          const allCategories = getAllAwardCategories().filter((c) => c !== 'All');
          const allAwardsList = getAllAwards();
          const categoryTotalVotesMap = {};
          allAwardsList.forEach((a) => {
            categoryTotalVotesMap[a.category] = (categoryTotalVotesMap[a.category] || 0) + (a.votes || 0);
          });
          const votedCategoryNames = new Set(votedAwards.map((a) => a.category));
          const unvotedCategories = allCategories.filter((cat) => !votedCategoryNames.has(cat));
          const ballotProgressPercent = allCategories.length > 0
            ? Math.round((votedAwards.length / allCategories.length) * 100)
            : 0;

          const categoryIcons = {
            Healthcare: '🩺',
            'Arts & Culture': '🎭',
            'Environment & Technology': '⚡',
            'Social Service': '💛',
            Sports: '🥇',
            'Humanitarian Service': '🌟',
            Education: '🎓',
          };

          return (
            <div className="space-y-8">
              {/* Balloting Status & Progress Card */}
              <div className="card p-5 sm:p-6 bg-gradient-to-r from-dark-300/90 via-dark-200 to-dark-300/90 border-2 border-gold/30 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center shrink-0 border border-gold/30 shadow-glow-gold/20">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-manrope font-extrabold text-lg sm:text-xl text-white">
                          Your Official Ballot
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 text-[10px] font-bold uppercase tracking-wider">
                          1 Vote / Category
                        </span>
                      </div>
                      <p className="text-text-muted text-xs mt-0.5">
                        Democratic civic honours system: Vote for 1 nominee in each national category.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/awards"
                    className="btn-gold text-xs px-4 py-2.5 rounded-xl font-extrabold flex items-center justify-center gap-1.5 shadow-glow-gold self-start sm:self-auto"
                  >
                    <span>Browse All Nominees</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Progress Bar */}
                <div className="pt-3 border-t border-surface-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                      <span>
                        Ballot Completion:{' '}
                        <strong className="text-white">
                          {votedAwards.length} of {allCategories.length} Categories Voted
                        </strong>
                      </span>
                    </span>
                    <span className="font-mono font-bold text-gold">{ballotProgressPercent}%</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-dark-400 overflow-hidden border border-surface-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(3, ballotProgressPercent))}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-yellow-300"
                    />
                  </div>
                </div>
              </div>

              {/* Voted Nominees Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-manrope font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Your Cast Votes ({votedAwards.length})</span>
                  </h3>
                  {votedAwards.length > 0 && (
                    <span className="text-xs text-text-muted">
                      Click "Switch Pick" to vote for a different nominee in any category.
                    </span>
                  )}
                </div>

                {votedAwards.length === 0 ? (
                  <div className="card p-10 bg-dark-200 border-surface-border text-center rounded-2xl">
                    <Trophy className="w-12 h-12 text-gold/30 mx-auto mb-3" />
                    <h3 className="font-bold text-base text-white mb-1">No Award Votes Cast Yet</h3>
                    <p className="text-text-muted text-xs max-w-sm mx-auto mb-4 leading-relaxed">
                      Participate in democratic recognition of Sri Lanka's leading pioneers and changemakers. Vote for 1 nominee in each category.
                    </p>
                    <Link to="/awards" className="btn-primary text-xs px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Explore Nominees & Cast First Vote</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {votedAwards.map((award) => {
                      const totalCatVotes = categoryTotalVotesMap[award.category] || award.votes || 0;
                      const catPercentage = totalCatVotes > 0 ? Math.round(((award.votes || 0) / totalCatVotes) * 100) : 100;

                      return (
                        <motion.div
                          key={award.id || award._id}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="card overflow-hidden bg-dark-200 border-2 border-gold/40 hover:border-gold transition-all flex flex-col justify-between shadow-glow-gold/10"
                        >
                          {/* Top Accent Ribbon */}
                          <div className="h-1.5 w-full bg-gradient-to-r from-gold-dark via-gold to-yellow-400" />

                          <div className="p-5 space-y-4">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl">{categoryIcons[award.category] || award.icon || '🏆'}</span>
                                <div>
                                  <span className="text-[10px] text-gold font-extrabold uppercase tracking-wider block">
                                    {award.category} · {award.year}
                                  </span>
                                  <h4 className="font-manrope font-bold text-sm text-white line-clamp-1">
                                    {award.title}
                                  </h4>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-[10px] font-bold shrink-0 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Voted Pick
                              </span>
                            </div>

                            {/* Nominee Profile Box */}
                            <div className="flex items-center gap-3 bg-dark-300/90 p-3 rounded-2xl border border-surface-border">
                              <img
                                src={award.thumbnail}
                                alt={award.nominee}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gold shrink-0"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';
                                }}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-extrabold text-white truncate">{award.nominee}</p>
                                <p className="text-[11px] text-text-muted truncate mt-0.5">{award.presenter}</p>
                              </div>
                            </div>

                            <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">
                              {award.description}
                            </p>

                            {/* Real-time Vote Count & Share */}
                            <div className="pt-2 border-t border-surface-border/70 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-text-muted font-medium">Real-Time Community Votes</span>
                                <span className="font-mono font-bold text-gold">
                                  {award.votes || 0} {(award.votes || 0) === 1 ? 'vote' : 'votes'} ({catPercentage}% of category)
                                </span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-dark-400 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-gold to-yellow-300"
                                  style={{ width: `${Math.min(100, Math.max(5, catPercentage))}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="p-4 pt-3 border-t border-surface-border/70 flex items-center justify-between bg-dark-300/40">
                            <button
                              onClick={() => handleRetractVote(award.id || award._id)}
                              className="text-xs text-red-400 hover:text-red-300 font-semibold px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center gap-1"
                              title="Retract vote"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <Link
                                to={`/awards?category=${encodeURIComponent(award.category)}`}
                                className="text-xs text-gold hover:text-gold-light font-bold flex items-center gap-1 bg-gold/10 hover:bg-gold/20 px-2.5 py-1.5 rounded-lg border border-gold/25 transition-all"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Switch Pick</span>
                              </Link>

                              {award.nomineeId && (
                                <Link
                                  to={`/achiever/${award.nomineeId}`}
                                  className="text-xs text-primary hover:underline font-bold"
                                >
                                  Bio →
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Unvoted Categories Shelf */}
              {unvotedCategories.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-surface-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-manrope font-bold text-base text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span>Remaining Categories to Vote ({unvotedCategories.length})</span>
                      </h3>
                      <p className="text-xs text-text-muted">
                        Complete your civic ballot by casting your vote in the categories below.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {unvotedCategories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/awards?category=${encodeURIComponent(cat)}`}
                        className="card p-4 bg-dark-200 border-surface-border hover:border-gold/50 hover:bg-dark-300/80 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                            {categoryIcons[cat] || '🏆'}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-manrope font-bold text-xs text-white group-hover:text-gold transition-colors truncate">
                              {cat}
                            </h4>
                            <span className="text-[10px] text-text-muted">Not voted yet</span>
                          </div>
                        </div>

                        <span className="text-xs text-gold font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform shrink-0 ml-2">
                          <span>Vote</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Tab 2: Liked News & Achievers */}
        {activeTab === 'liked' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-manrope font-bold text-xl text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Liked Articles & Achiever Biographies
                </h2>
                <p className="text-text-muted text-xs">
                  News stories, editorial features, and national achievers you have appreciated.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/achievers" className="btn-ghost text-xs px-3 py-1.5 text-gold hover:underline">
                  Achievers →
                </Link>
                <Link to="/news" className="btn-secondary text-xs px-3.5 py-2">
                  News Feed →
                </Link>
              </div>
            </div>

            {likedNews.length === 0 && likedAchievers.length === 0 ? (
              <div className="card p-12 bg-dark-200 border-surface-border text-center">
                <Heart className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <h3 className="font-bold text-base text-white mb-1">No Liked Items Yet</h3>
                <p className="text-text-muted text-xs max-w-sm mx-auto mb-4">
                  Hit the like button on any story or achiever biography to save it to your personal favourites.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link to="/achievers" className="btn-primary text-xs px-5 py-2.5">
                    Browse Achievers
                  </Link>
                  <Link to="/news" className="btn-secondary text-xs px-5 py-2.5">
                    Browse News
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Liked Achievers */}
                {likedAchievers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Liked National Achievers ({likedAchievers.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {likedAchievers.map((achiever) => (
                        <motion.div
                          key={achiever.id || achiever._id}
                          layout
                          className="card overflow-hidden bg-dark-200 border-surface-border hover:border-gold/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative aspect-video bg-dark-300 overflow-hidden">
                              <img
                                src={achiever.thumbnail}
                                alt={achiever.name}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-2 left-2 badge-red text-[10px]">
                                {achiever.category}
                              </span>
                            </div>
                            <div className="p-4">
                              <h4 className="font-manrope font-bold text-sm text-white line-clamp-1 leading-snug mb-1">
                                {achiever.name}
                              </h4>
                              <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">
                                {achiever.title}
                              </p>
                              <div className="flex items-center gap-1 text-[11px] text-text-muted mt-2">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                <span>{achiever.location}</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 pt-0 flex items-center justify-between border-t border-surface-border/50">
                            <button
                              onClick={() => handleUnlikeAchiever(achiever.id || achiever._id)}
                              className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Unlike
                            </button>
                            <Link
                              to={`/achiever/${achiever.id || achiever._id}`}
                              className="btn-primary text-xs px-3 py-1.5 font-bold"
                            >
                              View Biography
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Liked News Articles */}
                {likedNews.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" /> Liked News Stories ({likedNews.length})
                    </h3>
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
                  </div>
                )}
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

        {/* ══ Tab 5: Suggest Achiever ═══════════════════════════════════════════ */}
        {activeTab === 'suggest' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500/15 via-dark-200 to-dark-300 border border-amber-500/25 p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-glow-gold">
                  <Lightbulb className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h2 className="font-manrope font-black text-2xl sm:text-3xl text-white mb-1 flex items-center gap-2">
                    Suggest an Achiever
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">Beta</span>
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
                    Know someone who has made an extraordinary impact on their community? Nominate them for recognition on PeopleFirst. Our editorial team will review your suggestion.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* ── Suggestion Form ─────────────────────────────────────────────── */}
              <div className="xl:col-span-2">
                <div className="bg-dark-200 border border-surface-border rounded-2xl p-6 shadow-card">
                  <h3 className="font-manrope font-bold text-lg text-white mb-5 flex items-center gap-2">
                    <Send className="w-5 h-5 text-amber-400" /> Submit Achiever Details
                  </h3>

                  {/* Status message */}
                  <AnimatePresence>
                    {suggestMsg.text && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 mb-6 ${
                          suggestMsg.type === 'success'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/15 border-red-500/30 text-red-400'
                        }`}
                      >
                        {suggestMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                        {suggestMsg.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSuggestSubmit} className="space-y-5">
                    {/* Row 1: Achiever Name + Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1.5">
                          Achiever Full Name <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Anura Perera"
                          value={suggestForm.name}
                          onChange={e => setSuggestForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/60 transition-all placeholder-text-muted"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1.5">
                          Professional Title / Role
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Principal, XYZ School"
                          value={suggestForm.title}
                          onChange={e => setSuggestForm(f => ({ ...f, title: e.target.value }))}
                          className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/60 transition-all placeholder-text-muted"
                        />
                      </div>
                    </div>

                    {/* Row 2: Category + District */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1.5 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" /> Category <span className="text-primary">*</span>
                        </label>
                        <select
                          value={suggestForm.category}
                          onChange={e => setSuggestForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/60 transition-all"
                        >
                          {[
                            'Healthcare & Medicine', 'Education & Academia', 'Sports & Athletics',
                            'Arts & Culture', 'Business & Entrepreneurship', 'Environment & Conservation',
                            'Technology & Innovation', 'Public Service & Governance',
                            'Social Service & Humanitarian', 'Agriculture & Rural Development',
                            'Religious & Spiritual Leadership', 'Other'
                          ].map(cat => (
                            <option key={cat} value={cat} className="bg-dark-200">{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-primary" /> District <span className="text-primary">*</span>
                        </label>
                        <select
                          value={suggestForm.district}
                          onChange={e => setSuggestForm(f => ({ ...f, district: e.target.value }))}
                          className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/60 transition-all"
                        >
                          {DISTRICTS.map(d => (
                            <option key={d} value={d} className="bg-dark-200">{d} District</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Services / Contributions */}
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">
                        Services & Community Contributions <span className="text-primary">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Describe how this person has served the community — programs, initiatives, impact on society..."
                        value={suggestForm.services}
                        onChange={e => setSuggestForm(f => ({ ...f, services: e.target.value }))}
                        className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/60 transition-all resize-none placeholder-text-muted"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">
                        Brief Biography
                      </label>
                      <textarea
                        rows={3}
                        placeholder="A short background story — their journey, background, family, and what motivates them..."
                        value={suggestForm.bio}
                        onChange={e => setSuggestForm(f => ({ ...f, bio: e.target.value }))}
                        className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/60 transition-all resize-none placeholder-text-muted"
                      />
                    </div>

                    {/* Photo URL */}
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-primary" /> Photo URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={suggestForm.photo}
                        onChange={e => setSuggestForm(f => ({ ...f, photo: e.target.value }))}
                        className="w-full bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400/60 transition-all placeholder-text-muted"
                      />
                      {suggestForm.photo && (
                        <img src={suggestForm.photo} alt="Preview" className="mt-2 w-16 h-16 rounded-xl object-cover ring-2 ring-amber-400/30" onError={e => e.target.style.display = 'none'} />
                      )}
                    </div>

                    {/* Achievements Dynamic List */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-text-primary flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-400" /> Key Achievements
                        </label>
                        <button
                          type="button"
                          onClick={addAchievement}
                          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {suggestionAchievements.map((ach, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center text-[10px] font-black shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              placeholder={`Achievement ${idx + 1}`}
                              value={ach}
                              onChange={e => setAchievementVal(idx, e.target.value)}
                              className="flex-1 bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/60 transition-all placeholder-text-muted"
                            />
                            {suggestionAchievements.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeAchievement(idx)}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-2 flex items-center gap-1">
                        <FileUp className="w-3 h-3 text-blue-400" /> Supporting Documents
                        <span className="text-text-muted font-normal">(PDF, Images — max 5 files, 10MB each)</span>
                      </label>
                      <div
                        className="border-2 border-dashed border-surface-border hover:border-amber-400/50 rounded-xl p-6 text-center cursor-pointer transition-all group"
                        onClick={() => suggestDocRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={suggestDocRef}
                          onChange={handleSuggestDocChange}
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          multiple
                          className="hidden"
                        />
                        <FileUp className="w-8 h-8 text-text-muted group-hover:text-amber-400 mx-auto mb-2 transition-colors" />
                        <p className="text-xs text-text-secondary">
                          Click to upload certificates, press clippings, or reference PDFs
                        </p>
                        <p className="text-[10px] text-text-muted mt-1">Supported: PDF, JPG, PNG, WEBP</p>
                      </div>

                      {suggestDocs.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {suggestDocs.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-dark-300 border border-surface-border rounded-xl px-3 py-2.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                <span className="text-xs text-text-primary truncate">{file.name}</span>
                                <span className="text-[10px] text-text-muted shrink-0">
                                  ({(file.size / 1024).toFixed(0)} KB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSuggestDoc(idx)}
                                className="text-red-400 hover:text-red-300 p-1 rounded-lg transition-colors shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3 flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={suggestLoading}
                        className="btn-primary text-sm px-8 py-3 font-bold flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                      >
                        {suggestLoading ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting...</>
                        ) : (
                          <><Send className="w-4 h-4" /> Submit Suggestion</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* ── Sidebar: Tips + My Submissions ─────────────────────────────── */}
              <div className="space-y-6">
                {/* Guidelines */}
                <div className="bg-dark-200 border border-surface-border rounded-2xl p-5">
                  <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Submission Guidelines
                  </h4>
                  <div className="space-y-3">
                    {[
                      { icon: '🎯', title: 'Be Specific', desc: 'Describe concrete achievements and measurable impact.' },
                      { icon: '📋', title: 'Add Documents', desc: 'Upload certificates or press clippings for credibility.' },
                      { icon: '🌍', title: 'Community Impact', desc: 'Focus on their contribution to Sri Lanka and its people.' },
                      { icon: '⚡', title: 'Quick Review', desc: 'Our team reviews submissions within 3–5 business days.' },
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xl shrink-0 mt-0.5">{tip.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-text-primary">{tip.title}</p>
                          <p className="text-[11px] text-text-muted leading-relaxed">{tip.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Past Submissions */}
                <div className="bg-dark-200 border border-surface-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> My Submissions
                    </h4>
                    <span className="text-[10px] text-text-muted bg-dark-300 px-2 py-0.5 rounded-full border border-surface-border">
                      {mySuggestions.length} total
                    </span>
                  </div>

                  {mySuggestions.length === 0 ? (
                    <div className="text-center py-6">
                      <Lightbulb className="w-8 h-8 text-amber-400/30 mx-auto mb-2" />
                      <p className="text-xs text-text-muted">No submissions yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-none">
                      {mySuggestions.map(s => (
                        <div key={s._id} className="bg-dark-300 border border-surface-border rounded-xl p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{s.name}</p>
                              <p className="text-[10px] text-text-muted">{s.category} · {s.district}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${
                              s.status === 'approved' || s.status === 'promoted'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : s.status === 'rejected'
                                ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            }`}>
                              {s.status === 'promoted' ? '⭐ Featured' : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                            </span>
                          </div>
                          {s.adminNote && (
                            <p className="mt-2 text-[10px] text-text-secondary italic border-t border-surface-border/60 pt-2">
                              Admin note: {s.adminNote}
                            </p>
                          )}
                          <p className="text-[10px] text-text-muted mt-1">
                            Submitted {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Profile Settings Form */}
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
              {/* Avatar Selector with Custom Upload Option */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-2">
                  Profile Avatar & Photo
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {/* Custom Uploaded Avatar Button / Preview */}
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarFile}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 rounded-xl border-2 border-dashed border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary/20 flex flex-col items-center justify-center text-primary transition-all shrink-0 group"
                      title="Upload custom profile photo"
                    >
                      <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[8px] font-bold mt-0.5">Upload</span>
                    </button>
                  </div>

                  {/* Preset Avatars */}
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
                <p className="text-[11px] text-text-muted mt-1">
                  Pick a curated avatar or upload your custom photo from your device.
                </p>
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

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="tel"
                    placeholder="+94 7X XXX XXXX"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>
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

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <HomeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input
                    type="text"
                    placeholder="Street, City, Postal Code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                  />
                </div>
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

            {/* ── CHANGE PASSWORD SECTION ─────────────────────────────────── */}
            <div className="mt-10 pt-8 border-t border-surface-border">
              <h3 className="font-manrope font-bold text-lg text-white mb-1 flex items-center gap-2">
                <Key className="w-5 h-5 text-gold" />
                Change Account Password
              </h3>
              <p className="text-text-muted text-xs mb-5">
                Ensure your account remains secure with a strong password (minimum 6 characters).
              </p>

              {pwMsg.text && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 mb-5 ${
                    pwMsg.type === 'success'
                      ? 'bg-success/15 border-success/30 text-success'
                      : 'bg-red-500/15 border-red-500/30 text-red-400'
                  }`}
                >
                  {pwMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  {pwMsg.text}
                </motion.div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      required
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">
                    New Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      required
                      placeholder="Create a new secure password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="btn-gold text-xs px-5 py-2.5 font-bold flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
