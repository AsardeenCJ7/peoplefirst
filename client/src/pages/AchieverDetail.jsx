import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, CheckCircle, ChevronLeft, ChevronRight, Play, Volume2, 
  ListVideo, Award, Sparkles, BookOpen, Share2, Calendar, UserCheck, ArrowRight,
  Tv, Clock, Film, Radio, Check
} from 'lucide-react';
import VideoPlayer from '../components/ui/VideoPlayer';
import LikeButton from '../components/ui/LikeButton';
import ShareButtons from '../components/ui/ShareButtons';
import FlipBook from '../components/ui/FlipBook';
import { getAllAchievers, getAchieverInterviewSeries } from '../data/achievers';
import { useLanguage } from '../context/LanguageContext';

export default function AchieverDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const allAchievers = useMemo(() => getAllAchievers(), []);

  const currentIndex = allAchievers.findIndex((a) => String(a.id) === String(id));
  const achiever = (currentIndex !== -1 ? allAchievers[currentIndex] : allAchievers.find((a) => String(a.id) === String(id))) || allAchievers[0];

  // Specific interview series episodes ONLY for this achiever
  const seriesEpisodes = useMemo(() => getAchieverInterviewSeries(achiever), [achiever]);

  // Active playing episode state
  const [activeEpisode, setActiveEpisode] = useState(seriesEpisodes[0] || null);

  // Continuous Pager: Previous and Next Achievers
  const activeIdx = currentIndex !== -1 ? currentIndex : 0;
  const prevAchiever = activeIdx > 0 
    ? allAchievers[activeIdx - 1] 
    : allAchievers[allAchievers.length - 1] || achiever;
  const nextAchiever = activeIdx < allAchievers.length - 1 
    ? allAchievers[activeIdx + 1] 
    : allAchievers[0] || achiever;

  // Other achievers in the platform
  const otherAchievers = useMemo(() => {
    return allAchievers.filter((a) => String(a.id) !== String(achiever?.id));
  }, [allAchievers, achiever]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (seriesEpisodes && seriesEpisodes.length > 0) {
      setActiveEpisode(seriesEpisodes[0]);
    }
  }, [id, achiever]);

  if (!achiever) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-center space-y-4">
          <h2 className="font-manrope font-bold text-2xl text-text-primary">Achiever Not Found</h2>
          <Link to="/achievers" className="btn-primary">
            Back to Achievers Archive
          </Link>
        </div>
      </div>
    );
  }

  const currentVideoId = activeEpisode?.videoId || achiever.videoId || 'dQw4w9WgXcQ';
  const currentVideoTitle = activeEpisode?.title || `${achiever.name} — Full Interview`;

  return (
    <div className="min-h-screen bg-dark-100 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="bg-dark-200 border-b border-surface-border mb-6">
        <div className="container-main py-3">
          <div className="flex items-center gap-2 text-xs md:text-sm text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/achievers" className="hover:text-primary transition-colors">
              Achievers Archive
            </Link>
            <span>/</span>
            <span className="text-primary font-semibold truncate">{achiever.name}</span>
          </div>
        </div>
      </div>

      <div className="container-main">
        {/* Top Actions & Continuous Quick Nav */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            to="/achievers"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-semibold text-sm group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Achievers Archive
          </Link>

          {/* Quick Like, Share & Laurels */}
          <div className="flex items-center gap-3">
            <LikeButton initialLikes={3420} />
            <ShareButtons
              url={window.location.href}
              title={`${achiever.name} - Biography & Video Interview Series | PeopleFirst`}
              compact
            />
          </div>
        </div>

        {/* HERO BANNER & VIDEO PLAYER WITH ACHIVER-SPECIFIC INTERVIEW SERIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Video Section */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Episode Bar Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="badge-red text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1">
                    <Radio className="w-3 h-3 text-white animate-pulse" />
                    Interview Part {activeEpisode?.episode || 1}
                  </span>
                  <span className="text-xs text-text-muted">
                    Episode {activeEpisode?.episode || 1} of {seriesEpisodes.length} in series
                  </span>
                </div>
                {activeEpisode?.duration && (
                  <span className="text-xs font-mono text-text-muted flex items-center gap-1 bg-dark-200 px-2.5 py-1 rounded-md border border-surface-border">
                    <Clock className="w-3 h-3 text-gold" />
                    {activeEpisode.duration}
                  </span>
                )}
              </div>

              {/* YouTube Player */}
              <VideoPlayer
                key={currentVideoId}
                videoId={currentVideoId}
                title={currentVideoTitle}
                thumbnail={achiever.thumbnail}
              />

              <div className="flex flex-wrap items-center justify-between text-xs text-text-muted px-1 gap-2">
                <span className="text-white font-medium flex items-center gap-1.5 truncate max-w-lg">
                  <Film className="w-3.5 h-3.5 text-primary shrink-0" />
                  {currentVideoTitle}
                </span>
                <span className="flex items-center gap-1.5 text-primary font-semibold shrink-0">
                  <Volume2 className="w-4 h-4" /> High-Definition Master
                </span>
              </div>
            </motion.div>

            {/* Achiever Bio Summary Card */}
            <div className="card p-6 bg-dark-200 space-y-5 border-surface-border">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-red text-xs px-3 py-1 font-bold">
                    {achiever.category}
                  </span>
                  {achiever.verified && (
                    <span className="badge-green flex items-center gap-1 text-xs px-2.5 py-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified National Icon
                    </span>
                  )}
                  {achiever.featured && (
                    <span className="badge-gold text-xs px-2.5 py-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Roll of Honor
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-muted flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                  <span>Honored Year {achiever.year}</span>
                </div>
              </div>

              <div>
                <h1 className="font-manrope font-black text-2xl sm:text-3xl lg:text-4xl text-white">
                  {achiever.name}
                </h1>
                <p className="text-primary font-semibold text-base sm:text-lg mt-1">
                  {achiever.title}
                </p>
                <div className="flex items-center gap-1 text-text-muted text-xs mt-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{achiever.location}</span>
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="text-text-secondary text-sm leading-relaxed space-y-3 bg-dark-300/40 p-5 rounded-2xl border border-surface-border/60">
                {(achiever.bio || '').split('\n\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Key Laurels & Achievements */}
              <div className="space-y-3 pt-2">
                <h3 className="font-manrope font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  Key Achievements & Honors
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Array.isArray(achiever.achievements)
                    ? achiever.achievements
                    : typeof achiever.achievements === 'string'
                    ? achiever.achievements.split('\n')
                    : ['Distinguished National Contributor', 'Public Service Champion']
                  ).map((ach, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs p-3.5 bg-dark-300 rounded-xl border border-surface-border text-text-secondary leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-gold/15 text-gold font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Achiever's Own Interview Series Playlist Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="card p-5 border-surface-border bg-dark-200 space-y-4 sticky top-24">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase">
                  <Tv className="w-4 h-4" />
                  <span>Interview Series</span>
                </div>
                <span className="badge-red text-[10px] px-2 py-0.5 font-bold">
                  {seriesEpisodes.length} {seriesEpisodes.length === 1 ? 'Part' : 'Parts'}
                </span>
              </div>
              
              <p className="text-text-muted text-xs leading-relaxed">
                Watch all recorded video interview parts for <strong className="text-white">{achiever.name}</strong>.
              </p>

              {/* Now Playing Mini Box */}
              <div className="p-3.5 rounded-xl bg-primary/15 border border-primary/30 flex items-start gap-3 shadow-glow-red/20">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                  <Play className="w-4 h-4 fill-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-primary font-black uppercase tracking-wider">Now Playing</span>
                    <span className="text-[10px] text-text-muted font-mono">· Part {activeEpisode?.episode || 1}</span>
                  </div>
                  <p className="text-white text-xs font-bold truncate mt-0.5">{activeEpisode?.title || currentVideoTitle}</p>
                  {activeEpisode?.duration && (
                    <span className="text-[10px] text-gold font-mono block mt-0.5">{activeEpisode.duration}</span>
                  )}
                </div>
              </div>

              {/* Episode List strictly for this proper achiever */}
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto scrollbar-none pr-1 divide-y divide-surface-border/60">
                {seriesEpisodes.map((ep, idx) => {
                  const isPlaying = (activeEpisode?.id ? activeEpisode.id === ep.id : activeEpisode?.videoId === ep.videoId) || (!activeEpisode && idx === 0);
                  const epNum = ep.episode || idx + 1;
                  const thumb = ep.videoId 
                    ? `https://img.youtube.com/vi/${ep.videoId}/mqdefault.jpg` 
                    : achiever.thumbnail;

                  return (
                    <button
                      key={ep.id || idx}
                      onClick={() => setActiveEpisode(ep)}
                      className={`w-full pt-3 flex items-start gap-3 p-3 rounded-xl transition-all group text-left border ${
                        isPlaying 
                          ? 'bg-primary/10 border-primary/40 shadow-sm' 
                          : 'bg-dark-300/40 border-transparent hover:bg-dark-300 hover:border-surface-border'
                      }`}
                    >
                      {/* Thumbnail with overlay */}
                      <div className="relative shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-dark-400 border border-surface-border">
                        <img
                          src={thumb}
                          alt={ep.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => { e.target.src = achiever.thumbnail; }}
                        />
                        <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                          isPlaying ? 'bg-primary/60' : 'bg-black/50 group-hover:bg-primary/70'
                        }`}>
                          {isPlaying ? (
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary stroke-[3]" />
                            </div>
                          ) : (
                            <Play className="w-4 h-4 text-white fill-white" />
                          )}
                        </div>
                        <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 text-white font-mono px-1 rounded">
                          {ep.duration || 'Video'}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                            isPlaying ? 'bg-primary text-white' : 'bg-dark-100 text-gold'
                          }`}>
                            Part {epNum}
                          </span>
                          {ep.date && <span className="text-[10px] text-text-muted font-mono">{ep.date}</span>}
                        </div>
                        <p className={`text-xs font-semibold line-clamp-2 leading-snug transition-colors ${
                          isPlaying ? 'text-primary font-bold' : 'text-white group-hover:text-primary'
                        }`}>
                          {ep.title}
                        </p>
                        {ep.description && (
                          <p className="text-text-muted text-[11px] line-clamp-1 mt-1">
                            {ep.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3D INTERACTIVE FLIPBOOK SECTION */}
        <div className="max-w-5xl mx-auto space-y-4 mb-16">
          <div className="text-center space-y-1">
            <span className="text-gold text-xs font-serif tracking-widest uppercase font-bold">
              Archival Manuscript
            </span>
            <h2 className="text-2xl sm:text-3xl font-manrope font-extrabold text-white">
              Turn Pages of {achiever.name}'s History
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              Read verified biographical memoirs, historical milestones & public honors in interactive 3D.
            </p>
          </div>
          <FlipBook achiever={achiever} />
        </div>

        {/* OTHER SRI LANKAN ACHIEVERS SECTION */}
        {otherAchievers.length > 0 && (
          <section className="mb-16 pt-8 border-t border-surface-border">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  National Icons Archive
                </span>
                <h3 className="text-xl sm:text-2xl font-manrope font-black text-white mt-0.5">
                  More Inspiring Sri Lankan Achievers
                </h3>
              </div>
              <Link
                to="/achievers"
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherAchievers.slice(0, 4).map((other) => (
                <Link
                  key={other.id}
                  to={`/achiever/${other.id}`}
                  className="card p-4 bg-dark-200 border border-surface-border hover:border-primary/50 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-dark-300">
                      <img
                        src={other.thumbnail}
                        alt={other.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 badge-red text-[10px]">
                        {other.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {other.name}
                      </h4>
                      <p className="text-text-muted text-xs line-clamp-2 mt-0.5">
                        {other.title}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 mt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-text-muted">
                    <span>{other.location}</span>
                    <span className="text-gold font-semibold">View Story →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CONTINUOUS PAGER UNDER EACH PAGE */}
        <section className="border-t border-surface-border pt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-primary font-bold">Continuous Navigation</span>
              <h3 className="text-xl font-manrope font-black text-white">Continue Exploring Achievers</h3>
            </div>
            <Link
              to="/achievers"
              className="btn-secondary text-xs px-4 py-2 bg-dark-300 hover:bg-dark-400 border border-surface-border text-white font-semibold"
            >
              Browse All ({allAchievers.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous Achiever Card */}
            <Link
              to={`/achiever/${prevAchiever.id}`}
              className="group p-5 rounded-2xl bg-dark-200 border border-surface-border hover:border-primary/50 transition-all flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-300 shrink-0 relative">
                <img
                  src={prevAchiever.thumbnail}
                  alt={prevAchiever.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[11px] text-text-muted mb-0.5">
                  <ChevronLeft className="w-3.5 h-3.5 text-primary" />
                  <span>Previous Achiever</span>
                </div>
                <h4 className="font-bold text-white text-base truncate group-hover:text-primary transition-colors">
                  {prevAchiever.name}
                </h4>
                <p className="text-xs text-text-muted truncate">{prevAchiever.category}</p>
              </div>
            </Link>

            {/* Next Achiever Card */}
            <Link
              to={`/achiever/${nextAchiever.id}`}
              className="group p-5 rounded-2xl bg-dark-200 border border-surface-border hover:border-primary/50 transition-all flex items-center justify-between gap-4 text-right"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-end gap-1 text-[11px] text-text-muted mb-0.5">
                  <span>Next Achiever</span>
                  <ChevronRight className="w-3.5 h-3.5 text-primary" />
                </div>
                <h4 className="font-bold text-white text-base truncate group-hover:text-primary transition-colors">
                  {nextAchiever.name}
                </h4>
                <p className="text-xs text-text-muted truncate">{nextAchiever.category}</p>
              </div>
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-300 shrink-0 relative text-left">
                <img
                  src={nextAchiever.thumbnail}
                  alt={nextAchiever.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
