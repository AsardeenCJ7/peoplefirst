import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Play, MapPin, CheckCircle, X, Sparkles, BookOpen, 
  ChevronLeft, ChevronRight, Award, LayoutGrid, Split, SlidersHorizontal, 
  Calendar, Eye, Volume2, Share2, Layers
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { achievers, categories, getAllAchievers, fetchAchieversFromApi } from '../data/achievers';
import { useLanguage } from '../context/LanguageContext';
import { extractYouTubeId } from '../utils/youtube';

export default function Achievers() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [allAchieversList, setAllAchieversList] = useState(() => getAllAchievers());

  useEffect(() => {
    fetchAchieversFromApi().then(data => {
      if (data && data.length > 0) {
        setAllAchieversList(data);
        setSelectedAchiever(prev => prev || data[0]);
      }
    });
  }, []);

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'split'
  const [selectedAchiever, setSelectedAchiever] = useState(() => allAchieversList[0] || achievers[0]);
  const [videoModalAchiever, setVideoModalAchiever] = useState(null);

  // Slides / Carousel state
  const featuredAchievers = useMemo(() => {
    return allAchieversList.filter(a => a.featured).length > 0
      ? allAchieversList.filter(a => a.featured)
      : allAchieversList.slice(0, 4);
  }, [allAchieversList]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (initialQuery) {
      setSearch(initialQuery);
    }
  }, [initialQuery]);

  // Auto rotate slides every 6 seconds
  useEffect(() => {
    if (isSlidePaused || featuredAchievers.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredAchievers.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isSlidePaused, featuredAchievers.length]);

  // Extract unique districts
  const districts = useMemo(() => {
    const list = new Set();
    allAchieversList.forEach(a => {
      if (a.location) list.add(a.location);
    });
    return ['All', ...Array.from(list)];
  }, [allAchieversList]);

  // Filter & Sort
  const filtered = useMemo(() => {
    return allAchieversList.filter(a => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase()) ||
        (a.location && a.location.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = selectedCategory === 'All' || a.category === selectedCategory;
      const matchDistrict = selectedDistrict === 'All' || a.location === selectedDistrict;
      return matchSearch && matchCategory && matchDistrict;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured === b.featured) return 0;
        return a.featured ? -1 : 1;
      }
      if (sortBy === 'yearDesc') {
        return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
      }
      if (sortBy === 'yearAsc') {
        return (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [allAchieversList, search, selectedCategory, selectedDistrict, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedAchievers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const element = document.getElementById('achievers-registry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredAchievers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredAchievers.length) % featuredAchievers.length);
  };

  return (
    <div className="min-h-screen bg-dark-100 pt-4 sm:pt-6 pb-24 overflow-x-hidden">
      {/* FEATURED ACHIEVERS HERO SLIDES / CAROUSEL */}
      <section 
        className="container-main mb-8 sm:mb-12"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
      >
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-dark-200 border border-surface-border shadow-2xl">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-gold/5 to-transparent pointer-events-none" />

          {/* Slide Content */}
          <div className="relative min-h-[440px] sm:min-h-[460px] lg:min-h-[480px] flex items-center">
            <AnimatePresence mode="wait">
              {featuredAchievers.map((slide, idx) => {
                if (idx !== currentSlide) return null;
                return (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-5 sm:p-8 lg:p-12"
                  >
                    {/* Left Column: Text Information & Actions */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-5 z-10 order-2 lg:order-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge-gold flex items-center gap-1.5 text-xs px-2.5 py-1 font-bold">
                          <Award className="w-3.5 h-3.5" />
                          Featured National Icon
                        </span>
                        <span className="badge-red text-xs px-2.5 py-1">
                          {slide.category}
                        </span>
                        {slide.verified && (
                          <span className="badge-green flex items-center gap-1 text-xs px-2 py-0.5">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>

                      <div>
                        <h1 className="font-manrope font-black text-2xl sm:text-3xl lg:text-5xl text-white leading-tight tracking-tight">
                          {slide.name}
                        </h1>
                        <p className="text-primary font-semibold text-sm sm:text-base mt-1">
                          {slide.title}
                        </p>
                      </div>

                      <p className="text-text-secondary text-xs sm:text-sm line-clamp-3 leading-relaxed max-w-2xl bg-dark-300/40 p-3 sm:p-4 rounded-xl border border-surface-border/50">
                        {slide.bio.split('\n\n')[0]}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-text-muted">
                        <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {slide.location}
                        </div>
                        <span>·</span>
                        <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          Year {slide.year}
                        </div>
                        <span>·</span>
                        <div className="flex items-center gap-1.5 text-primary font-medium">
                          <Sparkles className="w-3.5 h-3.5" />
                          {slide.achievements.length} Laurels
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                        <Link
                          to={`/achiever/${slide.id || slide._id}`}
                          className="btn-gold px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-glow-gold flex items-center gap-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          Read 3D Biography
                        </Link>
                        <button
                          onClick={() => setVideoModalAchiever(slide)}
                          className="btn-secondary px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center gap-2 bg-dark-300 hover:bg-dark-400 border border-surface-border text-white"
                        >
                          <Play className="w-4 h-4 text-primary fill-primary" />
                          Watch Interview
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Hero Visual Artwork */}
                    <div className="lg:col-span-5 flex justify-center z-10 order-1 lg:order-2">
                      <div className="relative group cursor-pointer" onClick={() => setVideoModalAchiever(slide)}>
                        <div className="w-44 h-44 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden border-2 border-gold/40 shadow-2xl relative">
                          <img
                            src={slide.thumbnail}
                            alt={slide.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 sm:p-4">
                            <div className="flex items-center gap-2 text-white text-xs font-semibold">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center shadow-glow-red">
                                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white ml-0.5" />
                              </div>
                              <span className="text-[11px] sm:text-xs">Click to Play Interview</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute -top-2.5 -right-2.5 bg-gradient-gold text-dark-100 font-extrabold text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                          <Award className="w-3 h-3" /> Roll of Honor
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Slider Controls & Progress Bar */}
          <div className="border-t border-surface-border bg-dark-300/60 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {featuredAchievers.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? 'w-6 sm:w-8 bg-primary shadow-glow-red'
                      : 'w-2 sm:w-2.5 bg-surface-border hover:bg-text-muted'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              <span className="text-[11px] sm:text-xs text-text-muted ml-2 font-mono">
                {currentSlide + 1} / {featuredAchievers.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={prevSlide}
                className="p-1.5 sm:p-2 rounded-xl bg-dark-200 border border-surface-border text-text-secondary hover:text-white hover:bg-dark-400 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 sm:p-2 rounded-xl bg-dark-200 border border-surface-border text-text-secondary hover:text-white hover:bg-dark-400 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRY SECTION: SEARCH, MULTI-FILTER & VIEW TOGGLE */}
      <section id="achievers-registry" className="container-main">
        {/* Controls Card - 100% Mobile Responsive & No Overflow */}
        <div className="card p-4 sm:p-6 bg-dark-200 border-surface-border mb-8 shadow-card space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="text"
                placeholder="Search by name, title, district..."
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

            {/* Dropdown Filters & View Switch (Stacked on mobile, row on desktop) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* District Filter */}
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

              {/* Sort Filter */}
              <div className="flex-1 sm:flex-none flex items-center gap-1.5 bg-dark-300 px-3 py-2 rounded-xl border border-surface-border text-xs min-w-[130px]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gold shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-transparent text-text-primary focus:outline-none cursor-pointer text-xs"
                >
                  <option value="featured" className="bg-dark-200 text-white">Featured First</option>
                  <option value="yearDesc" className="bg-dark-200 text-white">Newest Year</option>
                  <option value="yearAsc" className="bg-dark-200 text-white">Oldest Year</option>
                  <option value="name" className="bg-dark-200 text-white">Name (A–Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-dark-300 p-1 rounded-xl border border-surface-border shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white shadow'
                      : 'text-text-muted hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-1.5 sm:p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'split'
                      ? 'bg-primary text-white shadow'
                      : 'text-text-muted hover:text-white'
                  }`}
                  title="Split View"
                >
                  <Split className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Split</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills - Organized with flex-wrap without overflow */}
          <div className="pt-3 border-t border-surface-border">
            <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2 font-semibold">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>Filter by Category:</span>
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

        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs sm:text-sm text-text-muted">
          <div className="flex items-center gap-2 flex-wrap">
            Showing <strong className="text-white font-bold">{filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong>–<strong className="text-white font-bold">{Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of <strong className="text-primary font-bold">{filtered.length}</strong>
            <span className="text-white font-bold">Achievers</span>
            <span className="text-surface-border">|</span>
            <span
              style={{ fontFamily: "'Noto Sans Tamil', 'Latha', serif", letterSpacing: '0.04em' }}
              className="text-primary font-bold text-xs"
            >
              முதுசங்கள்
            </span>
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

        {/* RESULTS VIEW */}
        {viewMode === 'grid' ? (
          /* SHOWCASE GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {paginatedAchievers.map((achiever) => (
              <motion.div
                key={achiever.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card group hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col bg-dark-200"
              >
                {/* Image & Video Trigger Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-dark-300">
                  <img
                    src={achiever.thumbnail}
                    alt={achiever.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* Category & Status Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="badge-red text-[10px] sm:text-[11px] font-bold px-2 py-0.5">
                      {achiever.category}
                    </span>
                    {achiever.featured && (
                      <span className="badge-gold text-[9px] sm:text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                        <Award className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Play Video Button on Thumbnail */}
                  <button
                    onClick={() => setVideoModalAchiever(achiever)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors"
                    aria-label={`Play interview of ${achiever.name}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-glow-red group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                    </div>
                  </button>

                  {/* Location & Year Pin */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] sm:text-xs text-white/90">
                    <span className="flex items-center gap-1 font-medium drop-shadow truncate max-w-[65%]">
                      <MapPin className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate">{achiever.location}</span>
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] bg-black/60 px-2 py-0.5 rounded backdrop-blur shrink-0">
                      Year {achiever.year}
                    </span>
                  </div>
                </div>

                {/* Achiever Bio Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-manrope font-bold text-base sm:text-lg text-white group-hover:text-primary transition-colors">
                          <Link to={`/achiever/${achiever.id || achiever._id}`}>
                            {achiever.name}
                          </Link>
                        </h3>
                        <span
                          style={{ fontFamily: "'Noto Sans Tamil', 'Latha', serif", letterSpacing: '0.03em' }}
                          className="inline-block text-[10px] text-primary/70 font-semibold"
                        >
                          முதுசங்கள்
                        </span>
                      </div>
                      {achiever.verified && (
                        <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" title="Verified Sri Lankan Icon" />
                      )}
                    </div>
                    <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">
                      {achiever.title}
                    </p>
                    <p className="text-text-muted text-[11px] sm:text-xs line-clamp-3 leading-relaxed pt-0.5">
                      {typeof achiever.bio === 'string' ? achiever.bio.split('\n\n')[0] : (achiever.bio || achiever.title)}
                    </p>
                  </div>

                  {/* Achievements Snippet */}
                  <div className="pt-2 sm:pt-3 border-t border-surface-border/60">
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gold font-semibold mb-2 truncate">
                      <Sparkles className="w-3 h-3 shrink-0" />
                      <span className="truncate">Key Laurel: <span className="text-text-secondary font-normal">{Array.isArray(achiever.achievements) ? achiever.achievements[0] : (achiever.achievements || 'National Icon')}</span></span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to={`/achiever/${achiever.id || achiever._id}`}
                        className="btn-gold text-xs py-2 px-2.5 justify-center font-bold flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        3D Bio
                      </Link>
                      <button
                        onClick={() => setVideoModalAchiever(achiever)}
                        className="btn-secondary text-xs py-2 px-2.5 justify-center font-semibold flex items-center gap-1 bg-dark-300 hover:bg-dark-400 border border-surface-border text-white"
                      >
                        <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                        Interview
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* SPLIT INTERACTIVE PLAYER VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Sidebar List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-dark-200 rounded-2xl border border-surface-border overflow-hidden shadow-card">
                <div className="p-4 border-b border-surface-border flex items-center justify-between">
                  <h3 className="font-manrope font-bold text-text-primary text-sm">
                    Select Achiever ({filtered.length})
                  </h3>
                  <span className="text-[10px] text-text-muted uppercase">Click to preview</span>
                </div>
                <div className="overflow-y-auto max-h-[500px] sm:max-h-[600px] scrollbar-none divide-y divide-surface-border">
                  {filtered.map((achiever) => (
                    <button
                      key={achiever.id}
                      onClick={() => setSelectedAchiever(achiever)}
                      className={`w-full text-left flex items-center gap-3 p-3.5 sm:p-4 transition-all duration-200 hover:bg-dark-300 group ${
                        selectedAchiever?.id === achiever.id ? 'bg-primary/15 border-l-4 border-primary' : ''
                      }`}
                    >
                      <img
                        src={achiever.thumbnail}
                        alt={achiever.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-surface-border group-hover:ring-primary/40 transition-all shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold text-xs sm:text-sm truncate ${selectedAchiever?.id === achiever.id ? 'text-primary font-bold' : 'text-text-primary'}`}>
                          {achiever.name}
                        </p>
                        <span
                          style={{ fontFamily: "'Noto Sans Tamil', 'Latha', serif" }}
                          className="text-[9px] text-primary/60 font-semibold"
                        >
                          முதுசங்கள்
                        </span>
                        <p className="text-text-muted text-[11px] truncate">{achiever.category}</p>
                        <div className="flex items-center gap-1 text-text-muted text-[10px] mt-0.5 truncate">
                          <MapPin className="w-2.5 h-2.5 text-primary shrink-0" />
                          <span className="truncate">{achiever.location}</span>
                        </div>
                      </div>
                      <Play className={`w-4 h-4 shrink-0 ${selectedAchiever?.id === achiever.id ? 'text-primary' : 'text-text-muted opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Interactive Detail Player */}
            <div className="lg:col-span-8 space-y-6">
              {selectedAchiever && (
                <div className="space-y-6">
                  <div className="video-wrapper rounded-2xl overflow-hidden shadow-card-hover border border-surface-border">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(selectedAchiever.videoId)}?modestbranding=1&rel=0`}
                      title={selectedAchiever.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full rounded-2xl"
                    />
                  </div>

                  <div className="card p-5 sm:p-6 space-y-4 bg-dark-200">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge-red">{selectedAchiever.category}</span>
                        {selectedAchiever.verified && (
                          <span className="badge-green flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Verified History
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/achiever/${selectedAchiever.id || selectedAchiever._id}`}
                        className="btn-gold text-xs py-2 px-3.5 gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Open 3D FlipBook
                      </Link>
                    </div>

                    <h2 className="font-manrope font-black text-xl sm:text-2xl md:text-3xl text-text-primary">
                      {selectedAchiever.name}
                    </h2>
                    <p className="text-primary font-medium text-sm sm:text-base">{selectedAchiever.title}</p>
                    <p className="text-text-secondary text-xs sm:text-sm leading-relaxed bg-dark-300/60 p-3.5 sm:p-4 rounded-xl border border-surface-border">
                      {typeof selectedAchiever.bio === 'string' ? selectedAchiever.bio.split('\n\n')[0] : (selectedAchiever.bio || selectedAchiever.title)}
                    </p>

                    {/* Laurels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                      {(Array.isArray(selectedAchiever.achievements) ? selectedAchiever.achievements : [selectedAchiever.achievements || 'National Icon']).map((ach, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs p-3 bg-dark-300 rounded-lg border border-surface-border">
                          <span className="text-gold font-bold shrink-0">{i + 1}.</span>
                          <span className="text-text-secondary leading-relaxed">{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="card p-8 sm:p-12 text-center space-y-4 bg-dark-200">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-text-muted mx-auto" />
            <h3 className="text-lg sm:text-xl font-bold text-white">No Achievers Found</h3>
            <p className="text-text-secondary text-xs sm:text-sm max-w-md mx-auto">
              We couldn't find any Sri Lankan achievers matching your search "{search}". Try searching for another district, name, or category.
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
        {filtered.length > itemsPerPage && viewMode === 'grid' && (
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
      </section>

      {/* QUICK VIDEO INTERVIEW MODAL */}
      <AnimatePresence>
        {videoModalAchiever && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setVideoModalAchiever(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-dark-200 border border-surface-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl space-y-3 sm:space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-surface-border bg-dark-300/50">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <img
                    src={videoModalAchiever.thumbnail}
                    alt={videoModalAchiever.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-primary shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                      {videoModalAchiever.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-primary truncate">{videoModalAchiever.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setVideoModalAchiever(null)}
                  className="p-1.5 sm:p-2 text-text-muted hover:text-white rounded-full hover:bg-dark-400 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Embed */}
              <div className="px-3 sm:px-5">
                <div className="video-wrapper rounded-xl sm:rounded-2xl overflow-hidden shadow-card border border-surface-border">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(videoModalAchiever.videoId)}?autoplay=1&modestbranding=1&rel=0`}
                    title={videoModalAchiever.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="p-4 sm:p-5 bg-dark-300/30 border-t border-surface-border flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{videoModalAchiever.location}</span>
                  <span>·</span>
                  <span>Year {videoModalAchiever.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/achiever/${videoModalAchiever.id || videoModalAchiever._id}`}
                    onClick={() => setVideoModalAchiever(null)}
                    className="btn-gold text-xs px-3.5 sm:px-4 py-2 font-bold flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    3D Biography
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
