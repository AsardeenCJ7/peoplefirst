import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper, Award, PlusCircle, Trash2, ExternalLink, CheckCircle2,
  Calendar, Clock, Image as ImageIcon, Tag, User, BookOpen, Sparkles,
  Search, Layers, ShieldCheck, BarChart3, FileText, TrendingUp, Eye,
  AlertCircle, Plus, Flame, Edit3, Save, X, Users, MessageSquare,
  Flag, ChevronDown, ChevronUp, Ban, UserCheck,
  Star, RefreshCw, AlertTriangle, Send, Activity, Trophy, Home, Sun, Moon, Tv, LogOut, Globe,
  Lock, Key, EyeOff, Camera, Lightbulb, Building2, FileUp, CheckSquare
} from 'lucide-react';


import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';
import { getAllNews, saveNewsArticle, deleteNewsArticle, fetchNewsFromApi, newsCategories } from '../data/news';
import { getAllAchievers, saveAchiever, deleteAchiever, fetchAchieversFromApi, categories } from '../data/achievers';
import { getAllUsers, saveUser, deleteUser, toggleUserStatus, fetchUsersFromApi, getAllFeedback, deleteFeedback, updateFeedbackStatus, fetchFeedbackFromApi } from '../data/users';
import { getAllAwards, saveAward, deleteAward, fetchAwardsFromApi, getAllAwardCategories, addAwardCategory, deleteAwardCategory, getVotingConfig, saveVotingConfig, checkAndResolveWinners } from '../data/awards';
import { getAllSuggestions, reviewSuggestion, deleteSuggestion } from '../data/suggestions';
import { isIntroEnabled, setIntroEnabled, clearIntroSeenFlag, getIntroDuration, setIntroDuration } from '../components/ui/IntroAnimation';
import { extractYouTubeId } from '../utils/youtube';

