import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  Search,
  X,
  Sparkles,
  Filter,
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  CalendarRange,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getAllNews, fetchNewsFromApi, newsCategories } from '../data/news';
import NewsCard from '../components/ui/NewsCard';

const PAGE_SIZE = 16;

export default function News() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState(() => getAllNews());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest' | 'title'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'week' | 'month' | 'custom'
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNewsFromApi().then(data => data && setArticles(data));
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, search, sortOrder, dateFilter, customDateFrom, customDateTo]);

  // Filter & Sort Articles
  const filteredAndSorted = useMemo(() => {
    const now = new Date();

    return articles
      .filter((article) => {
        // 1. Category filter
        const matchCat = selectedCategory === 'All' || article.category === selectedCategory;

        // 2. Search filter
        const matchSearch =
          (article.title || '').toLowerCase().includes(search.toLowerCase()) ||
          (article.summary || '').toLowerCase().includes(search.toLowerCase()) ||
          (article.category && article.category.toLowerCase().includes(search.toLowerCase())) ||
          (Array.isArray(article.tags)
            ? article.tags.some((t) => (t || '').toLowerCase().includes(search.toLowerCase()))
            : typeof article.tags === 'string'
              ? article.tags.toLowerCase().includes(search.toLowerCase())
              : false);

        // 3. Date-wise filter
        let matchDate = true;
        if (dateFilter !== 'all') {
          const articleDt = new Date(`${article.date}T${article.time || '00:00'}`);
          const diffMs = now.getTime() - articleDt.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);

          if (dateFilter === 'today') {
            matchDate = diffDays <= 1;
          } else if (dateFilter === 'week') {
            matchDate = diffDays <= 7;
          } else if (dateFilter === 'month') {
            matchDate = diffDays <= 30;
          } else if (dateFilter === 'custom') {
            if (customDateFrom && article.date < customDateFrom) matchDate = false;
            if (customDateTo && article.date > customDateTo) matchDate = false;
          }
        }

        return matchCat && matchSearch && matchDate;
      })
      .sort((a, b) => {
        if (sortOrder === 'title') {
          return a.title.localeCompare(b.title);
        }
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        const da = new Date(`${a.date}T${timeA}`).getTime();
        const db = new Date(`${b.date}T${timeB}`).getTime();
        return sortOrder === 'newest' ? db - da : da - db;
      });
  }, [articles, selectedCategory, search, sortOrder, dateFilter, customDateFrom, customDateTo]);

  // Pagination calculation: 16 articles per page
  const totalArticles = filteredAndSorted.length;
  const totalPages = Math.ceil(totalArticles / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedArticles = filteredAndSorted.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearch('');
    setDateFilter('all');
    setCustomDateFrom('');
    setCustomDateTo('');
    setSortOrder('newest');
    setCurrentPage(1);
  };

  const isFilteringActive =
    selectedCategory !== 'All' ||
    search !== '' ||
    dateFilter !== 'all' ||
    sortOrder !== 'newest';

  return (
    <div className="min-h-screen bg-dark-100 pb-20">
      {/* Header Banner */}
      <div className="bg-dark-200 border-b border-surface-border py-8 md:py-14">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="section-label mb-3 flex items-center gap-2">
                <Newspaper className="w-3.5 h-3.5 text-primary" />
                {t('nationalWire')}
              </div>
              <h1 className="font-manrope font-black text-3xl sm:text-4xl md:text-5xl text-text-primary mb-3">
                {t('newsHeaderTitle')}
              </h1>
              <p className="text-text-secondary text-sm md:text-base max-w-2xl leading-relaxed">
                {t('newsHeaderSubtitle')}
              </p>
            </div>

            {/* Quick Admin Action */}
            <Link
              to="/admin"
              className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 bg-dark-300 hover:bg-dark-400 border border-surface-border text-text-primary px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-primary" />
              <span>{t('admin')}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-main py-8 sm:py-10">
        {/* Controls Card: Search, Date Filter, Sort & Category Pills */}
        <div className="card p-4 sm:p-6 bg-dark-200/95 border-surface-border mb-8 space-y-4 shadow-card">
          {/* Top Row: Search + Sort + Date Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="text"
                placeholder={t('searchNews')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-300 border border-surface-border focus:border-primary rounded-xl pl-10 pr-10 py-3 text-text-primary placeholder-text-muted text-xs sm:text-sm focus:outline-none transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded-full hover:bg-dark-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date-wise Filter Dropdown */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-1.5 bg-dark-300 border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-secondary">
                <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="text-text-muted font-medium shrink-0">{t('dateFilter')}:</span>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  aria-label="Filter news by date"
                  className="bg-transparent text-text-primary font-semibold text-xs focus:outline-none cursor-pointer w-full"
                >
                  <option value="all" className="bg-dark-300 text-white">{t('allDates')}</option>
                  <option value="today" className="bg-dark-300 text-white">{t('past24h')}</option>
                  <option value="week" className="bg-dark-300 text-white">{t('pastWeek')}</option>
                  <option value="month" className="bg-dark-300 text-white">{t('pastMonth')}</option>
                  <option value="custom" className="bg-dark-300 text-white">{t('customRange')}</option>
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-1.5 bg-dark-300 border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-secondary">
                <ArrowUpDown className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-text-muted font-medium shrink-0">{t('sortBy')}:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  aria-label="Sort news articles"
                  className="bg-transparent text-text-primary font-semibold text-xs focus:outline-none cursor-pointer w-full"
                >
                  <option value="newest" className="bg-dark-300 text-white">{t('newestFirst')}</option>
                  <option value="oldest" className="bg-dark-300 text-white">{t('oldestFirst')}</option>
                  <option value="title" className="bg-dark-300 text-white">{t('alphabetical')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Custom Date Range Picker (Shown if 'custom' is selected) */}
          <AnimatePresence>
            {dateFilter === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 border-t border-surface-border/60 flex flex-wrap items-center gap-3"
              >
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <CalendarRange className="w-4 h-4 text-primary" />
                  <span>From:</span>
                  <input
                    type="date"
                    value={customDateFrom}
                    onChange={(e) => setCustomDateFrom(e.target.value)}
                    className="bg-dark-300 border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>To:</span>
                  <input
                    type="date"
                    value={customDateTo}
                    onChange={(e) => setCustomDateTo(e.target.value)}
                    className="bg-dark-300 border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filter Pills & Results info - Clean Wrap Zero Overflow */}
          <div className="pt-3 border-t border-surface-border/60 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span>Categories:</span>
              </div>
              {isFilteringActive && (
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> {t('resetFilters')}
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {newsCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
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

        {/* Results Counter & Pagination Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>
              Showing <strong className="text-text-primary">{startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, totalArticles)}</strong> of{' '}
              <strong className="text-primary">{totalArticles}</strong>
            </span>
            <span className="bg-dark-300 px-2 py-0.5 rounded text-[10px] text-text-secondary border border-surface-border">
              {t('pageOf')} {currentPage} / {totalPages}
            </span>
          </div>
        </div>

        {/* Dynamic News Grid (16 items per page) */}
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginatedArticles.map((article, i) => (
              <NewsCard key={article.id} article={article} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-muted card bg-dark-200/60 border-surface-border">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
            <p className="text-base font-bold text-text-primary">{t('noNewsFound')}</p>
            <button
              onClick={resetAllFilters}
              className="mt-4 btn-secondary text-xs px-4 py-2 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t('resetFilters')}
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* PAGINATION CONTROLS (16 News Per Page) */}
        {/* ==================================================== */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-dark-200 rounded-2xl border border-surface-border">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-surface-border bg-dark-300 hover:bg-dark-400 disabled:opacity-40 disabled:cursor-not-allowed text-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('previousPage')}</span>
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${
                    currentPage === pageNum
                      ? 'bg-primary text-white border-primary shadow-glow-red'
                      : 'bg-dark-300 text-text-secondary hover:bg-dark-400 hover:text-white border-surface-border'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-surface-border bg-dark-300 hover:bg-dark-400 disabled:opacity-40 disabled:cursor-not-allowed text-text-primary"
            >
              <span>{t('nextPage')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
