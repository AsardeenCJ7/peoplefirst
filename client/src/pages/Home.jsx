import { useRef, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Award, Mic2, Globe, Users, BookOpen, TrendingUp, Search, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AchieverCard from '../components/ui/AchieverCard';
import NewsCard from '../components/ui/NewsCard';
import AwardCard from '../components/ui/AwardCard';
import { getAllAchievers, fetchAchieversFromApi } from '../data/achievers';
import { getAllNews, fetchNewsFromApi } from '../data/news';
import { getAllAwards, fetchAwardsFromApi, setCachedAwards } from '../data/awards';
import { extractYouTubeId } from '../utils/youtube';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Home() {
  const featuredRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { openRecommendModal } = useAuth();
  const [achievers, setAchievers] = useState(() => getAllAchievers());
  const [newsArticles, setNewsArticles] = useState(() => getAllNews());
  const [awards, setAwards] = useState(() => getAllAwards());

  useEffect(() => {
    fetchAchieversFromApi().then(data => data && setAchievers(data));
    fetchNewsFromApi().then(data => data && setNewsArticles(data));
    fetchAwardsFromApi().then(data => data && setAwards(data));
  }, []);

  const handleHomeVoteChange = (awardId, voted, count, result) => {
    if (result?.awards && Array.isArray(result.awards)) {
      setAwards([...result.awards]);
    } else {
      setAwards([...getAllAwards()]);
    }
  };

  const totalAchievers = achievers.length;

  const totalInterviews = useMemo(() => {
    return achievers.reduce((acc, a) => {
      if (Array.isArray(a.interviewSeries) && a.interviewSeries.length > 0) {
        return acc + a.interviewSeries.length;
      }
      return acc + (a.videoId ? 1 : 0);
    }, 0);
  }, [achievers]);

  const totalAwards = awards.length;

  const totalNews = newsArticles.length;

  const stats = [
    { label: 'National Achievers', value: `${totalAchievers}`, icon: Users, color: 'text-primary' },
    { label: 'Video Interviews', value: `${totalInterviews}`, icon: Play, color: 'text-primary' },
    { label: 'Awards & Laureates', value: `${totalAwards}`, icon: Award, color: 'text-gold' },
    { label: 'Published Stories & Wires', value: `${totalNews}`, icon: TrendingUp, color: 'text-blue-400' },
  ];

  const featuredSideHero = useMemo(() => {
    return (
      achievers.find((a) => a.featured) ||
      achievers[0] || {
        name: 'Dr. Senaka Bibile',
        title: 'Father of Rational Medicine Policy',
        id: '1',
        thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
      }
    );
  }, [achievers]);

  return (
    <div className="w-full overflow-x-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-red-glow" />
        <div className="absolute top-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-primary/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(200,16,46,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,16,46,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container-main relative z-10 pt-20 sm:pt-28 pb-14 sm:pb-20 lg:pt-36 lg:pb-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left: Content — centered on mobile, left-aligned on desktop */}
            <motion.div
              className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Live badge */}
              <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-red" />
                  <span className="text-primary font-bold text-xs tracking-widest uppercase">
                    {t('heroBadge')}
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-manrope font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight"
              >
                <span className="text-text-primary">{t('heroTitlePrefix')} </span>
                <span className="text-gradient-red">{t('heroTitleHighlight')} </span>
                <span className="text-text-primary">{t('heroTitleSuffix')}</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                variants={itemVariants}
                className="text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                {t('heroDescription')}
              </motion.p>

              {/* Search UI */}
              <motion.div variants={itemVariants} className="w-full max-w-xl mx-auto lg:mx-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const query = e.target.query.value;
                    if (query.trim()) navigate(`/achievers?search=${encodeURIComponent(query)}`);
                  }}
                  className="relative group"
                >
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-primary group-focus-within:scale-110 transition-transform" />
                  <input
                    name="query"
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-dark-200/90 backdrop-blur-md border-2 border-primary/30 group-hover:border-primary/60 rounded-2xl pl-10 sm:pl-12 pr-24 sm:pr-32 py-3 sm:py-4 text-text-primary placeholder-text-muted text-xs sm:text-sm shadow-glow-red focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary text-xs px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-none font-bold"
                  >
                    Search
                  </button>
                </form>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 mt-2 text-xs text-text-muted px-1">
                  <span className="font-semibold text-primary">Popular:</span>
                  {['Dr. Senaka Bibile', 'Otara Gunewardene', 'Susanthika'].map((tag) => (
                    <Link
                      key={tag}
                      to={`/achievers?search=${encodeURIComponent(tag)}`}
                      className="hover:text-text-primary hover:underline transition-colors text-[11px]"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col xs:flex-row flex-wrap items-center justify-center lg:justify-start gap-3"
              >
                <Link to="/achievers" className="btn-primary text-sm px-6 py-3 w-full xs:w-auto justify-center">
                  <Users className="w-4 h-4" />
                  {t('exploreAchievers')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/interviews" className="btn-secondary text-sm px-6 py-3 w-full xs:w-auto justify-center">
                  <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 text-primary ml-0.5" fill="currentColor" />
                  </div>
                  {t('watchInterviews')}
                </Link>
              </motion.div>

              {/* Trust badge */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center lg:justify-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 w-full sm:w-fit mx-auto lg:mx-0"
              >
                <div className="flex -space-x-2">
                  {['LK', 'SL', 'AR', 'TK'].map((initials, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs ring-2 ring-dark-100"
                      style={{ background: `hsl(${i * 90 + 10}, 70%, 40%)` }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-text-primary font-semibold text-xs sm:text-sm">Curated by the National Biographers Circle</p>
                  <p className="text-text-muted text-[10px] sm:text-xs">Verified against state journals & academic trusts</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Featured story card — hidden on small, shown md+ */}
            <motion.div
              className="lg:col-span-5 hidden md:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover group aspect-[4/5] bg-dark-300 border border-surface-border/50">
                <img
                  src={featuredSideHero.thumbnail || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80'}
                  alt={featuredSideHero.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <span className="text-white text-xs font-bold tracking-wide">FEATURED BIOGRAPHY</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <div className="bg-black/75 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-red text-[10px]">{featuredSideHero.category || 'National Icon'}</span>
                      <span className="text-text-muted text-xs">Verified Heritage</span>
                    </div>
                    <h3 className="font-manrope font-bold text-white text-sm sm:text-base leading-tight mb-3">
                      {featuredSideHero.name}: {featuredSideHero.title}
                    </h3>
                    <Link
                      to={`/achiever/${featuredSideHero.id || featuredSideHero._id}`}
                      className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                      Watch Story & Read 3D Book
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-px h-8 sm:h-10 bg-gradient-to-b from-primary/0 via-primary/50 to-primary" />
          <span className="text-[10px] sm:text-xs tracking-widest uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="bg-dark-200 border-y border-surface-border py-10 sm:py-14">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className={`flex items-center justify-center gap-2 mb-2 ${stat.color}`}>
                  <stat.icon className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <div className={`font-manrope font-black text-3xl sm:text-4xl md:text-5xl ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-text-muted text-xs sm:text-sm leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED ACHIEVERS ===== */}
      <section className="py-12 sm:py-20 bg-dark-100" ref={featuredRef}>
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div className="section-header mb-0 text-center sm:text-left">
              <div className="section-label justify-center sm:justify-start">
                <Award className="w-3.5 h-3.5" />
                {t('featuredTitle')}
              </div>
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">{t('featuredTitle')}</h2>
              <p className="section-subtitle text-sm sm:text-base">{t('featuredSubtitle')}</p>
            </div>
            <Link to="/achievers" className="btn-ghost shrink-0 gap-1.5 text-primary hover:text-primary-light self-center sm:self-auto">
              {t('viewAllAchievers')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {achievers.filter(a => a.featured).slice(0, 4).map((achiever, i) => (
              <AchieverCard key={achiever.id} achiever={achiever} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== LATEST INTERVIEWS ===== */}
      <section className="py-12 sm:py-20 bg-dark-200 border-y border-surface-border">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div className="section-header mb-0 text-center sm:text-left">
              <div className="section-label justify-center sm:justify-start">
                <Mic2 className="w-3.5 h-3.5" />
                {t('interviewsTitle')}
              </div>
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">{t('interviewsTitle')}</h2>
              <p className="section-subtitle text-sm sm:text-base">{t('interviewsSubtitle')}</p>
            </div>
            <Link to="/interviews" className="btn-ghost shrink-0 gap-1.5 text-primary hover:text-primary-light self-center sm:self-auto">
              {t('viewAllInterviews')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {achievers.slice(0, 3).map((achiever, i) => (
              <motion.div
                key={achiever.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/achiever/${achiever.id}`} className="group block card overflow-hidden hover:border-primary/40">
                  <div className="relative aspect-video overflow-hidden bg-dark-300">
                    <img
                      src={`https://img.youtube.com/vi/${extractYouTubeId(achiever.videoId)}/hqdefault.jpg`}
                      alt={achiever.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = achiever.thumbnail; }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glow-red group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="white" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="badge-red text-[10px]">Interview</span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-manrope font-bold text-text-primary text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {achiever.title}
                    </h3>
                    <p className="text-text-muted text-xs mt-1">{achiever.name} · {achiever.location}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AWARDS SPOTLIGHT ===== */}
      <section className="py-12 sm:py-20 bg-dark-100">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div className="section-header mb-0 text-center sm:text-left">
              <div className="section-label justify-center sm:justify-start text-gold">
                <Award className="w-3.5 h-3.5" />
                {t('awardsTitle')}
              </div>
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">{t('awardsTitle')}</h2>
              <p className="section-subtitle text-sm sm:text-base">{t('awardsSubtitle')}</p>
            </div>
            <Link to="/awards" className="btn-ghost shrink-0 gap-1.5 text-gold hover:text-gold-light self-center sm:self-auto">
              {t('viewAllAwards')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {awards.slice(0, 3).map((award, i) => (
              <AwardCard key={award.id || award._id} award={award} index={i} onVoteChange={handleHomeVoteChange} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== LATEST NEWS ===== */}
      <section className="py-12 sm:py-20 bg-dark-200 border-y border-surface-border">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div className="section-header mb-0 text-center sm:text-left">
              <div className="section-label justify-center sm:justify-start">
                <TrendingUp className="w-3.5 h-3.5" />
                {t('latestNews')}
              </div>
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">{t('latestNews')}</h2>
              <p className="section-subtitle text-sm sm:text-base">{t('latestNewsSubtitle')}</p>
            </div>
            <Link to="/news" className="btn-ghost shrink-0 gap-1.5 text-primary hover:text-primary-light self-center sm:self-auto">
              {t('allNews')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {newsArticles.slice(0, 3).map((article, i) => (
              <NewsCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW TO RECOMMEND ===== */}
      <section className="py-16 sm:py-24 bg-dark-200 border-t border-surface-border relative overflow-hidden">
        <div className="container-main">
          <div className="section-header text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <div className="section-label justify-center text-gold">
              <Award className="w-3.5 h-3.5" />
              {t('communityPart')}
            </div>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">
              {t('howToRecommendTitle')}
            </h2>
            <p className="section-subtitle text-sm sm:text-base mx-auto">
              {t('howToRecommendSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: '01', title: t('step1Title'), desc: t('step1Desc'), icon: Users, color: 'border-primary/40 text-primary bg-primary/10' },
              { step: '02', title: t('step2Title'), desc: t('step2Desc'), icon: Award, color: 'border-gold/40 text-gold bg-gold/10' },
              { step: '03', title: t('step3Title'), desc: t('step3Desc'), icon: Mic2, color: 'border-primary/40 text-primary bg-primary/10' },
              { step: '04', title: t('step4Title'), desc: t('step4Desc'), icon: BookOpen, color: 'border-gold/40 text-gold bg-gold/10' },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <motion.div
                  key={st.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-5 sm:p-6 relative border-surface-border hover:border-gold/40 transition-all space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xl sm:text-2xl text-text-muted/40">{st.step}</span>
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center ${st.color}`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                  <h3 className="font-manrope font-bold text-base sm:text-lg text-text-primary">{st.title}</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">{st.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <button
              onClick={openRecommendModal}
              className="btn-gold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 shadow-glow-gold font-bold inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Award className="w-5 h-5" />
              {t('recommendNow')}
            </button>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 sm:py-24 bg-dark-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-glow" />
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="container-main relative z-10 text-center space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="section-label justify-center">
              <Users className="w-3.5 h-3.5" />
              {t('joinMovement')}
            </div>
            <h2 className="font-manrope font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-text-primary px-4">
              {t('ctaTitle')}
            </h2>
            <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-xl mx-auto px-4">
              {t('ctaSubtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4"
          >
            <button
              onClick={openRecommendModal}
              className="btn-primary text-sm sm:text-base px-8 py-3.5 sm:py-4 w-full sm:w-auto justify-center"
            >
              <Award className="w-5 h-5" />
              {t('suggestButton')}
            </button>
            <Link to="/about" className="btn-secondary text-sm sm:text-base px-8 py-3.5 sm:py-4 w-full sm:w-auto justify-center">
              {t('learnAboutUs')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