const SAMPLE_IMAGES = [
  { label: 'Science', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80' },
  { label: 'Tech', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80' },
  { label: 'Sports', url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80' },
  { label: 'Green', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80' },
  { label: 'Arts', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80' },
  { label: 'Health', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80' },
];

const AWARD_ICONS = ['🏆', '🥇', '🥈', '🥉', '🎖️', '🌟', '💛', '⚡', '🏅', '🎗️', '🌠', '👑'];

const blankNews = () => ({
  title: '', category: 'Local', subcategory: '', author: 'PeopleFirst Editorial Desk',
  date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0, 5),
  readTime: '4 min read', image: SAMPLE_IMAGES[0].url, tags: 'Sri Lanka, National',
  featured: false, summary: '', content: '',
});

const blankAchiever = () => ({
  name: '', title: '', category: 'Healthcare & Medicine', location: 'Colombo District',
  year: '2026', thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  videoId: 'dQw4w9WgXcQ', featured: true, verified: true,
  achievementsText: 'National Excellence Award 2026\nCommunity Service Pioneer',
  bio: '',
  interviewSeries: [
    { id: 'ep-1', episode: 1, title: 'Part 1: Keynote & Foundational Journey', videoId: 'dQw4w9WgXcQ', duration: '20:00', date: new Date().toISOString().split('T')[0], description: 'Biographical opening interview part.' }
  ],
  pages: [
    { title: 'Early Life & Heritage', icon: '📖', text: 'Born in Sri Lanka, dedicated to public service.' },
    { title: 'Major Breakthroughs', icon: '🏆', text: 'Created nationwide impact.' },
    { title: 'Legacy & Community Voice', icon: '🌟', text: 'Inspires the next generation.' },
  ],
});

const blankAward = () => ({
  title: '', category: 'Healthcare', nominee: '', nomineeId: '',
  description: '', status: 'Nominee', year: new Date().getFullYear(),
  presenter: '', thumbnail: '', votes: 0, icon: '🏆',
});

// ── Sub-components ─────────────────────────────────────────────────────────

function ConfirmModal({ open, title, message, onConfirm, onCancel, isDark = true }) {
  if (!open) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
        className={`${isDark ? 'bg-[#181818] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center mb-4 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-center text-base sm:text-lg mb-1">{title}</h3>
        <p className={`text-xs sm:text-sm text-center mb-5 sm:mb-6 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{message}</p>
        <div className="flex gap-2.5 sm:gap-3">
          <button onClick={onCancel} className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/30">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Toast({ message, onDone, isDark = true }) {
  useEffect(() => { const t = setTimeout(onDone, 1500); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -28, transition: { duration: 0.18 } }}
      className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[300] ${isDark ? 'bg-[#1a1a1a] text-white' : 'bg-white text-slate-900 shadow-xl'} border-2 border-red-500 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap max-w-[92vw]`}
    >
      <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
      <span className="truncate">{message}</span>
    </motion.div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label, badge, isDark = true }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 shrink-0 select-none whitespace-nowrap ${active
        ? isDark
          ? 'bg-red-500/15 text-white border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
          : 'bg-red-500 text-white shadow-md shadow-red-500/25'
        : isDark
          ? 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
        }`}
    >
      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? (isDark ? 'text-red-400' : 'text-white') : ''}`} />
      <span>{label}</span>
      {badge != null && (
        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full transition-colors ${active
          ? isDark
            ? 'bg-red-500/30 text-red-200 border border-red-500/40'
            : 'bg-white/25 text-white'
          : isDark
            ? 'bg-white/10 text-gray-400 group-hover:text-gray-200'
            : 'bg-slate-200 text-slate-700'
          }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-red-400', bg = 'bg-red-500/10', isDark = true }) {
  return (
    <div className={`${isDark ? 'bg-[#1a1a1a] border-white/8' : 'bg-white border-slate-200 shadow-sm'} border rounded-2xl p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4 transition-all`}>
      <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mb-0.5 truncate ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{label}</div>
        <div className={`text-lg sm:text-2xl font-black ${color}`}>{value}</div>
        {sub && <div className={`text-[9px] sm:text-[10px] mt-0.5 truncate ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Main Admin Component ───────────────────────────────────────────────────

export default function Admin() {
  const { user, login, logout, openAuthModal, changePassword, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate('/');
  };

  const [theme, setTheme] = useState(() => localStorage.getItem('pf_admin_theme') || 'dark');
  const isDark = theme === 'dark';
  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('pf_admin_theme', next);
  };

  // Admin Security & Password Modal State
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [adminCurrentPw, setAdminCurrentPw] = useState('');
  const [adminNewPw, setAdminNewPw] = useState('');
  const [adminConfirmPw, setAdminConfirmPw] = useState('');
  const [adminShowCurrentPw, setAdminShowCurrentPw] = useState(false);
  const [adminShowNewPw, setAdminShowNewPw] = useState(false);
  const [adminShowConfirmPw, setAdminShowConfirmPw] = useState(false);
  const [adminPwMsg, setAdminPwMsg] = useState({ type: '', text: '' });
  const adminAvatarInputRef = useRef(null);

  const handleAdminAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Avatar image size must be less than 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      await updateUserProfile({ avatar: event.target.result });
      showToast('Admin avatar updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleAdminChangePassword = async (e) => {
    e.preventDefault();
    setAdminPwMsg({ type: '', text: '' });
    if (!adminNewPw || adminNewPw.length < 6) {
      setAdminPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (adminNewPw !== adminConfirmPw) {
      setAdminPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const res = await changePassword({ currentPassword: adminCurrentPw, newPassword: adminNewPw });
    if (res && res.success) {
      setAdminPwMsg({ type: 'success', text: res.message || 'Password updated!' });
      setAdminCurrentPw('');
      setAdminNewPw('');
      setAdminConfirmPw('');
      showToast('Admin password updated successfully!');
      setTimeout(() => {
        setAdminPwMsg({ type: '', text: '' });
        setSecurityModalOpen(false);
      }, 1500);
    } else {
      setAdminPwMsg({ type: 'error', text: res?.message || 'Password update failed. Please check current password.' });
    }
  };

  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  // Intro Animation toggle & duration
  const [introEnabled, setIntroEnabledState] = useState(() => isIntroEnabled());
  const [introDuration, setIntroDurationState] = useState(() => getIntroDuration());

  const handleToggleIntro = (val) => {
    setIntroEnabled(val);
    setIntroEnabledState(val);
    if (val) clearIntroSeenFlag();
    showToast(val ? 'Intro animation ENABLED! Will play on next visit.' : 'Intro animation disabled.');
  };

  const handleDurationChange = (val) => {
    const num = parseFloat(val);
    setIntroDuration(num);
    setIntroDurationState(num);
    clearIntroSeenFlag();
    showToast(`Intro speed set to ${num}s!`);
  };

  // Data lists
  const [newsList, setNewsList] = useState([]);
  const [achieversList, setAchieversList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [awardsList, setAwardsList] = useState([]);
  const [suggestionsList, setSuggestionsList] = useState([]);

  // Suggestion review state
  const [suggStatusFilter, setSuggStatusFilter] = useState('all');
  const [suggSearch, setSuggSearch] = useState('');
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  // Search / filter
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCat, setNewsCat] = useState('All');
  const [achSearch, setAchSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [fbSearch, setFbSearch] = useState('');
  const [fbStatusFilter, setFbStatusFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [awardSearch, setAwardSearch] = useState('');
  const [awardCatFilter, setAwardCatFilter] = useState('All');

  // Forms
  const [newsForm, setNewsForm] = useState(blankNews());
  const [achForm, setAchForm] = useState(blankAchiever());
  const [awardForm, setAwardForm] = useState(blankAward());
  const [editingNews, setEditingNews] = useState(null);
  const [editingAch, setEditingAch] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingAward, setEditingAward] = useState(null);

  // Voting Season & Deadline state
  const [votingConfig, setVotingConfig] = useState(getVotingConfig());
  const [votingDeadlineInput, setVotingDeadlineInput] = useState(() => {
    try {
      const d = new Date(getVotingConfig().deadline);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    } catch {
      return '';
    }
  });

  // Award Categories state
  const [awardCategoriesList, setAwardCategoriesList] = useState(getAllAwardCategories());
  const [newCatInput, setNewCatInput] = useState('');
  const [categoryMsg, setCategoryMsg] = useState('');

  // UI toggles
  const [newsFormOpen, setNewsFormOpen] = useState(true);
  const [achFormOpen, setAchFormOpen] = useState(true);
  const [awardFormOpen, setAwardFormOpen] = useState(true);
  const [newsPreview, setNewsPreview] = useState(false);

  const showToast = (msg) => setToast(msg);
  const loadAll = async () => {
    setNewsList(getAllNews());
    setAchieversList(getAllAchievers());
    setUsersList(getAllUsers());
    setFeedbackList(getAllFeedback());
    setAwardsList(getAllAwards());
    setAwardCategoriesList(getAllAwardCategories());

    try {
      const [freshNews, freshAch, freshAwards, freshUsers, freshFb, freshSugg] = await Promise.all([
        fetchNewsFromApi(),
        fetchAchieversFromApi(),
        fetchAwardsFromApi(),
        fetchUsersFromApi(),
        fetchFeedbackFromApi(),
        getAllSuggestions('all'),
      ]);
      if (freshNews) setNewsList(freshNews);
      if (freshAch) setAchieversList(freshAch);
      if (freshAwards) setAwardsList(freshAwards);
      if (freshUsers) setUsersList(freshUsers);
      if (freshFb) setFeedbackList(freshFb);
      if (freshSugg) setSuggestionsList(freshSugg);
    } catch (err) {
      console.warn('Live MongoDB sync in admin:', err);
    }
  };
  useEffect(() => { loadAll(); }, []);

  const askConfirm = (title, message, onConfirm) => setConfirm({ title, message, onConfirm });
  const closeConfirm = () => setConfirm(null);

  const wordCount = useMemo(() =>
    `${newsForm.summary} ${newsForm.content}`.trim().split(/\s+/).filter(Boolean).length,
    [newsForm.summary, newsForm.content]
  );
  useEffect(() => {
    const mins = Math.max(1, Math.ceil(wordCount / 180));
    setNewsForm(p => ({ ...p, readTime: `${mins} min read` }));
  }, [wordCount]);

  // ── NEWS CRUD ──────────────────────────────────────────────────────────────
  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    if (!newsForm.title.trim() || !newsForm.summary.trim()) { showToast('Title and summary required.'); return; }
    const tagArr = newsForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    await saveNewsArticle({ ...newsForm, id: editingNews || Date.now(), tags: tagArr.length ? tagArr : ['Sri Lanka'], content: newsForm.content || newsForm.summary });
    await loadAll();
    showToast(editingNews ? 'Article updated in database!' : 'Article published to database!');
    setNewsForm(blankNews()); setEditingNews(null);
  };
  const startEditNews = (item) => {
    setNewsForm({ title: item.title, category: item.category, subcategory: item.subcategory || '', author: item.author, date: item.date, time: item.time || '', readTime: item.readTime || '', image: item.image, tags: (item.tags || []).join(', '), featured: item.featured, summary: item.summary, content: item.content || '' });
    setEditingNews(item.id || item._id); setNewsFormOpen(true); setTab('news');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteNews = (id) => askConfirm('Delete Article', 'Permanently remove this article from MongoDB live database?', async () => { await deleteNewsArticle(id); await loadAll(); showToast('Article deleted from database.'); closeConfirm(); });

  // ── ACHIEVER CRUD ─────────────────────────────────────────────────────────
  const handleAchSubmit = async (e) => {
    e.preventDefault();
    if (!achForm.name.trim() || !achForm.title.trim()) { showToast('Name and headline required.'); return; }
    const achievements = achForm.achievementsText.split('\n').map(l => l.trim()).filter(Boolean);
    const biographyPages = achForm.pages.map(p => ({ title: p.title || 'Chapter', icon: p.icon || '📖', paragraphs: [p.text] }));
    const cleanMainVideoId = extractYouTubeId(achForm.videoId);
    const filteredEpisodes = (achForm.interviewSeries || [])
      .filter(ep => ep.title?.trim() || ep.videoId?.trim())
      .map(ep => ({
        ...ep,
        videoId: extractYouTubeId(ep.videoId)
      }));
    const primaryVideoId = filteredEpisodes[0]?.videoId || cleanMainVideoId || 'dQw4w9WgXcQ';

    await saveAchiever({
      ...achForm,
      id: editingAch || Date.now(),
      videoId: primaryVideoId,
      bio: achForm.bio || `${achForm.name} is recognized for contributions in ${achForm.category}.`,
      achievements: achievements.length ? achievements : ['Distinguished Service'],
      tags: [achForm.category, achForm.location, 'Sri Lanka'],
      biographyPages,
      interviewSeries: filteredEpisodes.length ? filteredEpisodes : [
        { id: 'ep-1', episode: 1, title: 'Part 1: Recorded Interview', videoId: primaryVideoId, duration: '20:00', date: achForm.year || '2026', description: achForm.bio || '' }
      ]
    });
    await loadAll();
    setAchForm(blankAchiever()); setEditingAch(null);
  };
  const startEditAch = (item) => {
    const rawEpisodes = item.interviewSeries && item.interviewSeries.length > 0
      ? item.interviewSeries
      : [
        {
          id: 'ep-1',
          episode: 1,
          title: 'Part 1: Keynote Interview',
          videoId: item.videoId || '',
          duration: '20:00',
          date: item.year || new Date().toISOString().split('T')[0],
          description: 'Full biographical interview.'
        }
      ];

    setAchForm({
      name: item.name,
      title: item.title,
      category: item.category,
      location: item.location,
      year: item.year,
      thumbnail: item.thumbnail,
      videoId: item.videoId || '',
      featured: item.featured,
      verified: item.verified,
      achievementsText: (item.achievements || []).join('\n'),
      bio: item.bio || '',
      pages: (item.biographyPages || []).map(p => ({ title: p.title, icon: p.icon, text: (p.paragraphs || []).join('\n\n') })),
      interviewSeries: rawEpisodes
    });
    setEditingAch(item.id); setAchFormOpen(true); setTab('achievers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteAch = (id) => askConfirm('Remove Achiever', 'Permanently remove this achiever profile from database?', async () => { await deleteAchiever(id); await loadAll(); showToast('Achiever removed.'); closeConfirm(); });
  const addPage = () => setAchForm(p => ({ ...p, pages: [...p.pages, { title: `Chapter ${p.pages.length + 1}`, icon: '✨', text: '' }] }));
  const removePage = (i) => { if (achForm.pages.length > 1) setAchForm(p => ({ ...p, pages: p.pages.filter((_, idx) => idx !== i) })); };
  const setPageField = (i, field, val) => setAchForm(p => { const pp = [...p.pages]; pp[i] = { ...pp[i], [field]: val }; return { ...p, pages: pp }; });

  // Interview Series actions
  const addEpisode = () => setAchForm(p => {
    const current = p.interviewSeries || [];
    const epNum = current.length + 1;
    return {
      ...p,
      interviewSeries: [
        ...current,
        {
          id: `ep-${Date.now()}`,
          episode: epNum,
          title: `Part ${epNum}: Next Episode Title`,
          videoId: '',
          duration: '18:30',
          date: new Date().toISOString().split('T')[0],
          description: ''
        }
      ]
    };
  });
  const removeEpisode = (idx) => {
    setAchForm(p => ({
      ...p,
      interviewSeries: (p.interviewSeries || []).filter((_, i) => i !== idx)
    }));
  };
  const setEpisodeField = (idx, field, val) => {
    setAchForm(p => {
      const arr = [...(p.interviewSeries || [])];
      const finalVal = field === 'videoId' ? extractYouTubeId(val) : val;
      arr[idx] = { ...arr[idx], [field]: finalVal };
      return { ...p, interviewSeries: arr };
    });
  };

  // ── AWARDS CRUD ───────────────────────────────────────────────────────────
  const handleAwardSubmit = async (e) => {
    e.preventDefault();
    if (!awardForm.title.trim() || !awardForm.nominee.trim()) { showToast('Title and nominee are required.'); return; }
    await saveAward({ ...awardForm, id: editingAward || Date.now(), votes: Number(awardForm.votes) || 0, year: Number(awardForm.year) || new Date().getFullYear() });
    await loadAll();
    showToast(editingAward ? 'Award updated in database!' : 'Award published to database!');
    setAwardForm(blankAward()); setEditingAward(null);
  };
  const startEditAward = (item) => {
    setAwardForm({ title: item.title, category: item.category, nominee: item.nominee, nomineeId: item.nomineeId || '', description: item.description || '', status: item.status || 'Nominee', year: item.year, presenter: item.presenter || '', thumbnail: item.thumbnail || '', votes: item.votes || 0, icon: item.icon || '🏆' });
    setEditingAward(item.id || item._id); setAwardFormOpen(true); setTab('awards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteAward = (id) => askConfirm('Delete Award', 'Permanently remove this award from database?', async () => { await deleteAward(id); await loadAll(); showToast('Award deleted.'); closeConfirm(); });

  // ── VOTING DURATION & WINNER DETERMINATION ─────────────────────────────────
  const handleUpdateVotingDeadline = (e) => {
    e.preventDefault();
    if (!votingDeadlineInput) return;
    const isoDate = new Date(votingDeadlineInput).toISOString();
    const updated = saveVotingConfig({
      deadline: isoDate,
      isActive: new Date(isoDate).getTime() > Date.now(),
    });
    setVotingConfig(updated);
    showToast('Voting deadline updated successfully!');
  };

  const handleExtendVoting = (hours) => {
    const currentDeadline = new Date(votingConfig.deadline).getTime();
    const base = Math.max(Date.now(), currentDeadline);
    const newDeadline = new Date(base + hours * 60 * 60 * 1000).toISOString();
    const updated = saveVotingConfig({
      deadline: newDeadline,
      isActive: true,
    });
    setVotingConfig(updated);
    try {
      const d = new Date(newDeadline);
      setVotingDeadlineInput(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    } catch { }
    showToast(`Voting extended by ${hours >= 24 ? `${hours / 24} day(s)` : `${hours} hour(s)`}!`);
  };

  const handleEndVotingNow = () => {
    askConfirm(
      'Conclude Voting & Auto-Decide Winners',
      'This will close voting immediately, calculate the highest-voted candidate in each category as the official Winner, and publish them on the live Awards page. Proceed?',
      () => {
        const res = checkAndResolveWinners(true);
        loadAll();
        setVotingConfig(res.config);
        showToast(`Voting concluded! ${res.winners?.length || 0} category winners decided and published!`);
        closeConfirm();
      }
    );
  };

  const handleResetVotingSeason = () => {
    askConfirm(
      'Start New Voting Season',
      'Reset voting status and configure a new 7-day voting season for community balloting?',
      () => {
        const newDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const updated = saveVotingConfig({
          deadline: newDeadline,
          isActive: true,
          seasonTitle: 'National Honors Community Voting 2026',
        });
        setVotingConfig(updated);
        try {
          const d = new Date(newDeadline);
          setVotingDeadlineInput(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
        } catch { }
        loadAll();
        showToast('New voting season opened! Voting active for 7 days.');
        closeConfirm();
      }
    );
  };

  // ── AWARD CATEGORIES MANAGEMENT ──────────────────────────────────────────
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    const res = addAwardCategory(newCatInput);
    if (res.success) {
      setAwardCategoriesList(getAllAwardCategories());
      setNewCatInput('');
      setCategoryMsg('');
      showToast(res.message);
    } else {
      setCategoryMsg(res.message);
    }
  };

  const handleDeleteCategory = (catName) => {
    const inThisCat = awardsList.filter(a => a.category?.toLowerCase() === catName.toLowerCase());
    askConfirm(
      `Delete Category "${catName}"?`,
      inThisCat.length > 0
        ? `There are currently ${inThisCat.length} award(s) in "${catName}". Removing this category will remove it from future nominations and filters, but existing awards will remain until reassigned. Proceed?`
        : `Are you sure you want to remove the category "${catName}"?`,
      () => {
        const res = deleteAwardCategory(catName);
        setAwardCategoriesList(getAllAwardCategories());
        showToast(res.message);
        closeConfirm();
      }
    );
  };

  // ── USER CRUD ─────────────────────────────────────────────────────────────
  const handleToggleUser = async (id) => { const u = await toggleUserStatus(id); setUsersList(u); showToast('User status updated in database.'); await loadAll(); };
  const handleDeleteUser = (id) => askConfirm('Remove User', 'Permanently delete this user account from database?', async () => { await deleteUser(id); await loadAll(); showToast('User removed from database.'); closeConfirm(); });
  const handleSaveUser = async (user) => { await saveUser(user); await loadAll(); setEditingUser(null); showToast('User profile updated in database.'); };

  // ── FEEDBACK ──────────────────────────────────────────────────────────────
  const handleDeleteFeedback = (aId, cId) => askConfirm('Delete Feedback', 'Remove this comment permanently?', async () => { deleteFeedback(aId, cId); await loadAll(); showToast('Feedback deleted.'); closeConfirm(); });
  const handleFlagFeedback = async (aId, cId, status) => { updateFeedbackStatus(aId, cId, status); await loadAll(); showToast(`Marked as "${status}".`); };

  // ── SUGGESTION REVIEW ─────────────────────────────────────────────────────
  const handleReviewSuggestion = async (id, status) => {
    const res = await reviewSuggestion(id, status, reviewNote);
    if (res.success) {
      showToast(`Suggestion marked as ${status}!`);
      setReviewingId(null);
      setReviewNote('');
      const fresh = await getAllSuggestions('all');
      setSuggestionsList(fresh);
    } else {
      showToast('Review failed: ' + (res.message || 'Unknown error'));
    }
  };

  const handleDeleteSuggestion = (id) => askConfirm(
    'Delete Suggestion',
    'Permanently remove this achiever suggestion?',
    async () => {
      await deleteSuggestion(id);
      const fresh = await getAllSuggestions('all');
      setSuggestionsList(fresh);
      showToast('Suggestion deleted.');
      closeConfirm();
    }
  );

  // ── FILTERED LISTS ────────────────────────────────────────────────────────
  const filteredNews = useMemo(() => newsList.filter(n => {
    const q = newsSearch.toLowerCase();
    return (!q || n.title?.toLowerCase().includes(q) || n.author?.toLowerCase().includes(q)) && (newsCat === 'All' || n.category === newsCat);
  }), [newsList, newsSearch, newsCat]);

  const filteredAch = useMemo(() =>
    achieversList.filter(a => !achSearch || a.name?.toLowerCase().includes(achSearch.toLowerCase()) || a.category?.toLowerCase().includes(achSearch.toLowerCase())),
    [achieversList, achSearch]);

  const filteredUsers = useMemo(() => usersList.filter(u => {
    const q = userSearch.toLowerCase();
    return (!q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) && (userStatusFilter === 'all' || u.status === userStatusFilter);
  }), [usersList, userSearch, userStatusFilter]);

  const filteredFeedback = useMemo(() => feedbackList.filter(f => {
    const q = fbSearch.toLowerCase();
    return (!q || f.text?.toLowerCase().includes(q) || f.author?.toLowerCase().includes(q)) && (fbStatusFilter === 'all' || (f.status || 'pending') === fbStatusFilter);
  }), [feedbackList, fbSearch, fbStatusFilter]);

  const filteredAwards = useMemo(() => awardsList.filter(a => {
    const q = awardSearch.toLowerCase();
    return (!q || a.title?.toLowerCase().includes(q) || a.nominee?.toLowerCase().includes(q)) && (awardCatFilter === 'All' || a.category === awardCatFilter);
  }), [awardsList, awardSearch, awardCatFilter]);

  const catBreakdown = useMemo(() => {
    const map = {};
    newsList.forEach(n => { map[n.category] = (map[n.category] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [newsList]);
  const maxCat = catBreakdown.reduce((m, [, v]) => Math.max(m, v), 1);

  // ── Shared style tokens ──────────────────────────────────────────────────
  const inp = isDark
    ? "w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 transition-all"
    : "w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 transition-all shadow-sm";
  const lbl = isDark
    ? "block text-xs font-semibold text-gray-400 mb-1"
    : "block text-xs font-semibold text-slate-700 mb-1";
  const cardClass = isDark
    ? "bg-[#181818] border border-white/8 text-white"
    : "bg-white border border-slate-200 text-slate-900 shadow-sm";
  const subcardClass = isDark
    ? "bg-[#1a1a1a] border border-white/8 text-white"
    : "bg-slate-50 border border-slate-200 text-slate-800";
  const frow = "grid grid-cols-1 sm:grid-cols-2 gap-4";
  const ach_cats = categories || ['Healthcare & Medicine', 'Education & Academia', 'Sports & Athletics', 'Arts & Culture', 'Business & Entrepreneurship', 'Environment & Conservation', 'Technology & Innovation', 'Public Service & Governance'];

  // ── Access Control Gate: Handled by AdminRoute, but keep as fallback ───────
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#161616] border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-5 shadow-glow-red">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Restricted Console
          </span>

          <h2 className="font-manrope font-extrabold text-2xl text-white mb-2">
            Admin Privileges Required
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
            The PeopleFirst management console is strictly restricted to platform administrators.
            Sign in with an admin account (email containing &quot;admin&quot;) to access this area.
          </p>

          {user ? (
            <div className="p-3.5 bg-[#1e1e1e] rounded-xl border border-white/10 mb-6 text-left">
              <div className="text-[11px] text-gray-400">Currently signed in as:</div>
              <div className="text-sm font-bold text-white truncate">{user.name} ({user.email})</div>
              <div className="text-[11px] text-yellow-400 font-semibold mt-0.5">Role: Standard Member — Admin access not granted</div>
            </div>
          ) : null}

          <div className="space-y-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Sign In as Administrator
            </button>

            {user ? (
              <Link
                to="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                Go to My User Dashboard
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal('register')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                Create New Account
              </button>
            )}

            <Link
              to="/"
              className="inline-block text-xs text-gray-500 hover:text-white pt-2 transition-colors"
            >
              ← Return to Public Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-200 ${isDark ? 'bg-[#0d0d0d] text-white' : 'bg-[#f4f6f8] text-slate-900'}`}>
      <AnimatePresence>{toast && <Toast message={toast} onDone={() => setToast('')} isDark={isDark} />}</AnimatePresence>
      <ConfirmModal open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={closeConfirm} isDark={isDark} />

      {/* ── ADMIN TOP NAVBAR ──────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl transition-colors border-b ${isDark ? 'bg-[#0f0f11]/90 border-white/10 shadow-2xl shadow-black/40' : 'bg-white/95 border-slate-200 shadow-md shadow-slate-200/50'
        }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6">

          {/* Top Row: Brand, Quick Actions, Stats, Profile & Logout */}
          <div className="flex items-center justify-between py-3 gap-3">

            {/* Left: Logo & Brand & Live Status */}
            <div className="flex items-center gap-3">
              <Link to="/admin" className="flex items-center gap-2.5 group">
                <div className="relative shrink-0">
                  <img
                    src={logo}
                    alt="PeopleFirst"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-red-500/40 group-hover:ring-red-500 shadow-glow transition-all"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#111] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-manrope font-black text-sm sm:text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      People<span className="text-red-500">First</span>
                    </span>
                    <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      Admin
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Control Console</span>
                    <span className="text-gray-600 hidden sm:inline">·</span>
                    <span className="text-red-400 font-semibold hidden sm:inline">Live Mode</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Center: Live Quick Metrics Chips (Hidden on small mobile) */}
            <div className="hidden lg:flex items-center gap-2">
              {[
                { label: 'Articles', val: newsList.length, color: 'text-red-500', bg: isDark ? 'bg-red-500/10' : 'bg-red-50' },
                { label: 'Achievers', val: achieversList.length, color: 'text-yellow-500', bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50' },
                { label: 'Awards', val: awardsList.length, color: 'text-purple-500', bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50' },
                { label: 'Users', val: usersList.length, color: 'text-green-500', bg: isDark ? 'bg-green-500/10' : 'bg-green-50' },
              ].map(k => (
                <div key={k.label} className={`${k.bg} border ${isDark ? 'border-white/8' : 'border-slate-200'} rounded-xl px-2.5 py-1 text-center min-w-[52px]`}>
                  <div className={`text-xs font-black ${k.color}`}>{k.val}</div>
                  <div className={`text-[8px] font-semibold uppercase ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Right: Quick Tools, Site Link, Theme, User Profile & Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* View Public Site */}
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${isDark
                  ? 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300'
                  }`}
                title="Open Public Website in new tab"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Public Site</span>
              </Link>

              {/* Play Intro Preview Button */}
              <button
                type="button"
                onClick={() => {
                  clearIntroSeenFlag();
                  window.dispatchEvent(new CustomEvent('play-intro-animation'));
                  showToast('🎬 Playing Cinematic Intro Screen...');
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${isDark
                  ? 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border-red-500/40 hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                  }`}
                title="Play Opening Screen Intro Animation"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span className="hidden sm:inline">Play Intro</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${isDark
                  ? 'bg-white/5 hover:bg-white/10 text-yellow-400 border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                <span className="hidden xl:inline">{isDark ? 'Light' : 'Dark'}</span>
              </button>

              {/* Admin User Info Pill */}
              <button
                type="button"
                onClick={() => setSecurityModalOpen(true)}
                className={`flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-xl border transition-all ${isDark
                  ? 'bg-[#181818] hover:bg-[#222] border-white/10 hover:border-red-500/40 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-red-400 text-slate-900'
                  }`}
                title="Manage Admin Password and Avatar"
              >
                <div className="relative">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt="Admin"
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-red-500 shrink-0"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-black" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className={`text-xs font-bold leading-tight max-w-[100px] truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {user?.name || 'Administrator'}
                  </div>
                  <div className="text-[9px] text-red-400 font-bold uppercase tracking-wider leading-none flex items-center gap-0.5">
                    <Key className="w-2.5 h-2.5" /> Security
                  </div>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/25 hover:border-red-500/40 transition-all active:scale-95"
                title="Sign Out of Admin Console"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Navigation Tabs */}
          <div className={`flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-2.5 border-t ${isDark ? 'border-white/5' : 'border-slate-200'
            }`}>
            <TabBtn active={tab === 'overview'} onClick={() => setTab('overview')} icon={BarChart3} label="Overview" isDark={isDark} />
            <TabBtn active={tab === 'news'} onClick={() => setTab('news')} icon={Newspaper} label="Articles" badge={newsList.length} isDark={isDark} />
            <TabBtn active={tab === 'achievers'} onClick={() => setTab('achievers')} icon={Award} label="Achievers" badge={achieversList.length} isDark={isDark} />
            <TabBtn active={tab === 'awards'} onClick={() => setTab('awards')} icon={Trophy} label="Awards" badge={awardsList.length} isDark={isDark} />
            <TabBtn active={tab === 'users'} onClick={() => setTab('users')} icon={Users} label="Users" badge={usersList.length} isDark={isDark} />
            <TabBtn active={tab === 'feedback'} onClick={() => setTab('feedback')} icon={MessageSquare} label="Feedback" badge={feedbackList.length} isDark={isDark} />
            <TabBtn active={tab === 'suggestions'} onClick={() => setTab('suggestions')} icon={Lightbulb} label="Suggestions" badge={suggestionsList.filter(s => s.status === 'pending').length} isDark={isDark} />
          </div>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 sm:pt-8">

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div className="space-y-5 sm:space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
              <StatCard icon={Newspaper} label="Total Articles" value={newsList.length} sub="Live on platform" color="text-red-500" bg={isDark ? "bg-red-500/10" : "bg-red-50"} isDark={isDark} />
              <StatCard icon={Award} label="Achievers" value={achieversList.length} sub="With 3D FlipBook" color="text-yellow-500" bg={isDark ? "bg-yellow-500/10" : "bg-yellow-50"} isDark={isDark} />
              <StatCard icon={Trophy} label="Awards" value={awardsList.length} sub="Winners & nominees" color="text-purple-500" bg={isDark ? "bg-purple-500/10" : "bg-purple-50"} isDark={isDark} />
              <StatCard icon={Users} label="Active Users" value={usersList.filter(u => u.status === 'active').length} sub={`${usersList.filter(u => u.status === 'suspended').length} suspended`} color="text-green-500" bg={isDark ? "bg-green-500/10" : "bg-green-50"} isDark={isDark} />
              <div className="col-span-2 sm:col-span-1">
                <StatCard icon={MessageSquare} label="Feedback" value={feedbackList.length} sub="Across achiever pages" color="text-blue-500" bg={isDark ? "bg-blue-500/10" : "bg-blue-50"} isDark={isDark} />
              </div>
            </div>

            <div className={`${isDark ? 'bg-gradient-to-r from-red-500/10 via-[#1a1a1a] to-[#1a1a1a] border-red-500/20' : 'bg-gradient-to-r from-red-50 via-white to-white border-red-200 shadow-sm'} border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
              <div>
                <h3 className={`font-bold flex items-center gap-2 text-base ${isDark ? 'text-white' : 'text-slate-900'}`}><Flame className="w-5 h-5 text-red-500 animate-pulse" />Quick Actions</h3>
                <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Publish content, manage users, or review feedback.</p>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <button onClick={() => { setTab('news'); setNewsFormOpen(true); setEditingNews(null); setNewsForm(blankNews()); }} className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"><PlusCircle className="w-4 h-4" />New Article</button>
                <button onClick={() => { setTab('achievers'); setAchFormOpen(true); setEditingAch(null); setAchForm(blankAchiever()); }} className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"><Award className="w-4 h-4" />Add Achiever</button>
                <button onClick={() => { setTab('awards'); setAwardFormOpen(true); setEditingAward(null); setAwardForm(blankAward()); }} className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"><Trophy className="w-4 h-4" />Add Award</button>
                <button onClick={() => setTab('feedback')} className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all border ${isDark ? 'bg-white/8 hover:bg-white/15 text-white border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'}`}><MessageSquare className="w-4 h-4" />Feedback</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              <div className={`lg:col-span-2 ${cardClass} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}><Clock className="w-4 h-4 text-red-500" />Recent Articles</h3>
                  <button onClick={() => setTab('news')} className="text-xs text-red-500 hover:text-red-400 font-semibold">View All →</button>
                </div>
                <div className="space-y-2">
                  {newsList.slice(0, 5).map(n => (
                    <div key={n.id} className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all group ${isDark ? 'bg-white/3 hover:bg-white/5' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <img src={n.image} className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl object-cover shrink-0" alt="" onError={e => e.target.style.display = 'none'} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs sm:text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{n.title}</div>
                        <div className={`text-[11px] sm:text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{n.category} · {n.date}</div>
                      </div>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => startEditNews(n)} className="p-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteNews(n.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                  {newsList.length === 0 && <p className={`text-center text-sm py-6 ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>No articles yet.</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className={`${cardClass} rounded-2xl p-5`}>
                  <h3 className={`font-bold flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}><BarChart3 className="w-4 h-4 text-red-500" />By Category</h3>
                  <div className="space-y-3">
                    {catBreakdown.map(([cat, count]) => (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1"><span className={`font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{cat}</span><span className={isDark ? 'text-gray-500' : 'text-slate-400'}>{count}</span></div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(count / maxCat) * 100}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
                        </div>
                      </div>
                    ))}
                    {catBreakdown.length === 0 && <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>No data yet</p>}
                  </div>
                </div>
                <div className={`${cardClass} rounded-2xl p-5`}>
                  <h3 className={`font-bold flex items-center gap-2 mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}><Activity className="w-4 h-4 text-green-500" />System Status</h3>
                  {[['Storage', 'localStorage', 'green'], ['Pagination', '16 per page', 'green'], ['FlipBook', 'Active', 'green'], ['Languages', 'SI / TA / EN', 'green']].map(([k, v]) => (
                    <div key={k} className={`flex items-center justify-between py-2 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{k}</span>
                      <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{v}</span></div>
                    </div>
                  ))}

                  {/* Intro Animation Toggle & Duration Settings */}
                  <div className={`p-3.5 rounded-xl border mt-2 space-y-3 ${isDark ? 'bg-white/3 border-white/8' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Screen Opening Intro</span>
                        </div>
                        <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          Theatrical cloth curtain on load
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleIntro(!introEnabled)}
                        title={introEnabled ? 'Click to disable intro animation' : 'Click to enable intro animation'}
                        className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${
                          introEnabled
                            ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                            : isDark ? 'bg-white/10' : 'bg-slate-200'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                          introEnabled ? 'left-5' : 'left-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Speed / Duration Selector */}
                    {introEnabled && (
                      <div className="pt-1">
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className={isDark ? 'text-gray-400' : 'text-slate-600'}>Animation Duration:</span>
                          <span className="font-bold text-yellow-400">{introDuration}s</span>
                        </div>
                        <select
                          value={introDuration}
                          onChange={(e) => handleDurationChange(e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                            isDark
                              ? 'bg-[#181818] border-white/10 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="2.5">⚡ Fast (2.5s) — Quick entrance</option>
                          <option value="3.5">🎬 Balanced (3.5s) — Smooth cinematic</option>
                          <option value="4.5">🌟 Slow & Theatrical (4.5s) — Default grand opening</option>
                          <option value="6.0">👑 Ultra Slow Velvet (6.0s) — Premium slow reveal</option>
                        </select>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          clearIntroSeenFlag();
                          window.dispatchEvent(new CustomEvent('play-intro-animation'));
                          showToast('🎬 Playing Theatrical Intro Screen...');
                        }}
                        className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                          isDark
                            ? 'bg-red-500/15 hover:bg-red-500/25 border-red-500/40 text-red-300 hover:text-white'
                            : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span>Play Intro Now</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          clearIntroSeenFlag();
                          showToast('Intro cookie reset! Will play on next home visit.');
                        }}
                        className={`py-1.5 px-2.5 text-[11px] font-semibold rounded-lg border transition-all ${
                          isDark
                            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                        title="Reset session so intro plays automatically on next visit"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ ARTICLES ══════════════════════════════════════════════════════ */}
        {tab === 'news' && (
          <div className="space-y-8">
            <div className={`${cardClass} rounded-2xl overflow-hidden`}>
              <button onClick={() => setNewsFormOpen(o => !o)} className={`w-full flex items-center justify-between px-5 py-4 transition-all ${isDark ? 'hover:bg-white/3' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${editingNews ? 'bg-yellow-500/15' : 'bg-red-500/15'}`}>
                    {editingNews ? <Edit3 className="w-4 h-4 text-yellow-500" /> : <PlusCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="text-left">
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{editingNews ? 'Edit Article' : 'Publish New Article'}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{editingNews ? 'Editing existing article' : 'Fill in details to publish'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingNews && <button onClick={e => { e.stopPropagation(); setEditingNews(null); setNewsForm(blankNews()); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isDark ? 'bg-white/8 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>Cancel Edit</button>}
                  {newsFormOpen ? <ChevronUp className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} /> : <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} />}
                </div>
              </button>

              {newsFormOpen && (
                <form onSubmit={handleNewsSubmit} className={`border-t p-5 space-y-5 ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
                  <div className={frow}>
                    <div className="sm:col-span-2"><label className={lbl}>Headline *</label><input className={inp} placeholder="Enter compelling headline..." value={newsForm.title} onChange={e => setNewsForm(p => ({ ...p, title: e.target.value }))} /></div>
                    <div><label className={lbl}>Category *</label><select className={inp} value={newsForm.category} onChange={e => setNewsForm(p => ({ ...p, category: e.target.value }))}>{newsCategories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}</select></div>
                    <div><label className={lbl}>Sub-Category</label><input className={inp} placeholder="e.g. Cricket, Science..." value={newsForm.subcategory} onChange={e => setNewsForm(p => ({ ...p, subcategory: e.target.value }))} /></div>
                    <div><label className={lbl}>Author / Desk</label><input className={inp} value={newsForm.author} onChange={e => setNewsForm(p => ({ ...p, author: e.target.value }))} /></div>
                    <div><label className={lbl}>Tags (comma-separated)</label><input className={inp} placeholder="Sri Lanka, Youth, Award..." value={newsForm.tags} onChange={e => setNewsForm(p => ({ ...p, tags: e.target.value }))} /></div>
                    <div><label className={lbl}>Publish Date</label><input type="date" className={inp} value={newsForm.date} onChange={e => setNewsForm(p => ({ ...p, date: e.target.value }))} /></div>
                    <div><label className={lbl}>Publish Time</label>
                      <div className="flex gap-2">
                        <input type="time" className={`${inp} flex-1`} value={newsForm.time} onChange={e => setNewsForm(p => ({ ...p, time: e.target.value }))} />
                        <button type="button" onClick={() => { const n = new Date(); setNewsForm(p => ({ ...p, date: n.toISOString().split('T')[0], time: n.toTimeString().slice(0, 5) })); showToast('Set to now'); }} className={`px-3 rounded-xl text-xs font-semibold whitespace-nowrap ${isDark ? 'bg-white/8 hover:bg-white/15 text-gray-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>Now</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Cover Image URL</label>
                    <input className={inp} placeholder="https://..." value={newsForm.image} onChange={e => setNewsForm(p => ({ ...p, image: e.target.value }))} />
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {SAMPLE_IMAGES.map(s => <button key={s.label} type="button" onClick={() => setNewsForm(p => ({ ...p, image: s.url }))} className={`text-[10px] px-2.5 py-1.5 rounded-lg font-semibold transition-all border ${newsForm.image === s.url ? 'bg-red-500/20 border-red-500/50 text-red-500 font-bold' : isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>{s.label}</button>)}
                    </div>
                    {newsForm.image && <img src={newsForm.image} className="mt-2 h-24 w-full object-cover rounded-xl opacity-90 border border-slate-300 dark:border-white/10" alt="" onError={e => e.target.style.display = 'none'} />}
                  </div>

                  <div><label className={lbl}>Summary / Lead *</label><textarea className={`${inp} resize-none`} rows={3} placeholder="2-3 sentence summary for news cards..." value={newsForm.summary} onChange={e => setNewsForm(p => ({ ...p, summary: e.target.value }))} /></div>
                  <div>
                    <label className={lbl}>Full Article Content</label>
                    <textarea className={`${inp} resize-y`} rows={8} placeholder="Write full article here..." value={newsForm.content} onChange={e => setNewsForm(p => ({ ...p, content: e.target.value }))} />
                    <div className={`flex items-center gap-3 mt-1.5 text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}><span>{wordCount} words</span><span>·</span><span>{newsForm.readTime}</span></div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setNewsForm(p => ({ ...p, featured: !p.featured }))} className={`w-10 h-5 rounded-full transition-all relative shrink-0 ${newsForm.featured ? 'bg-red-500' : 'bg-slate-300 dark:bg-white/15'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${newsForm.featured ? 'left-5' : 'left-0.5'}`} />
                    </button>
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>Featured story</span>
                  </div>

                  <div className={`flex gap-3 pt-2 border-t flex-wrap ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-all shadow-sm">
                      {editingNews ? <><Save className="w-4 h-4" />Update Article</> : <><Send className="w-4 h-4" />Publish Article</>}
                    </button>
                    <button type="button" onClick={() => setNewsPreview(p => !p)} className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm rounded-xl transition-all ${isDark ? 'bg-white/8 hover:bg-white/15 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
                      <Eye className="w-4 h-4" />{newsPreview ? 'Hide Preview' : 'Preview'}
                    </button>
                  </div>

                  {newsPreview && newsForm.title && (
                    <div className={`mt-4 border rounded-2xl overflow-hidden ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                      <div className="relative h-36 bg-gray-800">
                        {newsForm.image && <img src={newsForm.image} className="w-full h-full object-cover opacity-70" alt="" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80" />
                        <div className="absolute bottom-3 left-4 right-4">
                          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">{newsForm.category}</span>
                          <h3 className="text-white font-bold text-sm mt-1 line-clamp-2">{newsForm.title}</h3>
                        </div>
                      </div>
                      <div className={`p-4 ${isDark ? 'bg-[#111]' : 'bg-slate-50'}`}>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{newsForm.summary}</p>
                        <div className={`flex items-center gap-3 mt-3 text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}><span>{newsForm.author}</span>·<span>{newsForm.date}</span>·<span>{newsForm.readTime}</span></div>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Article List */}
            <div className={`${cardClass} rounded-2xl p-5`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}><FileText className="w-4 h-4 text-red-500" />All Articles ({filteredNews.length})</h3>
                <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      className={`${isDark ? 'bg-[#111] border-white/10 text-white placeholder-gray-600 focus:border-red-500/60' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500'} border rounded-xl pl-8 pr-3 py-2 text-xs w-full focus:outline-none`}
                      placeholder="Search articles..."
                      value={newsSearch}
                      onChange={e => setNewsSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className={`${isDark ? 'bg-[#111] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl px-3 py-2 text-xs focus:outline-none w-full sm:w-auto`}
                    value={newsCat}
                    onChange={e => setNewsCat(e.target.value)}
                  >
                    {newsCategories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                {filteredNews.map(n => (
                  <motion.div key={n.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${isDark ? 'bg-white/3 hover:bg-white/5' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <img src={n.image} className="w-11 h-11 rounded-xl object-cover shrink-0" alt="" onError={e => e.target.style.display = 'none'} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold truncate max-w-[200px] sm:max-w-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{n.title}</span>
                        {n.featured && <span className="text-[10px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-bold shrink-0">FEATURED</span>}
                      </div>
                      <div className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{n.category} · {n.date} {n.time || ''} · {n.author?.replace('PeopleFirst ', '')}</div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <a href={`/news/${n.id}`} target="_blank" rel="noreferrer" className={`p-2 rounded-lg transition-all ${isDark ? 'bg-white/5 hover:bg-white/15 text-gray-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'}`}><ExternalLink className="w-3.5 h-3.5" /></a>
                      <button onClick={() => startEditNews(n)} className="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteNews(n.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </motion.div>
                ))}
                {filteredNews.length === 0 && <div className={`text-center py-12 ${isDark ? 'text-gray-600' : 'text-slate-400'}`}><FileText className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">No articles found.</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* ══ ACHIEVERS ═════════════════════════════════════════════════════ */}
        {tab === 'achievers' && (
          <div className="space-y-8">
            <div className={`${cardClass} rounded-2xl overflow-hidden`}>
              <button onClick={() => setAchFormOpen(o => !o)} className={`w-full flex items-center justify-between px-5 py-4 transition-all ${isDark ? 'hover:bg-white/3' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${editingAch ? 'bg-yellow-500/15' : 'bg-yellow-500/10'}`}>
                    {editingAch ? <Edit3 className="w-4 h-4 text-yellow-500" /> : <PlusCircle className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="text-left">
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{editingAch ? 'Edit Achiever Profile' : 'Add New Achiever'}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Fill in biography, chapters, achievements</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingAch && <button onClick={e => { e.stopPropagation(); setEditingAch(null); setAchForm(blankAchiever()); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isDark ? 'bg-white/8 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>Cancel Edit</button>}
                  {achFormOpen ? <ChevronUp className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} /> : <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} />}
                </div>
              </button>

              {achFormOpen && (
                <form onSubmit={handleAchSubmit} className={`border-t p-5 space-y-5 ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
                  <div className={frow}>
                    <div><label className={lbl}>Full Name *</label><input className={inp} placeholder="Dr. Full Name" value={achForm.name} onChange={e => setAchForm(p => ({ ...p, name: e.target.value }))} /></div>
                    <div><label className={lbl}>Headline / Title *</label><input className={inp} placeholder="Pioneer of..." value={achForm.title} onChange={e => setAchForm(p => ({ ...p, title: e.target.value }))} /></div>
                    <div><label className={lbl}>Category</label><select className={inp} value={achForm.category} onChange={e => setAchForm(p => ({ ...p, category: e.target.value }))}>{ach_cats.map(c => <option key={c}>{c}</option>)}</select></div>
                    <div><label className={lbl}>District / Location</label><input className={inp} placeholder="Colombo District" value={achForm.location} onChange={e => setAchForm(p => ({ ...p, location: e.target.value }))} /></div>
                    <div><label className={lbl}>Recognition Year</label><input className={inp} placeholder="2026" value={achForm.year} onChange={e => setAchForm(p => ({ ...p, year: e.target.value }))} /></div>
                    <div><label className={lbl}>YouTube Video Link or ID</label><input className={inp} placeholder="https://youtube.com/watch?v=... or Video ID" value={achForm.videoId} onChange={e => setAchForm(p => ({ ...p, videoId: extractYouTubeId(e.target.value) }))} /></div>
                    <div className="sm:col-span-2">
                      <label className={lbl}>Profile Photo URL</label>
                      <input className={inp} placeholder="https://..." value={achForm.thumbnail} onChange={e => setAchForm(p => ({ ...p, thumbnail: e.target.value }))} />
                      {achForm.thumbnail && <img src={achForm.thumbnail} className="mt-2 w-14 h-14 rounded-full object-cover border border-slate-300 dark:border-white/10" alt="" onError={e => e.target.style.display = 'none'} />}
                    </div>
                  </div>

                  <div><label className={lbl}>Short Biography</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Brief intro..." value={achForm.bio} onChange={e => setAchForm(p => ({ ...p, bio: e.target.value }))} /></div>
                  <div><label className={lbl}>Achievements (one per line)</label><textarea className={`${inp} resize-none`} rows={4} placeholder={"National Award 2026\nCommunity Pioneer"} value={achForm.achievementsText} onChange={e => setAchForm(p => ({ ...p, achievementsText: e.target.value }))} /></div>

                  {/* Interview Video Series Episodes */}
                  <div className="pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <label className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <Tv className="w-4 h-4 text-red-500" />
                          Recorded Interview Video Series (Multi-Part Episodes)
                        </label>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          Upload and list multiple interview video episodes strictly for this achiever (e.g. Part 1, Part 2, Part 3)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addEpisode}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-600/15 hover:bg-red-600/25 text-red-500 font-bold rounded-lg transition-all self-start sm:self-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Video Part
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(achForm.interviewSeries || []).map((ep, idx) => (
                        <div key={ep.id || idx} className={`${subcardClass} rounded-xl p-4 space-y-3 border`}>
                          <div className="flex items-center justify-between gap-2 border-b pb-2.5 border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-500">
                                Part {ep.episode || idx + 1}
                              </span>
                              <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Episode #{idx + 1}
                              </span>
                            </div>
                            {(achForm.interviewSeries || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEpisode(idx)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-500 transition-colors"
                                title="Remove episode"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <div className="sm:col-span-8">
                              <label className={lbl}>Episode Title *</label>
                              <input
                                className={inp}
                                placeholder="Part 1: Keynote & Foundational Journey..."
                                value={ep.title || ''}
                                onChange={(e) => setEpisodeField(idx, 'title', e.target.value)}
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <label className={lbl}>Duration (e.g. 21:30)</label>
                              <input
                                className={inp}
                                placeholder="18:45"
                                value={ep.duration || ''}
                                onChange={(e) => setEpisodeField(idx, 'duration', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <div className="sm:col-span-8">
                              <label className={lbl}>YouTube Video Link or ID *</label>
                              <input
                                className={inp}
                                placeholder="https://youtube.com/watch?v=... or Video ID"
                                value={ep.videoId || ''}
                                onChange={(e) => setEpisodeField(idx, 'videoId', e.target.value)}
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <label className={lbl}>Air / Release Date</label>
                              <input
                                type="date"
                                className={inp}
                                value={ep.date || ''}
                                onChange={(e) => setEpisodeField(idx, 'date', e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={lbl}>Episode Summary / Description</label>
                            <textarea
                              rows={2}
                              className={`${inp} resize-none`}
                              placeholder="Brief highlights or topics covered in this specific interview episode..."
                              value={ep.description || ''}
                              onChange={(e) => setEpisodeField(idx, 'description', e.target.value)}
                            />
                          </div>

                          {ep.videoId && (
                            <div className="flex items-center gap-3 pt-1 text-xs text-text-muted">
                              <img
                                src={`https://img.youtube.com/vi/${extractYouTubeId(ep.videoId)}/mqdefault.jpg`}
                                alt=""
                                className="w-20 h-12 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                              <div>
                                <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>YouTube ID: {extractYouTubeId(ep.videoId)}</span>
                                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Live video stream configured</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}><BookOpen className="w-4 h-4 text-yellow-500" />FlipBook Chapters</label>
                      <button type="button" onClick={addPage} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-600 dark:text-yellow-400 rounded-lg font-semibold"><Plus className="w-3.5 h-3.5" />Add Chapter</button>
                    </div>
                    <div className="space-y-3">
                      {achForm.pages.map((pg, i) => (
                        <div key={i} className={`${subcardClass} rounded-xl p-4 space-y-3`}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs font-mono shrink-0">Ch.{i + 1}</span>
                            <input className={`${inp} w-16 shrink-0`} placeholder="🏆" value={pg.icon} onChange={e => setPageField(i, 'icon', e.target.value)} />
                            <input className={`${inp} flex-1`} placeholder="Chapter title..." value={pg.title} onChange={e => setPageField(i, 'title', e.target.value)} />
                            {achForm.pages.length > 1 && <button type="button" onClick={() => removePage(i)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-500 shrink-0"><X className="w-3.5 h-3.5" /></button>}
                          </div>
                          <textarea className={`${inp} resize-none`} rows={3} placeholder="Chapter content..." value={pg.text} onChange={e => setPageField(i, 'text', e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-6 flex-wrap">
                    {[['featured', 'Featured Profile'], ['verified', 'Verified Badge']].map(([k, l]) => (
                      <div key={k} className="flex items-center gap-2.5">
                        <button type="button" onClick={() => setAchForm(p => ({ ...p, [k]: !p[k] }))} className={`w-10 h-5 rounded-full transition-all relative shrink-0 ${achForm[k] ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-white/15'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${achForm[k] ? 'left-5' : 'left-0.5'}`} />
                        </button>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{l}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`flex gap-3 pt-2 border-t ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-sm">
                      {editingAch ? <><Save className="w-4 h-4" />Update Achiever</> : <><Award className="w-4 h-4" />Publish Achiever</>}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Achievers List */}
            <div className={`${cardClass} rounded-2xl p-4 sm:p-5`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}><Award className="w-4 h-4 text-yellow-500" />All Achievers ({filteredAch.length})</h3>
                <div className="relative w-full sm:w-auto"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input className={`${isDark ? 'bg-[#111] border-white/10 text-white placeholder-gray-600 focus:border-yellow-500/60' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-yellow-500'} border rounded-xl pl-8 pr-3 py-2 text-xs w-full sm:w-48 focus:outline-none`} placeholder="Search achievers..." value={achSearch} onChange={e => setAchSearch(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAch.map(a => (
                  <motion.div key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl transition-all group border ${isDark ? 'bg-white/3 hover:bg-white/5 border-white/5' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                    <img src={a.thumbnail} className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shrink-0" alt="" onError={e => e.target.style.display = 'none'} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs sm:text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{a.name}</span>
                        {a.verified && <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
                        {a.featured && <span className="text-[9px] sm:text-[10px] bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded font-bold">FEATURED</span>}
                      </div>
                      <div className={`text-xs truncate mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{a.title}</div>
                      <div className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{a.category} · {a.location} · {a.year}</div>
                    </div>
                    <div className="flex gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <a href={`/achiever/${a.id}`} target="_blank" rel="noreferrer" className={`p-1.5 rounded-lg transition-all ${isDark ? 'bg-white/5 hover:bg-white/15 text-gray-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'}`} title="Open Page"><ExternalLink className="w-3.5 h-3.5" /></a>
                      <button onClick={() => startEditAch(a)} className="p-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteAch(a.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </motion.div>
                ))}
                {filteredAch.length === 0 && <div className={`col-span-2 text-center py-12 ${isDark ? 'text-gray-600' : 'text-slate-400'}`}><Award className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">No achievers found.</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* ══ AWARDS ════════════════════════════════════════════════════════ */}
        {tab === 'awards' && (
          <div className="space-y-6 sm:space-y-8">
            {/* ── VOTING DURATION & AUTOMATIC WINNER ASSIGNMENT PANEL ── */}
            <div className={`${cardClass} rounded-2xl p-5 sm:p-6 border-2 ${isDark ? 'border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-[#181818] to-[#181818]' : 'border-yellow-400/40 bg-gradient-to-r from-yellow-50 via-white to-white'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-surface-border/60">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Voting Duration & Winner Assignment
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${votingConfig.isActive && new Date(votingConfig.deadline).getTime() > Date.now()
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                      {votingConfig.isActive && new Date(votingConfig.deadline).getTime() > Date.now() ? '🟢 Voting Active' : '🔴 Voting Concluded'}
                    </span>
                  </div>
                  <h3 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Configure Award Voting Deadline & Auto-Publish Winners
                  </h3>
                  <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Admin can assign the voting time duration. When this deadline expires, the system automatically checks every category and declares the nominee with the most votes as the official Winner.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleEndVotingNow}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Conclude & Declare Winners Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetVotingSeason}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                      }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Start New Season (7 Days)</span>
                  </button>
                </div>
              </div>

              {/* Deadline Setting Controls */}
              <div className="pt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <form onSubmit={handleUpdateVotingDeadline} className="md:col-span-7 flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                  <div className="flex-1">
                    <label className={lbl}>Assign Voting Closing Time (Date & Time) *</label>
                    <input
                      type="datetime-local"
                      className={inp}
                      value={votingDeadlineInput}
                      onChange={(e) => setVotingDeadlineInput(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 shadow-sm"
                  >
                    Set Deadline
                  </button>
                </form>

                {/* Quick Extend Buttons */}
                <div className="md:col-span-5">
                  <label className={lbl}>Quick Extend Voting Duration:</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { label: '+1 Hour', hours: 1 },
                      { label: '+1 Day', hours: 24 },
                      { label: '+3 Days', hours: 72 },
                      { label: '+7 Days', hours: 168 },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handleExtendVoting(btn.hours)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${isDark
                          ? 'bg-white/5 hover:bg-white/10 text-yellow-400 border-white/10'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                          }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Leaders Preview Bar */}
              <div className="mt-5 pt-4 border-t border-surface-border/60">
                <div className="text-xs font-bold mb-2 flex items-center justify-between">
                  <span className={isDark ? 'text-gray-300' : 'text-slate-700'}>Current Category Front-Runners (Projected Winners):</span>
                  <span className="text-[11px] text-yellow-500 font-mono">1 vote per citizen</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
                  {awardCategoriesList.filter(c => c !== 'All').map(cat => {
                    const inCat = awardsList.filter(a => a.category === cat);
                    const leader = [...inCat].sort((a, b) => (b.votes || 0) - (a.votes || 0))[0];
                    return (
                      <div key={cat} className={`p-2 rounded-xl border text-[11px] ${isDark ? 'bg-white/3 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="font-bold text-yellow-500 truncate">{cat}</div>
                        <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{leader ? leader.nominee : 'No candidates'}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{leader ? `${(leader.votes || 0).toLocaleString()} votes` : '0 votes'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Manage Award Categories Card */}
            <div className={`${cardClass} rounded-2xl p-4 sm:p-5`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Manage Award Categories ({awardCategoriesList.filter(c => c !== 'All').length})
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      Add new categories or manage existing balloting categories. Every category supports multiple awards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add New Category Form */}
              <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-4">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className={`${inp} pl-9`}
                    placeholder="Enter new category name (e.g. Science & Innovation, Youth Leadership...)"
                    value={newCatInput}
                    onChange={(e) => {
                      setNewCatInput(e.target.value);
                      if (categoryMsg) setCategoryMsg('');
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </form>

              {categoryMsg && (
                <div className="mb-3 text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{categoryMsg}</span>
                </div>
              )}

              {/* Category Badges Grid */}
              <div className="flex flex-wrap gap-2 pt-1">
                {awardCategoriesList.filter(c => c !== 'All').map((cat) => {
                  const count = awardsList.filter(a => a.category?.toLowerCase() === cat.toLowerCase()).length;
                  return (
                    <div
                      key={cat}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${isDark ? 'bg-white/4 border-white/10 text-gray-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                    >
                      <span>{cat}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${count >= 2
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        }`}>
                        {count} award{count === 1 ? '' : 's'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        title={`Delete ${cat} category`}
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${isDark ? 'hover:bg-rose-500/20 text-gray-400 hover:text-rose-400' : 'hover:bg-rose-100 text-slate-400 hover:text-rose-600'
                          }`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Awards Form */}
            <div className={`${cardClass} rounded-2xl overflow-hidden`}>
              <button onClick={() => setAwardFormOpen(o => !o)} className={`w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 transition-all ${isDark ? 'hover:bg-white/3' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${editingAward ? 'bg-yellow-500/15' : 'bg-purple-500/15'}`}>
                    {editingAward ? <Edit3 className="w-4 h-4 text-yellow-500" /> : <PlusCircle className="w-4 h-4 text-purple-500" />}
                  </div>
                  <div className="text-left">
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{editingAward ? 'Edit Award' : 'Add New Award'}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{editingAward ? 'Editing existing award' : 'Create a winner or nominee entry'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingAward && <button onClick={e => { e.stopPropagation(); setEditingAward(null); setAwardForm(blankAward()); }} className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold ${isDark ? 'bg-white/8 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>}
                  {awardFormOpen ? <ChevronUp className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} /> : <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-500'}`} />}
                </div>
              </button>

              {awardFormOpen && (
                <form onSubmit={handleAwardSubmit} className={`border-t p-4 sm:p-5 space-y-4 sm:space-y-5 ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
                  <div className={frow}>
                    <div className="sm:col-span-2"><label className={lbl}>Award Title *</label><input className={inp} placeholder="National Excellence Award 2026" value={awardForm.title} onChange={e => setAwardForm(p => ({ ...p, title: e.target.value }))} /></div>
                    <div><label className={lbl}>Nominee Name *</label><input className={inp} placeholder="Dr. Full Name" value={awardForm.nominee} onChange={e => setAwardForm(p => ({ ...p, nominee: e.target.value }))} /></div>
                    <div><label className={lbl}>Achiever Profile ID</label><input className={inp} placeholder="Link to achiever (optional)" value={awardForm.nomineeId} onChange={e => setAwardForm(p => ({ ...p, nomineeId: e.target.value }))} /></div>
                    <div><label className={lbl}>Category</label><select className={inp} value={awardForm.category} onChange={e => setAwardForm(p => ({ ...p, category: e.target.value }))}>{awardCategoriesList.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}</select></div>
                    <div><label className={lbl}>Status</label>
                      <div className="flex gap-2 mt-1">
                        {['Winner', 'Nominee'].map(s => (
                          <button key={s} type="button" onClick={() => setAwardForm(p => ({ ...p, status: s }))} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${awardForm.status === s ? (s === 'Winner' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-600 dark:text-yellow-300' : 'bg-purple-500/20 border-purple-500/40 text-purple-600 dark:text-purple-300') : isDark ? 'bg-white/3 border-white/10 text-gray-500 hover:bg-white/8' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'}`}>{s === 'Winner' ? '🏆 Winner' : '⭐ Nominee'}</button>
                        ))}
                      </div>
                    </div>
                    <div><label className={lbl}>Year</label><input type="number" className={inp} placeholder="2026" value={awardForm.year} onChange={e => setAwardForm(p => ({ ...p, year: e.target.value }))} /></div>
                    <div><label className={lbl}>Presenter / Organisation</label><input className={inp} placeholder="His Excellency the President..." value={awardForm.presenter} onChange={e => setAwardForm(p => ({ ...p, presenter: e.target.value }))} /></div>
                    <div><label className={lbl}>Community Votes</label><input type="number" className={inp} placeholder="0" value={awardForm.votes} onChange={e => setAwardForm(p => ({ ...p, votes: e.target.value }))} /></div>
                  </div>

                  <div>
                    <label className={lbl}>Award Icon</label>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {AWARD_ICONS.map(ic => (
                        <button key={ic} type="button" onClick={() => setAwardForm(p => ({ ...p, icon: ic }))} className={`text-lg sm:text-xl w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all border ${awardForm.icon === ic ? 'bg-purple-500/20 border-purple-500/40' : isDark ? 'bg-white/3 border-white/8 hover:bg-white/8' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}>{ic}</button>
                      ))}
                      <input className={`${inp} w-16 sm:w-20 text-center text-lg sm:text-xl`} maxLength={2} value={awardForm.icon} onChange={e => setAwardForm(p => ({ ...p, icon: e.target.value }))} placeholder="🏆" />
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Nominee Photo URL</label>
                    <input className={inp} placeholder="https://..." value={awardForm.thumbnail} onChange={e => setAwardForm(p => ({ ...p, thumbnail: e.target.value }))} />
                    {awardForm.thumbnail && <img src={awardForm.thumbnail} className="mt-2 w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-slate-300 dark:border-white/10" alt="" onError={e => e.target.style.display = 'none'} />}
                  </div>

                  <div><label className={lbl}>Description</label><textarea className={`${inp} resize-none`} rows={3} placeholder="Brief description of the award..." value={awardForm.description} onChange={e => setAwardForm(p => ({ ...p, description: e.target.value }))} /></div>

                  <div className={`flex gap-3 pt-2 border-t ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition-all shadow-sm">
                      {editingAward ? <><Save className="w-4 h-4" />Update Award</> : <><Trophy className="w-4 h-4" />Publish Award</>}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Awards List */}
            <div className={`${cardClass} rounded-2xl p-4 sm:p-5`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
                <h3 className={`font-bold flex items-center gap-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}><Trophy className="w-4 h-4 text-purple-500" />All Awards ({filteredAwards.length})</h3>
                <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input className={`w-full ${isDark ? 'bg-[#111] border-white/10 text-white placeholder-gray-600 focus:border-purple-500/60' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'} border rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none`} placeholder="Search awards..." value={awardSearch} onChange={e => setAwardSearch(e.target.value)} /></div>
                  <select className={`${isDark ? 'bg-[#111] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-xl px-3 py-2 text-xs focus:outline-none`} value={awardCatFilter} onChange={e => setAwardCatFilter(e.target.value)}>{awardCategoriesList.map(c => <option key={c}>{c}</option>)}</select>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
                {[{ label: 'Winners', val: awardsList.filter(a => a.status === 'Winner').length, color: 'text-yellow-500' }, { label: 'Nominees', val: awardsList.filter(a => a.status === 'Nominee').length, color: 'text-purple-500' }, { label: 'Total', val: awardsList.length, color: isDark ? 'text-white' : 'text-slate-900' }].map(s => (
                  <div key={s.label} className={`${subcardClass} rounded-xl p-2.5 sm:p-3 text-center`}>
                    <div className={`text-base sm:text-xl font-black ${s.color}`}>{s.val}</div>
                    <div className={`text-[9px] sm:text-[10px] font-semibold ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {filteredAwards.map(a => (
                  <motion.div key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all group ${isDark ? 'bg-white/3 hover:bg-white/5' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className={`text-xs sm:text-sm font-semibold truncate max-w-[150px] sm:max-w-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{a.title}</span>
                        <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${a.status === 'Winner' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300' : 'bg-purple-500/20 text-purple-600 dark:text-purple-300'}`}>{a.status}</span>
                      </div>
                      <div className={`text-[11px] sm:text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{a.nominee} · {a.category} · {a.year}</div>
                    </div>
                    {a.thumbnail && <img src={a.thumbnail} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-300 dark:border-white/10 shrink-0 hidden sm:block" alt="" onError={e => e.target.style.display = 'none'} />}
                    <div className="flex gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEditAward(a)} className="p-1.5 sm:p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 transition-all" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteAward(a.id)} className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-500 transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </motion.div>
                ))}
                {filteredAwards.length === 0 && <div className={`text-center py-12 ${isDark ? 'text-gray-600' : 'text-slate-400'}`}><Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">No awards found.</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* ══ USERS ═════════════════════════════════════════════════════════ */}
        {tab === 'users' && (
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div><h2 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}><Users className="w-5 h-5 text-green-500" />User Management</h2><p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Suspend, edit, or remove registered accounts</p></div>
              <button onClick={() => setUsersList(getAllUsers())} className={`flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all border ${isDark ? 'bg-white/8 hover:bg-white/15 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'} self-start sm:self-auto`}><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input className={`w-full ${isDark ? 'bg-[#1a1a1a] border-white/10 text-white placeholder-gray-600 focus:border-green-500/50' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'} border rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none`} placeholder="Search by name, email, district..." value={userSearch} onChange={e => setUserSearch(e.target.value)} /></div>
              <select className={`${isDark ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'} border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none`} value={userStatusFilter} onChange={e => setUserStatusFilter(e.target.value)}><option value="all">All Status</option><option value="active">Active</option><option value="suspended">Suspended</option></select>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {[{ label: 'Active', val: usersList.filter(u => u.status === 'active').length, color: 'text-green-500' }, { label: 'Suspended', val: usersList.filter(u => u.status === 'suspended').length, color: 'text-red-500' }, { label: 'Total', val: usersList.length, color: isDark ? 'text-white' : 'text-slate-900' }].map(s => (
                <div key={s.label} className={`${cardClass} rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center`}>
                  <div className={`text-lg sm:text-2xl font-black ${s.color}`}>{s.val}</div>
                  <div className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredUsers.map(u => (
                <motion.div key={u.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${cardClass} rounded-2xl p-3.5 sm:p-4`}>
                  {editingUser?.id === u.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-1"><img src={u.avatar} className="w-8 h-8 rounded-full object-cover" alt="" /><span className={`text-xs sm:text-sm font-bold flex-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Editing User</span><button onClick={() => setEditingUser(null)} className={`p-1 rounded-lg ${isDark ? 'bg-white/8 text-gray-400' : 'bg-slate-100 text-slate-600'}`}><X className="w-3.5 h-3.5" /></button></div>
                      <input className={`${inp} text-xs sm:text-sm`} placeholder="Name" value={editingUser.name} onChange={e => setEditingUser(p => ({ ...p, name: e.target.value }))} />
                      <input className={`${inp} text-xs sm:text-sm`} placeholder="Email" value={editingUser.email} onChange={e => setEditingUser(p => ({ ...p, email: e.target.value }))} />
                      <input className={`${inp} text-xs sm:text-sm`} placeholder="District" value={editingUser.district} onChange={e => setEditingUser(p => ({ ...p, district: e.target.value }))} />
                      <button onClick={() => handleSaveUser(editingUser)} className="w-full py-2 bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"><Save className="w-3.5 h-3.5" />Save</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <img src={u.avatar} className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover shrink-0" alt={u.name} onError={e => e.target.style.display = 'none'} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap"><span className={`text-xs sm:text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{u.name}</span><span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${u.status === 'active' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-red-500/15 text-red-600 dark:text-red-400'}`}>{u.status}</span></div>
                          <div className={`text-[11px] sm:text-xs truncate ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{u.email}</div>
                          <div className={`text-[10px] sm:text-[11px] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{u.district} · {u.joined}</div>
                        </div>
                      </div>
                      <div className={`flex gap-1.5 sm:gap-2 mt-3.5 sm:mt-4 border-t pt-2.5 sm:pt-3 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                        <button onClick={() => handleToggleUser(u.id)} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex-1 justify-center ${u.status === 'active' ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500' : 'bg-green-500/10 hover:bg-green-500/20 text-green-600'}`}>
                          {u.status === 'active' ? <><Ban className="w-3.5 h-3.5" />Suspend</> : <><UserCheck className="w-3.5 h-3.5" />Activate</>}
                        </button>
                        <button onClick={() => setEditingUser({ ...u })} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`} title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteUser(u.id)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold bg-red-500/10 hover:bg-red-500/25 text-red-500 transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              {filteredUsers.length === 0 && <div className={`col-span-3 text-center py-16 ${isDark ? 'text-gray-600' : 'text-slate-400'}`}><Users className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">No users found.</p></div>}
            </div>
          </div>
        )}

        {/* ══ FEEDBACK ══════════════════════════════════════════════════════ */}
        {tab === 'feedback' && (
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div><h2 className={`font-bold text-lg sm:text-xl flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}><MessageSquare className="w-5 h-5 text-blue-500" />User Feedback</h2><p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Manage comments from all achiever pages</p></div>
              <button onClick={() => setFeedbackList(getAllFeedback())} className={`flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all border ${isDark ? 'bg-white/8 hover:bg-white/15 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'} self-start sm:self-auto`}><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input className={`w-full ${isDark ? 'bg-[#1a1a1a] border-white/10 text-white placeholder-gray-600 focus:border-blue-500/50' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'} border rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none`} placeholder="Search feedback..." value={fbSearch} onChange={e => setFbSearch(e.target.value)} /></div>
              <select className={`${isDark ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'} border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none`} value={fbStatusFilter} onChange={e => setFbStatusFilter(e.target.value)}><option value="all">All Status</option><option value="pending">Pending</option><option value="reviewed">Reviewed</option><option value="featured">Featured</option><option value="flagged">Flagged</option></select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {[{ label: 'Total', val: feedbackList.length, color: isDark ? 'text-white' : 'text-slate-900' }, { label: 'Pending', val: feedbackList.filter(f => !f.status || f.status === 'pending').length, color: 'text-yellow-500' }, { label: 'Reviewed', val: feedbackList.filter(f => f.status === 'reviewed').length, color: 'text-green-500' }, { label: 'Flagged', val: feedbackList.filter(f => f.status === 'flagged').length, color: 'text-red-500' }].map(s => (
                <div key={s.label} className={`${cardClass} rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center`}>
                  <div className={`text-lg sm:text-xl font-black ${s.color}`}>{s.val}</div>
                  <div className={`text-[10px] sm:text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{s.label}</div>
                </div>
              ))}
            </div>

            {filteredFeedback.length === 0 ? (
              <div className={`${cardClass} rounded-2xl p-10 sm:p-16 text-center ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">No feedback yet.</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-700' : 'text-slate-400'}`}>Comments appear when users engage with achiever pages.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFeedback.map(f => (
                  <motion.div key={`${f.achieverId}-${f.id}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${cardClass} rounded-2xl p-3.5 sm:p-5`}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-black shrink-0">{(f.author || 'A').slice(0, 1).toUpperCase()}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.author || 'Anonymous'}</span>
                            {f.email && <span className={`text-[10px] sm:text-[11px] ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{f.email}</span>}
                            <span className={`text-[9px] sm:text-[10px] px-2 py-0.2 rounded-full font-bold shrink-0 ${f.status === 'reviewed' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : f.status === 'featured' ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400' : f.status === 'flagged' ? 'bg-red-500/15 text-red-600 dark:text-red-400' : isDark ? 'bg-white/8 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>{f.status || 'pending'}</span>
                          </div>
                          <div className={`text-[10px] sm:text-[11px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Achiever #{f.achieverId} · {f.date ? new Date(f.date).toLocaleDateString('en-GB') : 'No date'}</div>
                          <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{f.text}</p>
                          {f.rating && <div className="flex gap-0.5 mt-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />)}</div>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:flex gap-1.5 sm:gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/5">
                        <button onClick={() => handleFlagFeedback(f.achieverId, f.id, 'reviewed')} className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 text-[11px] sm:text-xs font-semibold transition-all"><CheckCircle2 className="w-3.5 h-3.5" />Reviewed</button>
                        <button onClick={() => handleFlagFeedback(f.achieverId, f.id, 'featured')} className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[11px] sm:text-xs font-semibold transition-all"><Star className="w-3.5 h-3.5" />Feature</button>
                        <button onClick={() => handleFlagFeedback(f.achieverId, f.id, 'flagged')} className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-[11px] sm:text-xs font-semibold transition-all"><Flag className="w-3.5 h-3.5" />Flag</button>
                        <button onClick={() => handleDeleteFeedback(f.achieverId, f.id)} className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-500 text-[11px] sm:text-xs font-semibold transition-all"><Trash2 className="w-3.5 h-3.5" />Delete</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ SUGGESTIONS REVIEW ════════════════════════════════════════════ */}
        {tab === 'suggestions' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className={`font-manrope font-black text-xl sm:text-2xl flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Lightbulb className="w-6 h-6 text-amber-500" /> Achiever Nominations & Suggestions
                </h2>
                <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  Review community nominations, verify uploaded PDF documents & district details, and approve to introduce new achievers.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className={`w-full ${isDark ? 'bg-[#1a1a1a] border-white/10 text-white placeholder-gray-600 focus:border-amber-500/50' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'} border rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none`}
                  placeholder="Search by nominee name, submitter, district, or category..."
                  value={suggSearch}
                  onChange={e => setSuggSearch(e.target.value)}
                />
              </div>
              <select
                className={`${isDark ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'} border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none`}
                value={suggStatusFilter}
                onChange={e => setSuggStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {[
                { label: 'Total Suggestions', val: suggestionsList.length, color: isDark ? 'text-white' : 'text-slate-900' },
                { label: 'Pending Review', val: suggestionsList.filter(s => s.status === 'pending').length, color: 'text-amber-500' },
                { label: 'Approved', val: suggestionsList.filter(s => s.status === 'approved').length, color: 'text-emerald-500' },
                { label: 'Rejected', val: suggestionsList.filter(s => s.status === 'rejected').length, color: 'text-red-500' }
              ].map(s => (
                <div key={s.label} className={`${cardClass} rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center`}>
                  <div className={`text-lg sm:text-xl font-black ${s.color}`}>{s.val}</div>
                  <div className={`text-[10px] sm:text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{s.label}</div>
                </div>
              ))}
            </div>

            {suggestionsList.filter(s => {
              const q = suggSearch.toLowerCase();
              const matchQ = !q || s.name?.toLowerCase().includes(q) || s.submittedBy?.toLowerCase().includes(q) || s.district?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q);
              const matchSt = suggStatusFilter === 'all' || s.status === suggStatusFilter;
              return matchQ && matchSt;
            }).length === 0 ? (
              <div className={`${cardClass} rounded-2xl p-10 sm:p-16 text-center ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>
                <Lightbulb className="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-500" />
                <p className="text-sm font-semibold">No suggestions found.</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-700' : 'text-slate-400'}`}>
                  When users submit nominations from their dashboard or the Achievers page, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestionsList
                  .filter(s => {
                    const q = suggSearch.toLowerCase();
                    const matchQ = !q || s.name?.toLowerCase().includes(q) || s.submittedBy?.toLowerCase().includes(q) || s.district?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q);
                    const matchSt = suggStatusFilter === 'all' || s.status === suggStatusFilter;
                    return matchQ && matchSt;
                  })
                  .map(s => (
                    <motion.div key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${cardClass} rounded-2xl p-4 sm:p-5 relative overflow-hidden border-l-4 ${s.status === 'approved' ? 'border-l-emerald-500' : s.status === 'rejected' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
                      <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex gap-4 items-start flex-1 min-w-0">
                          {s.image ? (
                            <img src={s.image} alt={s.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover ring-1 ring-white/10 shrink-0" />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black text-xl shrink-0">
                              {(s.name || 'A').charAt(0)}
                            </div>
                          )}

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-black text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.name}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${s.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : s.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                {s.status}
                              </span>
                              <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                                {s.category || 'General'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                              {s.district && (
                                <span className="flex items-center gap-1 text-amber-400/90 font-medium">
                                  <Building2 className="w-3.5 h-3.5" /> District: {s.district}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" /> Submitted by: <strong className="text-gray-300">{s.submittedBy}</strong> ({s.userEmail || 'N/A'})
                              </span>
                              <span>Date: {s.date ? new Date(s.date).toLocaleDateString('en-GB') : 'Recently'}</span>
                            </div>

                            {s.achievements && (
                              <div className={`p-2.5 rounded-xl text-xs sm:text-sm mt-2 ${isDark ? 'bg-white/5 border border-white/5 text-gray-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                                <strong className="text-amber-500 font-bold block mb-0.5">Key Achievements:</strong>
                                {s.achievements}
                              </div>
                            )}

                            {s.services && (
                              <div className={`p-2.5 rounded-xl text-xs sm:text-sm mt-1.5 ${isDark ? 'bg-white/5 border border-white/5 text-gray-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                                <strong className="text-blue-400 font-bold block mb-0.5">Services & Contributions:</strong>
                                {s.services}
                              </div>
                            )}

                            {s.documentName && (
                              <div className="mt-2 flex items-center gap-2">
                                <a
                                  href={s.documentUrl || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold transition-all"
                                >
                                  <FileUp className="w-3.5 h-3.5" /> Attached Document: {s.documentName}
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </div>
                            )}

                            {s.adminNotes && (
                              <div className="mt-2 text-xs p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
                                <strong>Admin Note:</strong> {s.adminNotes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Review Buttons */}
                        <div className="flex md:flex-col justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                          {s.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => { setReviewingId(s.id); }}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Review & Action
                              </button>
                              <button
                                onClick={() => handleDeleteSuggestion(s.id)}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { setReviewingId(s.id); }}
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 font-medium"
                              >
                                Edit Review Status
                              </button>
                              <button
                                onClick={() => handleDeleteSuggestion(s.id)}
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs"
                                title="Delete suggestion"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Modal/Inline note form when reviewing */}
                      {reviewingId === s.id && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl border ${isDark ? 'bg-[#121214] border-amber-500/30' : 'bg-slate-100 border-slate-300'} space-y-3`}>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">Admin Review Decision</h4>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Feedback / Internal Notes for Submitter</label>
                            <input
                              type="text"
                              className={inp}
                              placeholder="e.g. Verified district credentials. Approved for publication."
                              value={reviewNote}
                              onChange={e => setReviewNote(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleReviewSuggestion(s.id, 'approved')}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                            >
                              <CheckSquare className="w-4 h-4" /> Approve Suggestion
                            </button>
                            <button
                              onClick={() => handleReviewSuggestion(s.id, 'rejected')}
                              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30"
                            >
                              <X className="w-4 h-4" /> Reject
                            </button>
                            <button
                              onClick={() => { setReviewingId(null); setReviewNote(''); }}
                              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-medium ml-auto"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── ADMIN SECURITY & PASSWORD MODAL ───────────────────────── */}
      <AnimatePresence>
        {securityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 30 }}
              className={`w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border p-5 sm:p-7 shadow-2xl relative overflow-y-auto max-h-[90vh] ${isDark ? 'bg-[#161618] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
            >
              <button
                onClick={() => setSecurityModalOpen(false)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-lg leading-tight">Admin Security & Password</h3>
                  <p className="text-xs text-gray-400">Manage administrator avatar and credentials</p>
                </div>
              </div>

              {/* Admin Avatar Section */}
              <div className={`p-4 rounded-xl border mb-5 flex items-center justify-between gap-3 ${isDark ? 'bg-white/3 border-white/8' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt="Admin"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-red-500"
                  />
                  <div>
                    <div className="text-xs font-bold">{user?.name || 'Administrator'}</div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[170px]">{user?.email || 'admin@peoplefirst.lk'}</div>
                  </div>
                </div>
                <input
                  type="file"
                  ref={adminAvatarInputRef}
                  onChange={handleAdminAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => adminAvatarInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 flex items-center gap-1.5 transition-all"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              </div>

              {adminPwMsg.text && (
                <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 mb-4 ${adminPwMsg.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/15 border-red-500/30 text-red-400'
                  }`}>
                  {adminPwMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  {adminPwMsg.text}
                </div>
              )}

              <form onSubmit={handleAdminChangePassword} className="space-y-4">
                <div>
                  <label className={lbl}>Current Admin Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={adminShowCurrentPw ? 'text' : 'password'}
                      required
                      className={`${inp} pl-9 pr-10`}
                      placeholder="Enter current password (default: admin123)"
                      value={adminCurrentPw}
                      onChange={(e) => setAdminCurrentPw(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowCurrentPw(!adminShowCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {adminShowCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={lbl}>New Admin Password (min. 6 chars)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    <input
                      type={adminShowNewPw ? 'text' : 'password'}
                      required
                      className={`${inp} pl-9 pr-10`}
                      placeholder="Enter new admin password"
                      value={adminNewPw}
                      onChange={(e) => setAdminNewPw(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowNewPw(!adminShowNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {adminShowNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={lbl}>Confirm New Admin Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    <input
                      type={adminShowConfirmPw ? 'text' : 'password'}
                      required
                      className={`${inp} pl-9 pr-10`}
                      placeholder="Re-enter new admin password"
                      value={adminConfirmPw}
                      onChange={(e) => setAdminConfirmPw(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowConfirmPw(!adminShowConfirmPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {adminShowConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSecurityModalOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}