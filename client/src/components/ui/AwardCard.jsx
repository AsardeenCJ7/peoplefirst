import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, Users, CheckCircle2, ThumbsUp, Sparkles, RefreshCw, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isAwardVoted, toggleVoteAward } from '../../data/userActivity';

const statusColors = {
  Winner: 'bg-gold/20 text-gold border-gold/40 shadow-glow-gold/20 font-black',
  Nominee: 'bg-primary/20 text-primary border-primary/30 font-bold',
};

export default function AwardCard({
  award,
  index = 0,
  onVoteChange,
  isVotingActive = true,
  categoryTotalVotes = 0,
  userVotedInThisCategory = null,
}) {
  const { user, openAuthModal } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(award.votes || 0);

  useEffect(() => {
    if (user?.email && award?.id) {
      setHasVoted(isAwardVoted(user.email, award.id));
    } else {
      setHasVoted(false);
    }
  }, [user, award]);

  useEffect(() => {
    setVoteCount(award.votes || 0);
  }, [award.votes]);

  const handleVote = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isVotingActive) return;

    if (!user) {
      openAuthModal('login');
      return;
    }

    const result = toggleVoteAward(user.email, award.id);
    setHasVoted(result.voted);
    setVoteCount(result.count);

    if (onVoteChange) {
      onVoteChange(award.id, result.voted, result.count, result);
    }
  };

  const isCategoryOtherVoted = userVotedInThisCategory && String(userVotedInThisCategory.id) !== String(award.id);
  const votePercentage = categoryTotalVotes > 0 ? Math.round((voteCount / categoryTotalVotes) * 100) : 0;
  const isWinner = award.status === 'Winner';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`group card overflow-hidden transition-all duration-300 flex flex-col justify-between relative ${
        isWinner
          ? 'border-gold/60 bg-gradient-to-b from-dark-200 via-dark-200 to-gold/5 shadow-card-hover'
          : hasVoted
          ? 'border-gold/50 bg-gold/5 shadow-glow-gold/10'
          : 'hover:border-primary/40 bg-dark-200'
      }`}
    >
      <div>
        {/* Top Accent Ribbon */}
        <div
          className={`h-1.5 w-full ${
            isWinner
              ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light'
              : hasVoted
              ? 'bg-gold'
              : 'bg-primary'
          }`}
        />

        <div className="relative p-5 sm:p-6 space-y-4">
          {/* Header Row: Icon & Status */}
          <div className="flex items-start justify-between gap-3">
            <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-dark-300 border flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300 shadow-card shrink-0 ${
              isWinner ? 'border-gold/50 shadow-glow-gold/30 text-gold' : 'border-surface-border'
            }`}>
              {award.icon || (isWinner ? '🏆' : '⭐')}
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className={`badge border text-[11px] uppercase tracking-wider px-2.5 py-1 ${statusColors[award.status] || 'bg-dark-400 text-text-secondary'}`}>
                {isWinner ? '🏆 Category Winner' : '⭐ Live Nominee'}
              </span>

              {hasVoted && (
                <span className="text-[10px] text-gold font-bold flex items-center gap-1 bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
                  <CheckCircle2 className="w-3 h-3" /> Your Voted Pick
                </span>
              )}
            </div>
          </div>

          {/* Award Title & Category */}
          <div>
            <span className="text-[11px] font-bold text-primary tracking-wide uppercase">
              {award.category} · {award.year}
            </span>
            <h3 className="font-manrope font-extrabold text-white text-base sm:text-lg leading-snug group-hover:text-gold transition-colors mt-0.5">
              {award.title}
            </h3>
          </div>

          {/* Nominee Profile Box */}
          <div className="flex items-center gap-3 bg-dark-300/80 rounded-2xl p-3 border border-surface-border/70">
            <img
              src={award.thumbnail}
              alt={award.nominee}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 ring-2 ${
                isWinner ? 'ring-gold' : 'ring-primary/40'
              }`}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-white font-bold text-sm truncate flex items-center gap-1.5">
                <span>{award.nominee}</span>
                {isWinner && <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />}
              </p>
              <p className="text-text-muted text-[11px] truncate leading-tight mt-0.5">
                {award.presenter}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-3">
            {award.description}
          </p>

          {/* Category Vote Progress Bar */}
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text-muted font-medium flex items-center gap-1">
                <Users className="w-3 h-3 text-gold" />
                <span>Category Vote Share</span>
              </span>
              <span className="font-mono font-bold text-gold">
                {votePercentage}% ({voteCount.toLocaleString()} votes)
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-dark-400 overflow-hidden border border-surface-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(4, votePercentage))}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  isWinner
                    ? 'bg-gradient-to-r from-gold to-yellow-300'
                    : 'bg-gradient-to-r from-primary to-gold'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 sm:px-6 py-4 border-t border-surface-border flex items-center justify-between gap-3 bg-dark-300/30">
        <div className="min-w-0">
          <span className="font-mono text-xs font-black text-white">
            {voteCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-text-muted ml-1 uppercase">votes</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Voting Action Button */}
          {isVotingActive ? (
            <button
              onClick={handleVote}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border active:scale-95 ${
                hasVoted
                  ? 'bg-gold text-dark-100 border-gold shadow-glow-gold'
                  : isCategoryOtherVoted
                  ? 'bg-dark-300 text-gold hover:bg-gold hover:text-dark-100 border-gold/40'
                  : 'bg-primary/20 text-white hover:bg-primary border-primary/40 shadow-sm'
              }`}
              title={
                hasVoted
                  ? 'Click to remove vote'
                  : isCategoryOtherVoted
                  ? `Switch vote from ${userVotedInThisCategory.nominee} to ${award.nominee} (1 vote per category)`
                  : 'Click to vote for this candidate'
              }
            >
              {hasVoted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Voted</span>
                </>
              ) : isCategoryOtherVoted ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch Vote</span>
                </>
              ) : (
                <>
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Vote</span>
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-dark-400 text-text-muted border border-surface-border">
              <Lock className="w-3 h-3 text-gold" />
              <span>Voting Closed</span>
            </div>
          )}

          {award.nomineeId && (
            <Link
              to={`/achiever/${award.nomineeId}`}
              className="text-primary hover:text-primary-light text-xs font-bold flex items-center gap-0.5 hover:underline"
            >
              <span>Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
