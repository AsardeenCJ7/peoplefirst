import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

const INTRO_ENABLED_KEY = 'pf_intro_animation_enabled';
const INTRO_DURATION_KEY = 'pf_intro_animation_duration';
const INTRO_SEEN_KEY = 'pf_intro_seen_session';

export function isIntroEnabled() {
  try {
    const raw = localStorage.getItem(INTRO_ENABLED_KEY);
    return raw === null ? true : raw === 'true';
  } catch {
    return true;
  }
}

export function setIntroEnabled(val) {
  try {
    localStorage.setItem(INTRO_ENABLED_KEY, String(val));
  } catch {}
}

export function getIntroDuration() {
  try {
    const raw = localStorage.getItem(INTRO_DURATION_KEY);
    const parsed = parseFloat(raw);
    return isNaN(parsed) || parsed < 2 ? 4.5 : parsed;
  } catch {
    return 4.5;
  }
}

export function setIntroDuration(seconds) {
  try {
    localStorage.setItem(INTRO_DURATION_KEY, String(seconds));
  } catch {}
}

export function clearIntroSeenFlag() {
  try {
    sessionStorage.removeItem(INTRO_SEEN_KEY);
  } catch {}
}

export default function IntroAnimation({ onComplete }) {
  const [visible, setVisible] = useState(false);
  // phase: 0 = curtains closed & logo glowing, 1 = brand typography emerges, 2 = tagline & gold pulse, 3 = slow cloth curtain parting, 4 = complete
  const [phase, setPhase] = useState(0);
  const location = useLocation();

  const startAnimation = useCallback(() => {
    setVisible(true);
    setPhase(0);

    const totalDur = getIntroDuration(); // in seconds
    const totalMs = totalDur * 1000;

    // Proportional cinematic timeline based on Admin-configured duration
    const t1 = setTimeout(() => setPhase(1), totalMs * 0.18);
    const t2 = setTimeout(() => setPhase(2), totalMs * 0.42);
    const t3 = setTimeout(() => setPhase(3), totalMs * 0.65);
    const t4 = setTimeout(() => {
      setVisible(false);
      setPhase(4);
      onComplete?.();
    }, totalMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setPhase(3);
    setTimeout(() => {
      setVisible(false);
      setPhase(4);
      onComplete?.();
    }, 600);
  };

  useEffect(() => {
    const handleCustomTrigger = () => {
      startAnimation();
    };

    window.addEventListener('play-intro-animation', handleCustomTrigger);

    // Check if enabled by Admin
    const enabled = isIntroEnabled();
    const isHomePage = location.pathname === '/';

    if (enabled && isHomePage) {
      startAnimation();
    } else {
      onComplete?.();
    }

    return () => {
      window.removeEventListener('play-intro-animation', handleCustomTrigger);
    };
  }, [location.pathname, startAnimation, onComplete]);

  if (!visible) return null;

  const isParting = phase >= 3;
  const partingDuration = Math.max(1.4, getIntroDuration() * 0.35);

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none w-screen h-screen"
      style={{ pointerEvents: isParting ? 'none' : 'auto' }}
    >
      {/* ── THEATRICAL TOP VALANCE / DRAPERY SWAG (FULLY RESPONSIVE) ──────── */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: isParting ? -120 : 0, opacity: isParting ? 0 : 1 }}
        transition={{ duration: partingDuration * 0.7, ease: [0.65, 0, 0.35, 1] }}
        className="absolute top-0 left-0 right-0 h-12 sm:h-16 z-30 pointer-events-none overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(140, 10, 30, 0.96) 0%, rgba(60, 5, 15, 0.85) 75%, transparent 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.85)',
        }}
      >
        <div className="w-full h-full flex justify-around items-end pb-1 opacity-60">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-8 sm:w-12 h-4 sm:h-6 rounded-b-full border-b-2 border-gold/40 shadow-[0_2px_8px_rgba(244,169,0,0.3)]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(200, 20, 50, 0.4) 0%, rgba(244, 169, 0, 0.15) 100%)',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ── LEFT CLOTH / VELVET THEATER CURTAIN ───────────────────────────── */}
      <motion.div
        initial={{ x: '0%', scaleX: 1, skewY: 0 }}
        animate={{
          x: isParting ? '-105%' : '0%',
          scaleX: isParting ? 0.75 : 1,
          skewY: isParting ? -2 : 0,
        }}
        transition={{
          duration: partingDuration,
          ease: [0.65, 0.05, 0.36, 1],
        }}
        style={{ originX: 0 }}
        className="absolute top-0 bottom-0 left-0 w-1/2 z-10 overflow-hidden"
      >
        {/* Deep Ruby Velvet Cloth Base */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              'linear-gradient(135deg, #180308 0%, #3a0812 35%, #1f040a 70%, #0a0103 100%)',
          }}
        />

        {/* Vertical Cloth Pleats */}
        <div
          className="absolute inset-0 w-full h-full opacity-75"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.75) 0px,
              rgba(255, 60, 80, 0.08) 14px,
              rgba(255, 255, 255, 0.12) 28px,
              rgba(200, 20, 40, 0.05) 42px,
              rgba(0, 0, 0, 0.8) 56px
            )`,
          }}
        />

        {/* Silk Lustre Overlay */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 80% at 75% 45%, rgba(244, 169, 0, 0.25) 0%, rgba(200, 16, 46, 0.3) 40%, transparent 80%)',
          }}
        />

        {/* Embroidered Gold Fringe Seam */}
        <div className="absolute top-0 bottom-0 right-0 w-2.5 sm:w-3 bg-gradient-to-l from-gold/70 via-gold/30 to-transparent shadow-[0_0_20px_rgba(244,169,0,0.6)]">
          <div
            className="w-full h-full opacity-70"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #F4A900 0px, #F4A900 4px, transparent 4px, transparent 10px)',
            }}
          />
        </div>
      </motion.div>

      {/* ── RIGHT CLOTH / VELVET THEATER CURTAIN ──────────────────────────── */}
      <motion.div
        initial={{ x: '0%', scaleX: 1, skewY: 0 }}
        animate={{
          x: isParting ? '105%' : '0%',
          scaleX: isParting ? 0.75 : 1,
          skewY: isParting ? 2 : 0,
        }}
        transition={{
          duration: partingDuration,
          ease: [0.65, 0.05, 0.36, 1],
        }}
        style={{ originX: 1 }}
        className="absolute top-0 bottom-0 right-0 w-1/2 z-10 overflow-hidden"
      >
        {/* Deep Ruby Velvet Cloth Base */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              'linear-gradient(225deg, #180308 0%, #3a0812 35%, #1f040a 70%, #0a0103 100%)',
          }}
        />

        {/* Vertical Cloth Pleats */}
        <div
          className="absolute inset-0 w-full h-full opacity-75"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.8) 0px,
              rgba(200, 20, 40, 0.05) 14px,
              rgba(255, 255, 255, 0.12) 28px,
              rgba(255, 60, 80, 0.08) 42px,
              rgba(0, 0, 0, 0.75) 56px
            )`,
          }}
        />

        {/* Silk Lustre Overlay */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 80% at 25% 45%, rgba(244, 169, 0, 0.25) 0%, rgba(200, 16, 46, 0.3) 40%, transparent 80%)',
          }}
        />

        {/* Embroidered Gold Fringe Seam */}
        <div className="absolute top-0 bottom-0 left-0 w-2.5 sm:w-3 bg-gradient-to-r from-gold/70 via-gold/30 to-transparent shadow-[0_0_20px_rgba(244,169,0,0.6)]">
          <div
            className="w-full h-full opacity-70"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #F4A900 0px, #F4A900 4px, transparent 4px, transparent 10px)',
            }}
          />
        </div>
      </motion.div>

      {/* ── CENTER VERTICAL GOLDEN BEAM ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isParting ? [1, 0] : [0.5, 1, 0.6],
          scaleY: 1,
        }}
        transition={{
          opacity: { repeat: isParting ? 0 : Infinity, duration: 1.6, ease: 'easeInOut' },
        }}
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-primary via-gold to-primary z-20 pointer-events-none shadow-[0_0_30px_rgba(244,169,0,0.9)]"
      />

      {/* ── CENTER EMBLEM, LOGO, BRAND TYPOGRAPHY (RESPONSIVE) ─────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{
          opacity: isParting ? 0 : 1,
          scale: isParting ? 1.05 : 1,
        }}
        transition={{
          opacity: { duration: partingDuration * 0.5 },
          scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        }}
        className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4 max-w-full"
      >
        {/* Ambient Backlight Halo */}
        <div
          className="absolute w-72 sm:w-96 md:w-[540px] h-72 sm:h-96 md:h-[540px] rounded-full pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(circle, rgba(200, 16, 46, 0.35) 0%, rgba(244, 169, 0, 0.18) 45%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Center Circular Emblem with Golden Shimmer */}
        <div className="relative flex items-center justify-center">
          {/* Gentle slow pulsating aura rings */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-36 sm:w-48 h-36 sm:h-48 rounded-full border border-primary/40 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [1.1, 1.35, 1.1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute w-44 sm:w-60 h-44 sm:h-60 rounded-full border border-gold/30 pointer-events-none"
          />

          {/* Logo Frame */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 15 }}
            animate={{
              scale: phase >= 1 ? 1 : 1.05,
              opacity: 1,
              y: phase >= 1 ? -10 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative p-1 sm:p-1.5 rounded-full bg-gradient-to-tr from-primary via-gold to-primary shadow-[0_0_60px_rgba(200,16,46,0.65)]">
              <img
                src={logo}
                alt="PeopleFirst Media Channel"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-[#140306]"
              />

              {/* Slow orbital rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2 sm:-inset-3 rounded-full border-2 border-dashed border-gold/50 pointer-events-none"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 sm:-inset-5 rounded-full border border-primary/40 pointer-events-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Brand Name Typography */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mt-4 sm:mt-6 text-center max-w-full px-2"
            >
              <h1 className="font-manrope font-black text-2xl sm:text-4xl md:text-5xl tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                People<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-primary to-gold">First</span>
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <span className="h-[1px] w-5 sm:w-8 bg-gold/50" />
                <p className="text-[10px] sm:text-xs md:text-sm font-black tracking-[0.3em] sm:tracking-[0.4em] text-gold uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  Media Channel
                </p>
                <span className="h-[1px] w-5 sm:w-8 bg-gold/50" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tagline Badge */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-3 sm:mt-4 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/50 border border-gold/40 backdrop-blur-md shadow-2xl flex items-center gap-1.5 sm:gap-2 max-w-[92vw]"
            >
              <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-gold animate-spin-slow shrink-0" />
              <span className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide text-gray-200 truncate">
                Celebrating Sri Lankan Achievers
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slow Progress Indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 w-full max-w-[240px] px-4">
          <div className="w-full h-1 sm:h-1.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-gold/20 shadow-inner">
            <motion.div
              initial={{ width: '0%' }}
              animate={{
                width: phase >= 3 ? '100%' : phase === 2 ? '85%' : phase === 1 ? '45%' : '15%',
              }}
              transition={{ duration: partingDuration * 0.8, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-primary via-gold to-primary rounded-full shadow-[0_0_15px_rgba(244,169,0,0.9)]"
            />
          </div>
          <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-gray-400 whitespace-nowrap">
            {phase >= 3 ? 'Opening Experience...' : 'Opening Curtains...'}
          </span>
        </div>
      </motion.div>

      {/* ── SKIP BUTTON (RESPONSIVE) ───────────────────────────────────────── */}
      {!isParting && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleSkip}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 z-40 pointer-events-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-black/70 hover:bg-black/90 border border-gold/30 hover:border-gold/60 text-gray-200 hover:text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all backdrop-blur-md flex items-center gap-1.5 shadow-2xl group"
        >
          <span>Skip</span>
          <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 group-hover:translate-x-1 transition-transform text-gold" />
        </motion.button>
      )}
    </div>
  );
}
