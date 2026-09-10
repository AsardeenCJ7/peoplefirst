import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, BookOpen, Bookmark, BookmarkCheck,
  Maximize2, Minimize2, Volume2, VolumeX, Lock, LogIn, Sparkles, ChevronDown
} from 'lucide-react';
import CommentSection from './CommentSection';
import { useAuth } from '../../context/AuthContext';

// Free pages before login gate
const FREE_PAGE_LIMIT = 4;

// ── Audio ────────────────────────────────────────────────────────────────────
function playFlipSound(ctx, enabled) {
  if (!enabled || !ctx) return;
  try {
    if (ctx.state === 'suspended') ctx.resume();
    const dur = 0.18;
    const sz = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) {
      const t = i / ctx.sampleRate;
      d[i] = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.5
            + Math.sin(2 * Math.PI * 110 * t) * Math.exp(-t * 38) * 0.28;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.85, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (_) {}
}

// ── Page content with visible smooth scrollbar ─────────────────────────────
function PageContent({ page, pageNum, totalPages, achiever, isFinal }) {
  const contentRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const check = () => setHasOverflow(el.scrollHeight > el.clientHeight + 10);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [page, isFinal]);

  if (!page) return null;

  return (
    <div className="h-full flex flex-col min-h-0 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-800/40 pb-2 mb-2 shrink-0 gap-2">
        <span className="text-[11px] sm:text-xs text-amber-400 font-bold tracking-wider uppercase flex items-center gap-1.5 min-w-0">
          <span className="text-sm shrink-0">{page.icon}</span>
          <span className="truncate">{page.title}</span>
        </span>
        <span className="text-[10px] text-amber-500/70 font-mono whitespace-nowrap shrink-0 ml-1">
          {pageNum} / {totalPages}
        </span>
      </div>

      {/* Scrollable text container with visible custom amber scrollbar */}
      <div
        ref={contentRef}
        className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5 sm:space-y-3.5 custom-book-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#B45309 #1C1917',
          touchAction: 'pan-y',
        }}
      >
        {isFinal ? (
          <div className="pb-4">
            <CommentSection achieverId={achiever.id} />
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {page.paragraphs?.map((para, i) => (
              <p
                key={i}
                className={`text-stone-300 text-xs sm:text-[13px] lg:text-sm leading-relaxed font-serif ${
                  i === 0
                    ? 'first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-extrabold first-letter:text-amber-400 first-letter:mr-1.5 first-letter:float-left first-letter:leading-none'
                    : ''
                }`}
              >
                {para}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Subtle bottom scroll prompt if content overflows */}
      {hasOverflow && (
        <div className="shrink-0 flex items-center justify-center gap-1 text-[10px] text-amber-500/60 pt-1 border-t border-amber-900/30 select-none">
          <ChevronDown className="w-3 h-3 animate-bounce" />
          <span>Scroll down for more</span>
        </div>
      )}
    </div>
  );
}

// ── Login Gate Overlay ────────────────────────────────────────────────────────
function LoginGateOverlay({ achieverName, onLogin, onGoBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="absolute inset-0 z-40 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col items-center justify-center px-4"
      style={{ backdropFilter: 'blur(18px)', background: 'rgba(10,8,5,0.95)' }}
    >
      <motion.div
        animate={{ scale: [1, 1.07, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full border-2 border-amber-500/40 pointer-events-none"
        style={{ boxShadow: '0 0 60px 15px rgba(251,191,36,0.10)' }}
      />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center w-full max-w-xs">
        <div className="relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-amber-500/10 border border-amber-700/40 flex items-center justify-center">
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500/70" />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40">
            <Lock className="w-3 h-3 text-stone-950" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-amber-300 font-serif font-bold text-base sm:text-lg leading-tight">
            Continue Reading
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
            {FREE_PAGE_LIMIT} free pages enjoyed. Sign in to unlock
            {' '}{achieverName}&apos;s full story, comments &amp; bookmarks.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onLogin}
            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/30"
          >
            <LogIn className="w-4 h-4" />
            Sign In / Create Free Account
          </motion.button>
          <button
            onClick={onGoBack}
            className="text-stone-500 hover:text-amber-400 text-xs font-medium transition-colors py-1"
          >
            Go back to page {FREE_PAGE_LIMIT}
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-amber-600/60 text-[10px]">
          <Sparkles className="w-3 h-3" />
          <span>Free &middot; No card required</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main FlipBook ─────────────────────────────────────────────────────────────
export default function FlipBook({ achiever }) {
  const { user, openAuthModal } = useAuth();

  const pages = (() => {
    if (achiever?.biographyPages && achiever.biographyPages.length > 0) return achiever.biographyPages;
    if (achiever?.pages && achiever.pages.length > 0) {
      return achiever.pages.map((p) => ({
        title: p.title || 'Chapter',
        icon: p.icon || '📖',
        paragraphs: Array.isArray(p.paragraphs) ? p.paragraphs : [p.text || ''],
      }));
    }
    const bp = (achiever?.bio || '').split('\n\n').filter(Boolean);
    const ac = Array.isArray(achiever?.achievements) ? achiever.achievements : (achiever?.achievements ? String(achiever.achievements).split('\n') : []);
    return [
      { title: 'Early Life & Beginnings', icon: '📖', paragraphs: bp.slice(0, 2).length ? bp.slice(0, 2) : ['Born in Sri Lanka, dedicating life to public impact.'] },
      { title: 'Journey & Contribution', icon: '🌟', paragraphs: bp.slice(2, 4).length ? bp.slice(2, 4) : ['Major milestones achieved across the province.'] },
      { title: 'Key Achievements – Part I', icon: '🏆', paragraphs: ac.slice(0, 3).length ? ac.slice(0, 3) : ['Distinguished community leadership.'] },
      { title: 'Key Achievements – Part II', icon: '🎖️', paragraphs: ac.slice(3).length ? ac.slice(3) : ['Recognized national service.'] },
      { title: 'Historical Impact & Legacy', icon: '🌍', paragraphs: bp.slice(4).length ? bp.slice(4) : ['Inspiring the next generation.'] },
      { title: 'Public Tributes & Community Voice', icon: '💬', paragraphs: [] },
    ];
  })();

  const totalPages   = pages.length;
  const totalSpreads = Math.ceil(totalPages / 2);

  // State
  const [page, setPage]             = useState(0);  // mobile single page (0-based)
  const [spread, setSpread]         = useState(0);  // desktop spread (0-based)
  const [flipDir, setFlipDir]       = useState('next');
  const [maximized, setMaximized]   = useState(false);
  const [soundOn, setSoundOn]       = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bmPage, setBmPage]         = useState(null);
  const [toast, setToast]           = useState(false);
  const [gate, setGate]             = useState(false);

  // Use a ref for the flipping guard so touch handlers always see the current value
  // without stale closure issues (the main cause of page-skip on mobile)
  const flippingRef = useRef(false);
  const [flipping, setFlippingState] = useState(false);
  const setFlipping = (val) => { flippingRef.current = val; setFlippingState(val); };

  const ctxRef      = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const getCtx = () => {
    if (!ctxRef.current)
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  };

  // Dismiss gate on login
  useEffect(() => { if (user) setGate(false); }, [user]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && maximized) setMaximized(false);
      if (e.key === 'ArrowRight' && !flipping && spread < totalSpreads - 1) doDesktopNext();
      if (e.key === 'ArrowLeft'  && !flipping && spread > 0)                doDesktopPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Bookmark load
  useEffect(() => {
    if (!user) { setBookmarked(false); setBmPage(null); return; }
    const key   = `bm_${achiever.id}_${user.email}`;
    const saved = localStorage.getItem(key);
    if (saved != null) { setBookmarked(true); setBmPage(parseInt(saved, 10)); }
    else               { setBookmarked(false); setBmPage(null); }
  }, [user, achiever.id]);

  // Core flip — reads flippingRef (not state) to avoid stale closures
  const doFlip = useCallback((dir, cb) => {
    if (flippingRef.current) return;
    setFlipDir(dir);
    setFlipping(true);
    playFlipSound(getCtx(), soundOn);
    setTimeout(() => { cb(); setFlipping(false); }, 320);
  }, [soundOn]);

  // Gate check (1-based page number)
  const isGated = useCallback((p1) => !user && p1 > FREE_PAGE_LIMIT, [user]);

  // Desktop handlers
  const doDesktopNext = useCallback(() => {
    if (spread >= totalSpreads - 1) return;
    const nextLeft = (spread + 1) * 2 + 1;
    if (isGated(nextLeft)) { setGate(true); return; }
    doFlip('next', () => setSpread(s => s + 1));
  }, [spread, totalSpreads, doFlip, isGated]);

  const doDesktopPrev = useCallback(() => {
    if (spread > 0) doFlip('prev', () => setSpread(s => s - 1));
  }, [spread, doFlip]);

  const jumpSpread = useCallback((idx) => {
    if (flippingRef.current || idx === spread) return;
    if (idx > spread && isGated(idx * 2 + 1)) { setGate(true); return; }
    doFlip(idx > spread ? 'next' : 'prev', () => setSpread(idx));
  }, [spread, isGated, doFlip]);

  // Mobile handlers — accept currentPage as argument to avoid stale closures
  const doMobileNext = useCallback((currentPage) => {
    if (flippingRef.current) return;
    if (currentPage >= totalPages - 1) return;
    if (isGated(currentPage + 2)) { setGate(true); return; }
    doFlip('next', () => setPage(p => p + 1));
  }, [totalPages, isGated, doFlip]);

  const doMobilePrev = useCallback((currentPage) => {
    if (flippingRef.current) return;
    if (currentPage <= 0) return;
    doFlip('prev', () => setPage(p => p - 1));
  }, [doFlip]);

  // Touch swipe — distinguish horizontal swipe from vertical scroll
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - (touchStartY.current ?? 0);
    touchStartX.current = null;
    touchStartY.current = null;
    // Only trigger on clear horizontal swipe (> 50px, more horizontal than vertical)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Use functional setPage to read the true current page without closure issues
      setPage(currentPage => {
        if (dx < 0) doMobileNext(currentPage);
        else        doMobilePrev(currentPage);
        return currentPage; // doMobileNext/Prev handles the actual state update
      });
    }
  }, [doMobileNext, doMobilePrev]);

  const handleGateBack = () => {
    setGate(false);
    const lfs = Math.floor((FREE_PAGE_LIMIT - 1) / 2);
    setSpread(Math.min(lfs, totalSpreads - 1));
    setPage(FREE_PAGE_LIMIT - 1);
  };
  const handleGateLogin = () => { setGate(false); openAuthModal('login'); };

  // Bookmark
  const handleBookmark = () => {
    if (!user) { openAuthModal('login'); return; }
    const key = `bm_${achiever.id}_${user.email}`;
    if (bookmarked) { localStorage.removeItem(key); setBookmarked(false); setBmPage(null); }
    else {
      const pg = page + 1;
      localStorage.setItem(key, pg);
      setBookmarked(true); setBmPage(pg);
      setToast(true);
      setTimeout(() => setToast(false), 2800);
    }
  };
  const goToBookmark = () => {
    if (bmPage == null) return;
    const p0 = bmPage - 1;
    setPage(Math.min(p0, totalPages - 1));
    setSpread(Math.min(Math.floor(p0 / 2), totalSpreads - 1));
  };

  // Derived
  const lIdx = spread * 2;
  const rIdx = spread * 2 + 1;
  const lPage = pages[lIdx] || null;
  const rPage = pages[rIdx] || null;
  const lNum  = lIdx + 1;
  const rNum  = rIdx + 1;

  // ── Toolbar ────────────────────────────────────────────────────────────────
  const Toolbar = ({ max }) => (
    <div className="flex items-center justify-between bg-[#1a1610] border border-amber-800/50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-amber-400 mb-3 gap-2 flex-wrap">
      {/* Title */}
      <div className="flex items-center gap-1.5 font-serif font-bold min-w-0 flex-1">
        <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-xs sm:text-sm truncate">{achiever.name} — Biography</span>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {!user && (
          <span className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-md border border-amber-800/30 bg-amber-900/20 text-amber-500 text-[10px] font-semibold">
            <Lock className="w-2.5 h-2.5" />{FREE_PAGE_LIMIT} Free Pages
          </span>
        )}
        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          title={user ? (bookmarked ? 'Remove bookmark' : 'Bookmark page') : 'Sign in to bookmark'}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            bookmarked ? 'bg-amber-500/25 border-amber-500/70 text-amber-300' : 'bg-amber-500/10 border-amber-800/40 text-amber-500 hover:bg-amber-500/20'
          }`}
        >
          {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Mark'}</span>
        </button>
        {/* Sound */}
        <button
          onClick={() => setSoundOn(s => !s)}
          title={soundOn ? 'Mute page sound' : 'Unmute page sound'}
          className={`flex items-center px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            soundOn ? 'bg-amber-500/10 border-amber-800/40 text-amber-500 hover:bg-amber-500/20' : 'bg-stone-900 border-stone-700 text-stone-500'
          }`}
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
        {/* Maximize (desktop only) */}
        <button
          onClick={() => setMaximized(m => !m)}
          title={max ? 'Exit fullscreen' : 'Fullscreen'}
          className="hidden sm:flex items-center px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-800/40 text-amber-400 font-semibold transition-all text-xs"
        >
          {max ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );

  // ── Mobile view ────────────────────────────────────────────────────────────
  const MobileView = () => (
    <div className="block md:hidden">
      {/* Book card — touchAction pan-y allows inner scroll while outer card handles horizontal swipe */}
      <div
        className="relative rounded-2xl bg-gradient-to-b from-[#130e08] via-[#211a10] to-[#130e08] border-2 border-amber-800/60 shadow-2xl overflow-hidden"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Corners */}
        {['top-2 left-2 border-t-2 border-l-2','top-2 right-2 border-t-2 border-r-2','bottom-2 left-2 border-b-2 border-l-2','bottom-2 right-2 border-b-2 border-r-2'].map((c, i) => (
          <div key={i} className={`absolute w-3.5 h-3.5 border-amber-600/60 ${c} z-10 pointer-events-none`} />
        ))}

        {/* Page area — responsive height so content never gets cut off */}
        <div
          className="relative bg-[#0e0c09] border border-amber-800/30 rounded-xl m-2.5 p-3 sm:p-5 overflow-hidden"
          style={{ minHeight: 'min(500px, 65vh)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-${page}`}
              initial={{ opacity: 0, x: flipDir === 'next' ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: flipDir === 'next' ? -30 : 30 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex flex-col pb-7"
              style={{ minHeight: 'min(460px, 60vh)' }}
            >
              <PageContent
                page={pages[page]}
                pageNum={page + 1}
                totalPages={totalPages}
                achiever={achiever}
                isFinal={page === totalPages - 1}
              />
            </motion.div>
          </AnimatePresence>

          {/* Page number ribbon */}
          <div className="absolute bottom-0 inset-x-0 h-6 flex items-center justify-center border-t border-amber-800/20 text-[10px] text-amber-600/70 font-mono bg-[#0e0c09]">
            — Page {page + 1} of {totalPages} —
          </div>

          {/* Gate */}
          <AnimatePresence>
            {gate && (
              <LoginGateOverlay achieverName={achiever.name} onLogin={handleGateLogin} onGoBack={handleGateBack} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="mt-2.5 bg-[#1a1610] border border-amber-800/50 rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-2">
        <button
          onClick={() => doMobilePrev(page)}
          disabled={page === 0 || flipping}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold select-none transition-all ${
            page === 0 || flipping
              ? 'opacity-30 cursor-not-allowed bg-stone-900 text-stone-600 border border-stone-800'
              : 'bg-amber-500/15 text-amber-400 border border-amber-700/50 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        {/* Dots */}
        <div className="flex gap-1 sm:gap-1.5 items-center flex-wrap justify-center flex-1 px-1">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx === page || flippingRef.current) return;
                if (idx > page && isGated(idx + 1)) { setGate(true); return; }
                doFlip(idx > page ? 'next' : 'prev', () => setPage(idx));
              }}
              aria-label={`Go to page ${idx + 1}`}
              className={`rounded-full transition-all duration-200 ${
                page === idx
                  ? 'w-5 h-2 bg-amber-400'
                  : isGated(idx + 1) && idx > page
                  ? 'w-2 h-2 bg-stone-800 border border-amber-900/40'
                  : 'w-2 h-2 bg-stone-700 hover:bg-amber-700/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => doMobileNext(page)}
          disabled={page === totalPages - 1 || flipping}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold select-none transition-all ${
            page === totalPages - 1 || flipping
              ? 'opacity-30 cursor-not-allowed bg-stone-900 text-stone-600 border border-stone-800'
              : isGated(page + 2)
              ? 'bg-amber-900/30 text-amber-500 border border-amber-800/40'
              : 'bg-amber-400 text-stone-950 font-bold border border-amber-400 active:scale-95'
          }`}
        >
          {isGated(page + 2) ? <><Lock className="w-3.5 h-3.5" /> Login</> : <>Next <ChevronRight className="w-4 h-4" /></>}
        </button>
      </div>

      <p className="text-center text-[10px] text-amber-700/60 mt-1.5">
        Tip: Swipe left/right to turn pages &middot; Scroll inside to read full biography
      </p>
    </div>
  );

  // ── Desktop spread ─────────────────────────────────────────────────────────
  const DesktopSpread = () => (
    <div style={{ perspective: '2000px' }}>
      <div className="relative rounded-2xl bg-gradient-to-r from-[#130e08] via-[#211a10] to-[#130e08] border-4 border-amber-800/60 ring-2 ring-amber-900/30 shadow-2xl p-4 lg:p-6">
        {['top-2 left-2 border-t-2 border-l-2','top-2 right-2 border-t-2 border-r-2','bottom-2 left-2 border-b-2 border-l-2','bottom-2 right-2 border-b-2 border-r-2'].map((c, i) => (
          <div key={i} className={`absolute w-4 h-4 border-amber-600/70 ${c}`} />
        ))}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/70 via-amber-900/40 to-black/70 z-20 pointer-events-none" />

        <div className="grid grid-cols-2 gap-4 lg:gap-6 relative">
          {/* Left page */}
          <div className="bg-[#0e0c09] border border-amber-800/30 rounded-l-xl p-5 lg:p-6 shadow-inner flex flex-col h-[520px] lg:h-[560px]">
            <div className="flex-1 min-h-0">
              <PageContent page={lPage} pageNum={lNum} totalPages={totalPages} achiever={achiever} isFinal={lIdx === totalPages - 1} />
            </div>
            <div className="mt-2 pt-2 border-t border-amber-800/20 text-center text-[10px] text-amber-600/60 font-mono shrink-0">— {lNum} —</div>
          </div>

          {/* Right page */}
          <div className="bg-[#0e0c09] border border-amber-800/30 rounded-r-xl p-5 lg:p-6 shadow-inner flex flex-col h-[520px] lg:h-[560px]">
            <div className="flex-1 min-h-0">
              {rPage ? (
                <PageContent page={rPage} pageNum={rNum} totalPages={totalPages} achiever={achiever} isFinal={rIdx === totalPages - 1} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-amber-600/40">
                  <BookOpen className="w-12 h-12 opacity-30" />
                  <p className="font-serif italic text-base">End of Biographical Manuscript</p>
                  <p className="text-xs text-amber-700/60 text-center px-4">
                    Thank you for reading {achiever.name}&apos;s story.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-amber-800/20 text-center text-[10px] text-amber-600/60 font-mono shrink-0">
              {rPage ? `— ${rNum} —` : '— Fin —'}
            </div>
          </div>

          {/* Flip animation */}
          <AnimatePresence>
            {flipping && (
              <motion.div
                key={`flip-${spread}-${flipDir}`}
                initial={{ rotateY: flipDir === 'next' ? 0 : -180 }}
                animate={{ rotateY: flipDir === 'next' ? -180 : 0 }}
                transition={{ duration: 0.34, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  transformOrigin: flipDir === 'next' ? 'left center' : 'right center',
                  transformStyle: 'preserve-3d',
                  position: 'absolute', top: 0, bottom: 0,
                  left: flipDir === 'next' ? '50%' : '0',
                  right: flipDir === 'next' ? '0' : '50%',
                  zIndex: 30, borderRadius: '0.75rem', overflow: 'hidden',
                }}
                className="bg-[#1a1408] border-2 border-amber-800/50 shadow-2xl"
              >
                <div className="absolute inset-0 bg-[#0e0c09] flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                  <span className="text-amber-500/50 font-serif italic text-sm">✦ Turning Manuscript Page ✦</span>
                </div>
                <div className="absolute inset-0 bg-[#0f0d0a]" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gate */}
          <AnimatePresence>
            {gate && (
              <LoginGateOverlay achieverName={achiever.name} onLogin={handleGateLogin} onGoBack={handleGateBack} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  // ── Desktop nav ────────────────────────────────────────────────────────────
  const DesktopNav = () => (
    <div className="mt-3 bg-[#1a1610] border border-amber-800/50 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
      <button
        onClick={doDesktopPrev}
        disabled={spread === 0 || flipping}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all select-none ${
          spread === 0 ? 'opacity-25 cursor-not-allowed bg-stone-900 text-stone-600 border border-stone-800'
                       : 'bg-amber-500/15 text-amber-400 border border-amber-700/50 hover:bg-amber-500/30 active:scale-95'
        }`}
      >
        <ChevronLeft className="w-4 h-4" /> Turn Back
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalSpreads }).map((_, idx) => {
          const t1 = idx * 2 + 1;
          const locked = isGated(t1) && idx > spread;
          return (
            <button
              key={idx}
              onClick={() => jumpSpread(idx)}
              className={`rounded-full transition-all duration-300 ${
                spread === idx ? 'w-8 h-2.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                : locked       ? 'w-2.5 h-2.5 bg-stone-800 border border-amber-900/40'
                               : 'w-2.5 h-2.5 bg-stone-700 hover:bg-amber-700/50'
              }`}
              title={locked ? `Page ${t1}+ — Sign in to read` : `Pages ${t1} & ${t1 + 1}`}
            />
          );
        })}
        <span className="text-xs text-amber-400 font-mono ml-1 font-bold whitespace-nowrap">
          {lNum}–{Math.min(rNum, totalPages)} / {totalPages}
        </span>
      </div>

      <button
        onClick={doDesktopNext}
        disabled={spread === totalSpreads - 1 || flipping}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all select-none ${
          spread === totalSpreads - 1 ? 'opacity-25 cursor-not-allowed bg-stone-900 text-stone-600 border border-stone-800'
          : isGated(rNum + 1)         ? 'bg-amber-900/30 text-amber-400 border border-amber-800/40 hover:bg-amber-900/50'
                                      : 'bg-amber-400 text-stone-950 font-bold border border-amber-400 hover:bg-amber-300 active:scale-95'
        }`}
      >
        {isGated(rNum + 1) ? (
          <><Lock className="w-4 h-4" /> Sign In to Continue</>
        ) : (
          <>Turn Page <ChevronRight className="w-4 h-4" /></>
        )}
      </button>
    </div>
  );

  return (
    <div className="relative">
      <Toolbar max={maximized} />
      <MobileView />
      <div className="hidden md:block">
        <DesktopSpread />
        <DesktopNav />
      </div>

      {/* Bookmark Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-amber-500 text-stone-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <BookmarkCheck className="w-4 h-4" />
            Bookmarked on Page {bmPage}!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
