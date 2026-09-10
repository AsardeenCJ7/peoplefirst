import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Search, Users, Filter, Clock, Sparkles, CheckCircle2,
  PlusCircle, RefreshCw, AlertCircle, ShieldCheck, Flame, Award as AwardIcon, Check
} from 'lucide-react';
import AwardCard from '../components/ui/AwardCard';
import NominateModal from '../components/ui/NominateModal';
import { getAllAwards, awardCategories, getVotingConfig, checkAndResolveWinners } from '../data/awards';
import { getUserCategoryVote, isAwardVoted } from '../data/userActivity';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Awards() {
  const { user, openAuthModal } = useAuth();
  const { t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [awards, setAwards] = useState([]);
  const [votingConfig, setVotingConfig] = useState(getVotingConfig());
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [voteToast, setVoteToast] = useState('');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isExpired: false,
  });

  const loadData = () => {
    // Check if auto winner resolution is needed
    checkAndResolveWinners();
    setAwards(getAllAwards());
    setVotingConfig(getVotingConfig());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Real-time Countdown Timer logic
  useEffect(() => {
    const updateCountdown = () => {
      const cfg = getVotingConfig();
      setVotingConfig(cfg);

      const target = new Date(cfg.deadline).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00', isExpired: true });
        // Trigger auto winner decision if not yet resolved
        if (cfg.isActive && cfg.autoDecideWinners) {
          checkAndResolveWinners();
          setAwards(getAllAwards());
        }
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
          isExpired: false,
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Awards
  const filtered = useMemo(() => {
    return awards.filter((award) => {
      const matchCat = selectedCategory === 'All' || award.category === selectedCategory;
      const matchSearch =
        award.nominee.toLowerCase().includes(search.toLowerCase()) ||
        award.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [awards, selectedCategory, search]);

  const winners = useMemo(() => filtered.filter((a) => a.status === 'Winner'), [filtered]);
  const nominees = useMemo(() => filtered.filter((a) => a.status === 'Nominee'), [filtered]);

  // Compute category total votes for percentage calculations
  const categoryTotalVotes = useMemo(() => {
    const totals = {};
    awards.forEach((a) => {
      totals[a.category] = (totals[a.category] || 0) + (a.votes || 0);
    });
    return totals;
  }, [awards]);

  // Track which candidates the current user has voted for by category (1 vote per category)
  const userCategoryVotes = useMemo(() => {
    if (!user?.email) return {};
    const map = {};
    awardCategories.forEach((cat) => {
      if (cat === 'All') return;
      const voted = getUserCategoryVote(user.email, cat);
      if (voted) map[cat] = voted;
    });
    return map;
  }, [user, awards]);

  const votedCategoriesCount = Object.keys(userCategoryVotes).length;
  const activeCategoriesCount = awardCategories.filter((c) => c !== 'All').length;

  const handleVoteChange = (awardId, voted, count, result) => {
    setAwards(getAllAwards());
    if (result?.message) {
      setVoteToast(result.message);
      setTimeout(() => setVoteToast(''), 4500);
    }
  };

  const handleNominationSuccess = (newAward) => {
    loadData();
    setVoteToast(`Nomination for ${newAward.nominee} submitted and live for voting!`);
    setTimeout(() => setVoteToast(''), 4500);
  };

  const isVotingActive = votingConfig.isActive && !timeLeft.isExpired;

  return (
    <div className="min-h-screen bg-dark-100 pb-24">
      {/* Toast Feedback */}
      <AnimatePresence>
        {voteToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-dark-200 border-2 border-gold text-white px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 max-w-[90vw]"
          >
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
            <span>{voteToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Banner */}
      <div className="relative bg-dark-200 border-b border-surface-border py-10 sm:py-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 60% 40%, rgba(244,169,0,0.12) 0%, rgba(200,16,46,0.06) 50%, transparent 80%)',
          }}
        />

        <div className="container-main relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="section-label text-gold flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Civic Honours & Democratic Recognition</span>
              </div>
              <h1 className="font-manrope font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                {votingConfig.seasonTitle || 'National Honors 2026'}{' '}
                <span className="text-gradient-gold">Balloting</span>
              </h1>
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                Democratic voting empowering Sri Lankan citizens to honor true national achievers.
                <strong className="text-white ml-1">One vote is permitted per category</strong>. When the countdown ends, the candidate with the highest community vote is automatically decided and published as Winner!
              </p>
            </div>

            {/* Quick Actions Shelf */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => setIsNominateModalOpen(true)}
                className="btn-gold px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-glow-gold flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nominate a Candidate</span>
              </button>
              <Link
                to="/admin"
                className="btn-secondary px-4 py-3 rounded-xl text-xs font-bold bg-dark-300 hover:bg-dark-400 border border-surface-border text-text-secondary hover:text-white flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>Admin Console</span>
              </Link>
            </div>
          </div>

          {/* ── LIVE VOTING COUNTDOWN & STATUS CARD ──────────────────────── */}
          <div className="card p-5 sm:p-6 bg-gradient-to-r from-dark-300/90 via-dark-200 to-dark-300/90 border-2 border-gold/30 rounded-3xl shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold/15 text-gold flex items-center justify-center shrink-0 border border-gold/30">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      {isVotingActive ? 'Voting Season Active' : 'Voting Concluded'}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isVotingActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gold/20 text-gold border border-gold/30'
                      }`}
                    >
                      {isVotingActive ? 'Live Balloting' : 'Winners Declared'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    {isVotingActive
                      ? 'Category Winners will be automatically calculated when timer hits zero.'
                      : 'Community votes have concluded. Highest-voted candidates in each category published.'}
                  </p>
                </div>
              </div>

              {/* 4-Box Digital Countdown */}
              <div className="flex items-center gap-2 sm:gap-3 self-center md:self-auto">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Minutes', val: timeLeft.minutes },
                  { label: 'Seconds', val: timeLeft.seconds },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-dark-100/90 border border-surface-border px-3 py-2 rounded-xl min-w-[58px] sm:min-w-[64px]"
                  >
                    <span className="font-mono font-black text-lg sm:text-xl text-gold leading-none">
                      {item.val}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-text-muted mt-1 font-semibold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1-Vote-Per-Category User Verification Banner */}
            <div className="pt-3 border-t border-surface-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                <span>
                  Voting Rule:{' '}
                  <strong className="text-white">Exactly 1 vote per category</strong>. You can switch your vote anytime before the deadline.
                </span>
              </div>

              {user ? (
                <div className="flex items-center gap-2 shrink-0 bg-gold/10 border border-gold/30 px-3 py-1.5 rounded-xl">
                  <span className="text-text-muted">Your Ballots:</span>
                  <span className="font-bold text-gold font-mono">
                    {votedCategoriesCount} of {activeCategoriesCount} Categories Voted
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-primary hover:underline font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  Sign in with Google to cast your votes →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-8 sm:py-10 space-y-10">
        {/* Controls Card: Search + Category Pills */}
        <div className="card p-4 sm:p-6 bg-dark-200 border-surface-border space-y-4 shadow-card">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
            <input
              type="text"
              placeholder={t('searchAwards')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-300 border border-surface-border focus:border-gold rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-text-primary placeholder-text-muted focus:outline-none transition-all"
            />
          </div>

          <div className="pt-2 border-t border-surface-border flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Filter className="w-3.5 h-3.5 text-text-muted shrink-0 mr-1" />
            <span className="text-xs text-text-muted font-semibold mr-1">Categories:</span>
            {awardCategories.map((cat) => {
              const hasVotedInCat = userCategoryVotes[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-gold text-dark-100 font-bold shadow-glow-gold'
                      : 'bg-dark-300 text-text-secondary hover:bg-dark-400 hover:text-white border border-surface-border'
                  }`}
                >
                  <span>{cat}</span>
                  {hasVotedInCat && (
                    <span className="w-2 h-2 rounded-full bg-gold shrink-0 ring-1 ring-white" title="You have cast a vote in this category" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── WINNERS SECTION ────────────────────────────────────────────── */}
        {winners.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-manrope font-black text-xl sm:text-2xl text-white">
                    {isVotingActive ? 'Category Champions & Established Laureates' : 'Official Winners (Elected by Community Vote)'}
                  </h2>
                  <p className="text-xs text-text-muted">
                    Candidates who achieved the highest citizen vote count in their categories.
                  </p>
                </div>
              </div>

              <span className="badge-gold text-xs px-3 py-1 font-bold">
                {winners.length} {winners.length === 1 ? 'Winner' : 'Winners'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {winners.map((award, i) => (
                <AwardCard
                  key={award.id}
                  award={award}
                  index={i}
                  onVoteChange={handleVoteChange}
                  isVotingActive={isVotingActive}
                  categoryTotalVotes={categoryTotalVotes[award.category] || award.votes}
                  userVotedInThisCategory={userCategoryVotes[award.category]}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── NOMINEES SECTION ───────────────────────────────────────────── */}
        {nominees.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-manrope font-black text-xl sm:text-2xl text-white">
                    Live Nominees Pool ({nominees.length})
                  </h2>
                  <p className="text-xs text-text-muted">
                    Cast your vote for one candidate per category. Top vote getter becomes the official winner.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNominateModalOpen(true)}
                className="text-xs text-gold font-bold hover:underline flex items-center gap-1 bg-gold/10 hover:bg-gold/20 px-3 py-1.5 rounded-xl border border-gold/30 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Suggest New Nominee</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nominees.map((award, i) => (
                <AwardCard
                  key={award.id}
                  award={award}
                  index={i}
                  onVoteChange={handleVoteChange}
                  isVotingActive={isVotingActive}
                  categoryTotalVotes={categoryTotalVotes[award.category] || award.votes}
                  userVotedInThisCategory={userCategoryVotes[award.category]}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="card p-12 text-center space-y-4 bg-dark-200">
            <Trophy className="w-12 h-12 text-text-muted mx-auto opacity-40" />
            <h3 className="font-bold text-lg text-white">No Awards or Nominees Found</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              No entries found matching your search. You can be the first to nominate a candidate for this category.
            </p>
            <button
              onClick={() => setIsNominateModalOpen(true)}
              className="btn-gold text-xs px-5 py-2.5 font-bold inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nominate for this Category</span>
            </button>
          </div>
        )}

        {/* Bottom Community Nomination Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 card p-6 sm:p-10 text-center border-gold/30 bg-gradient-to-r from-gold/10 via-dark-200 to-primary/10 space-y-4 sm:space-y-5 rounded-3xl relative overflow-hidden"
        >
          <div className="w-14 h-14 rounded-2xl bg-gold/20 text-gold flex items-center justify-center mx-auto text-2xl shadow-glow-gold">
            🏅
          </div>
          <h3 className="font-manrope font-black text-2xl sm:text-3xl text-white">
            Know an Unsung Hero or Innovator?
          </h3>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            PeopleFirst is an open civic platform. Any citizen can suggest a nominee in Healthcare, Arts, Environment, Social Service, Sports, or Education for community voting.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() => setIsNominateModalOpen(true)}
              className="btn-gold text-sm px-7 py-3.5 font-extrabold shadow-glow-gold flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Submit a Nomination Now</span>
            </button>
            <Link
              to="/about"
              className="btn-secondary text-sm px-6 py-3.5 font-semibold bg-dark-300 hover:bg-dark-400 border border-surface-border text-white flex items-center justify-center"
            >
              Learn Verification Process
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Nomination Modal */}
      <NominateModal
        isOpen={isNominateModalOpen}
        onClose={() => setIsNominateModalOpen(false)}
        onNominated={handleNominationSuccess}
      />
    </div>
  );
}
