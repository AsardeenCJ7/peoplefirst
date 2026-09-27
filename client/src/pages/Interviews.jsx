import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Search, Mic2, Filter, MapPin, CheckCircle, Clock, Sparkles, 
  BookOpen, ChevronLeft, ChevronRight, X, SlidersHorizontal, Volume2, 
  Share2, ArrowRight, Video, Award, ExternalLink, UserCheck, Eye, Layers
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllAchievers, fetchAchieversFromApi, categories } from '../data/achievers';
import { useLanguage } from '../context/LanguageContext';
import { extractYouTubeId } from '../utils/youtube';

export default function Interviews() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [allInterviews, setAllInterviews] = useState(() => getAllAchievers());

  useEffect(() => {
    fetchAchieversFromApi().then(data => {
      if (data && data.length > 0) {
        setAllInterviews(data);
        setSpotlightAchiever(prev => prev || data[0]);
      }
    });
  }, []);

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [cinemaVideo, setCinemaVideo] = useState(null);

  // Active Achiever Spotlight state (Coordinates Achiever details with Video Interview)
  const [spotlightAchiever, setSpotlightAchiever] = useState(() => allInterviews[0]);

  // Featured Slides
  const featuredInterviews = useMemo(() => {
    return allInterviews.filter(a => a.featured).length > 0 
      ? allInterviews.filter(a => a.featured)
      : allInterviews.slice(0, 4);
  }, [allInterviews]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Pagination state (6 interviews per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Auto rotate slides
  useEffect(() => {
    if (isSlidePaused || featuredInterviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredInterviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isSlidePaused, featuredInterviews.length]);

  // Extract districts
  const districts = useMemo(() => {
    const list = new Set();
    allInterviews.forEach(a => {
      if (a.location) list.add(a.location);
    });
    return ['All', ...Array.from(list)];
  }, [allInterviews]);

  // Filter & Sort
  const filtered = useMemo(() => {
    return allInterviews.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchDistrict = selectedDistrict === 'All' || item.location === selectedDistrict;
      return matchSearch && matchCategory && matchDistrict;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured === b.featured) return 0;
        return a.featured ? -1 : 1;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'yearDesc') {
        return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
      }
      return 0;
    });
  }, [allInterviews, search, selectedCategory, selectedDistrict, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedInterviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const element = document.getElementById('interviews-directory');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredInterviews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredInterviews.length) % featuredInterviews.length);
  };

  return (
    <div className="min-h-screen bg-dark-100 pt-4 sm:pt-6 pb-24 overflow-x-hidden">
      {/* QUICK ACHIEVERS COORDINATION STRIP (Select Any Achiever to View Summary & Interview) */}
      <section className="container-main mb-6">
        <div className="bg-dark-200 border border-surface-border rounded-2xl p-3 sm:p-4 shadow-card">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Achievers In Focus
              </span>
              <span className="hidden sm:inline text-xs text-text-muted">
                — Select an achiever to view profile summary & recorded interview
              </span>
            </div>
            <Link
              to="/achievers"
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 shrink-0"
            >
              Full Archive ({allInterviews.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Horizontal Achievers Quick-Picker (Touch-friendly & non-overflowing) */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1">
            {allInterviews.map((item) => (
              <button
                key={item.id}
                onClick={() => setSpotlightAchiever(item)}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all border text-left ${
                  spotlightAchiever?.id === item.id
                    ? 'bg-primary/20 border-primary text-white shadow-glow-red font-bold'
                    : 'bg-dark-300 border-surface-border text-text-secondary hover:bg-dark-400 hover:text-white'
                }`}
              >
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-primary shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate max-w-[110px] sm:max-w-[140px] leading-tight">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-text-muted truncate max-w-[110px] sm:max-w-[140px]">
                    {item.category}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVER SPOTLIGHT & INTERVIEW SUMMARY CO-ORDINATED HERO SECTION */}
      {spotlightAchiever && (
        <section className="container-main mb-10">
          <div className="card p-5 sm:p-8 bg-gradient-to-br from-dark-200 via-dark-300/90 to-dark-200 border-2 border-primary/30 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Left Column: Achiever Profile, Title & Summary Bio */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-red text-xs px-3 py-1 font-bold flex items-center gap-1.5">
                    <Mic2 className="w-3.5 h-3.5" />
                    Achiever Interview Spotlight
                  </span>
                  <span className="badge-gold text-xs px-2.5 py-1">
                    {spotlightAchiever.category}
                  </span>
                  {spotlightAchiever.verified && (
                    <span className="badge-green text-xs px-2.5 py-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified Icon
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="font-manrope font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                    {spotlightAchiever.name}
                  </h2>
                  <p className="text-primary font-bold text-sm sm:text-base mt-1">
                    {spotlightAchiever.title}
                  </p>
                </div>

                {/* Achiever Small Intro & Summary Box */}
                <div className="bg-dark-100/80 p-4 sm:p-5 rounded-2xl border border-surface-border space-y-2">
                  <div className="flex items-center justify-between text-xs text-text-muted pb-1 border-b border-surface-border/50">
                    <span className="font-semibold text-text-primary">Biographical Summary</span>
                    <span className="flex items-center gap-1 text-primary">
                      <MapPin className="w-3 h-3" /> {spotlightAchiever.location}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-4">
                    {spotlightAchiever.bio.split('\n\n')[0]}
                  </p>
                </div>

                {/* Key Accolades list */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-gold flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> Notable Honors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {spotlightAchiever.achievements.slice(0, 2).map((ach, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-dark-300 px-2.5 py-1 rounded-lg border border-surface-border text-text-secondary truncate max-w-full"
                      >
                        🏅 {ach}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coordinated Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                  <button
                    onClick={() => setCinemaVideo(spotlightAchiever)}
                    className="btn-primary text-xs sm:text-sm px-5 py-2.5 sm:py-3 font-bold flex items-center gap-2 shadow-glow-red"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Play Video Interview
                  </button>
                  <Link
                    to={`/achiever/${spotlightAchiever.id || spotlightAchiever._id}`}
                    className="btn-gold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 font-bold flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read 3D Biography
                  </Link>
                </div>
              </div>

              {/* Right Column: Video Interview Player / Thumbnail */}
              <div className="lg:col-span-6">
                <div
                  className="relative rounded-2xl overflow-hidden aspect-video bg-dark-300 border-2 border-primary/40 shadow-2xl group cursor-pointer"
                  onClick={() => setCinemaVideo(spotlightAchiever)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(spotlightAchiever.videoId)}/hqdefault.jpg`}
                    alt={spotlightAchiever.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = spotlightAchiever.thumbnail; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="bg-primary px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
                        Studio Broadcast
                      </span>
                      <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur text-[10px] font-mono">
                        HD 1080p
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-glow-red group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-1" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="font-bold truncate max-w-[70%]">{spotlightAchiever.name}</span>
                      <span className="text-primary font-semibold text-[11px] flex items-center gap-1">
                        Click to Watch <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DISCOVERY SUITE: SEARCH & FILTERS */}
      <section id="interviews-directory" className="container-main">
        {/* Filter Controls Card - Zero Overflow & Clean Responsive Wrap */}
        <div className="card p-4 sm:p-6 bg-dark-200 border-surface-border mb-8 shadow-card space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="text"
                placeholder="Search interviews by achiever name, title, district, or field..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-dark-300 border border-surface-border focus:border-primary rounded-xl pl-10 pr-9 py-2.5 sm:py-3 text-text-primary placeholder-text-muted text-xs sm:text-sm focus:outline-none transition-all"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded-full hover:bg-dark-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* District & Sort Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 sm:flex-none flex items-center gap-1.5 bg-dark-300 px-3 py-2 rounded-xl border border-surface-border text-xs min-w-[130px]">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-text-primary focus:outline-none cursor-pointer text-xs"
                >
                  {districts.map((d) => (
                    <option key={d} value={d} className="bg-dark-200 text-white">
                      {d === 'All' ? 'All Districts' : d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 sm:flex-none flex items-center gap-1.5 bg-dark-300 px-3 py-2 rounded-xl border border-surface-border text-xs min-w-[130px]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gold shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-transparent text-text-primary focus:outline-none cursor-pointer text-xs"
                >
                  <option value="featured" className="bg-dark-200 text-white">Featured First</option>
                  <option value="yearDesc" className="bg-dark-200 text-white">Newest First</option>
                  <option value="name" className="bg-dark-200 text-white">Achiever Name (A–Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs - Clean Wrap */}
          <div className="pt-3 border-t border-surface-border">
            <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2 font-semibold">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>Filter by Topic / Field:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-glow-red font-bold'
                      : 'bg-dark-300 text-text-secondary hover:bg-dark-400 hover:text-text-primary border border-surface-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STATS HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs sm:text-sm text-text-muted">
          <div>
            Showing <strong className="text-white font-bold">{filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong>–<strong className="text-white font-bold">{Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of <strong className="text-primary font-bold">{filtered.length}</strong> Achiever Interviews
          </div>
          {(search || selectedCategory !== 'All' || selectedDistrict !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedDistrict('All');
                setCurrentPage(1);
              }}
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* INTERVIEWS VIDEO & SUMMARY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {paginatedInterviews.map((interview) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card group hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col bg-dark-200"
            >
              {/* Thumbnail with Video Play Trigger */}
              <div className="relative aspect-video overflow-hidden bg-dark-300">
                <img
                  src={`https://img.youtube.com/vi/${extractYouTubeId(interview.videoId)}/mqdefault.jpg`}
                  alt={interview.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = interview.thumbnail; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Category Pill & Series Badge */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="badge-red text-[10px] sm:text-[11px] font-bold px-2 py-0.5">
                    {interview.category}
                  </span>
                  {Array.isArray(interview.interviewSeries) && interview.interviewSeries.length > 1 && (
                    <span className="bg-black/80 text-gold-400 border border-gold-400/40 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur flex items-center gap-1 shadow-sm">
                      <Layers className="w-2.5 h-2.5" /> {interview.interviewSeries.length} Parts Series
                    </span>
                  )}
                </div>

                {/* Play Button Trigger */}
                <button
                  onClick={() => {
                    setSpotlightAchiever(interview);
                    setCinemaVideo(interview);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors"
                  aria-label={`Play interview of ${interview.name}`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-glow-red group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                  </div>
                </button>

                {/* Bottom Duration & Location */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] sm:text-xs text-white/90">
                  <span className="flex items-center gap-1 font-medium drop-shadow truncate max-w-[70%]">
                    <MapPin className="w-3 h-3 text-primary shrink-0" />
                    <span className="truncate">{interview.location}</span>
                  </span>
                  <span className="font-mono text-[10px] sm:text-[11px] bg-black/70 px-2 py-0.5 rounded backdrop-blur shrink-0">
                    HD Video
                  </span>
                </div>
              </div>

              {/* Achiever Details & Intro Summary Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={interview.thumbnail}
                        alt={interview.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-primary shrink-0"
                      />
                      <h3 className="font-manrope font-bold text-base text-white group-hover:text-primary transition-colors leading-tight">
                        <button
                          onClick={() => setSpotlightAchiever(interview)}
                          className="text-left hover:underline"
                        >
                          {interview.name}
                        </button>
                      </h3>
                    </div>
                    {interview.verified && (
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" title="Verified Icon" />
                    )}
                  </div>

                  <p className="text-primary font-semibold text-xs truncate pl-9">
                    {interview.title}
                  </p>

                  <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed pl-9">
                    {typeof interview.bio === 'string' ? interview.bio.split('\n\n')[0] : (interview.bio || interview.title)}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 sm:pt-3 border-t border-surface-border/60 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSpotlightAchiever(interview);
                      setCinemaVideo(interview);
                    }}
                    className="btn-primary text-xs py-2 px-2.5 justify-center font-bold flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Play Video
                  </button>
                  <Link
                    to={`/achiever/${interview.id || interview._id}`}
                    className="btn-gold text-xs py-2 px-2.5 justify-center font-bold flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    3D Bio Book
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="card p-8 sm:p-12 text-center space-y-4 bg-dark-200">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-text-muted mx-auto" />
            <h3 className="text-lg sm:text-xl font-bold text-white">No Interviews Found</h3>
            <p className="text-text-secondary text-xs sm:text-sm max-w-md mx-auto">
              We couldn't find any video interviews matching "{search}". Try searching for another keyword or reset filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedDistrict('All');
                setCurrentPage(1);
              }}
              className="btn-primary text-xs px-5 py-2.5"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* CONTINUOUS PAGER / PAGINATION BAR */}
        {filtered.length > itemsPerPage && (
          <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-dark-200 border border-surface-border">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-secondary text-xs px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed bg-dark-300 hover:bg-dark-400 border border-surface-border text-white font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-primary text-white shadow-glow-red'
                      : 'bg-dark-300 text-text-secondary hover:text-white hover:bg-dark-400 border border-surface-border'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn-secondary text-xs px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed bg-dark-300 hover:bg-dark-400 border border-surface-border text-white font-semibold"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CONTINUOUS PLAYLIST FOOTER RECOMMENDATION */}
        <div className="mt-12 sm:mt-16 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-dark-200 via-dark-300 to-dark-200 border border-surface-border flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Mic2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">Continuous National Interview Broadcasts</h4>
              <p className="text-text-muted text-xs">
                Nominate next interviewees or suggest community changemakers for our studio recording sessions.
              </p>
            </div>
          </div>
          <Link to="/contact" className="btn-gold text-xs px-4 sm:px-5 py-2.5 font-bold shrink-0 w-full md:w-auto text-center">
            Request an Interview
          </Link>
        </div>
      </section>

      {/* CINEMA VIDEO MODAL */}
      <AnimatePresence>
        {cinemaVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setCinemaVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-dark-200 border border-surface-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl space-y-3 sm:space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-surface-border bg-dark-300/50">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <img
                    src={cinemaVideo.thumbnail}
                    alt={cinemaVideo.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-primary shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                      {cinemaVideo.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-primary truncate">{cinemaVideo.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setCinemaVideo(null)}
                  className="p-1.5 sm:p-2 text-text-muted hover:text-white rounded-full hover:bg-dark-400 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* YouTube Embed */}
              <div className="px-3 sm:px-5">
                <div className="video-wrapper rounded-xl sm:rounded-2xl overflow-hidden shadow-card border border-surface-border">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(cinemaVideo.videoId)}?autoplay=1&modestbranding=1&rel=0`}
                    title={cinemaVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-dark-300/30 border-t border-surface-border flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{cinemaVideo.location}</span>
                  <span>·</span>
                  <span>Year {cinemaVideo.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://youtube.com/watch?v=${extractYouTubeId(cinemaVideo.videoId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs px-3 sm:px-4 py-2 bg-dark-300 hover:bg-dark-400 border border-surface-border text-white flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    YouTube
                  </a>
                  <Link
                    to={`/achiever/${cinemaVideo.id || cinemaVideo._id}`}
                    onClick={() => setCinemaVideo(null)}
                    className="btn-gold text-xs px-3.5 sm:px-4 py-2 font-bold flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    3D Bio
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
