import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Globe, ChevronDown, Award, Sparkles, ShieldCheck, LogIn, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.jpeg';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const { user, openAuthModal, openRecommendModal, logout } = useAuth();

  // Fixed English nav links as requested
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Achievers', path: '/achievers' },
    { label: 'Interviews', path: '/interviews' },
    { label: 'News', path: '/news' },
    { label: 'Awards', path: '/awards' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'si', label: 'සිංහල', short: 'සිං' },
    { code: 'ta', label: 'தமிழ்', short: 'த' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-100/95 backdrop-blur-xl border-b border-surface-border shadow-lg'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative">
                <img
                  src={logo}
                  alt="PeopleFirst Media Channel"
                  className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover ring-2 ring-primary/50 group-hover:ring-primary transition-all duration-300"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-dark-100 animate-pulse" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-manrope font-bold text-text-primary text-base leading-tight">
                  People<span className="text-primary">First</span>
                </span>
                <span className="text-text-muted text-[10px] tracking-wider uppercase leading-tight">
                  Media Channel
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links - Fixed in English */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/10 font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-dark-300'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      layoutId="nav-dot"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Icon */}
              {location.pathname !== '/' && (
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-300 rounded-lg transition-all duration-200"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-text-secondary hover:text-text-primary bg-dark-300 hover:bg-dark-400 rounded-lg text-xs font-semibold transition-all duration-200 border border-surface-border"
                >
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>{currentLangObj.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 bg-surface-card border border-surface-border rounded-xl shadow-card overflow-hidden min-w-[130px] z-50 p-1"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setLangOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-colors font-medium ${
                            lang === l.code
                              ? 'bg-primary/20 text-primary font-bold'
                              : 'text-text-secondary hover:text-text-primary hover:bg-dark-300'
                          }`}
                        >
                          <span>{l.label}</span>
                          <span className="text-[10px] text-text-muted uppercase">{l.short}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Recommend Achiever Button */}
              <button
                onClick={openRecommendModal}
                className="hidden sm:flex items-center gap-1.5 btn-gold text-xs px-3 py-2 rounded-lg font-bold shadow-glow-gold"
              >
                <Award className="w-3.5 h-3.5" />
                Suggest Achiever
              </button>

              {/* User Authentication Profile Badge / Login Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-full bg-dark-300 hover:bg-dark-400 border border-surface-border transition-all"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-primary"
                    />
                    <span className="hidden md:inline text-xs font-semibold text-text-primary truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-text-muted" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 bg-surface-card border border-surface-border rounded-xl shadow-card overflow-hidden min-w-[180px] z-50 p-2 space-y-1"
                      >
                        <div className="px-3 py-2 border-b border-surface-border">
                          <p className="font-bold text-xs text-white">{user.name}</p>
                          <p className="text-[10px] text-primary flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {user.district} District
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-dark-300 rounded-lg transition-colors font-semibold"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-primary" /> My Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            openRecommendModal();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-white hover:bg-dark-300 rounded-lg transition-colors font-medium"
                        >
                          <Award className="w-3.5 h-3.5 text-gold" /> Suggest Achiever
                        </button>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-gold hover:bg-gold/10 rounded-lg transition-colors font-semibold"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 btn-primary text-xs px-3.5 py-2 rounded-lg font-bold"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-dark-300 rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Drop-down */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-surface-border bg-dark-100/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="container-main py-4">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search achievers, interviews, news, awards..."
                    autoFocus
                    className="w-full bg-dark-300 border border-surface-border rounded-xl pl-12 pr-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Drawer Menu - Nav links stay in English */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-dark-100 border-l border-surface-border z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-surface-border">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Logo" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/50" />
                  <div>
                    <div className="font-manrope font-bold text-text-primary">People<span className="text-primary">First</span></div>
                    <div className="text-text-muted text-xs tracking-wide">Media Channel</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-dark-300 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {user && (
                  <div className="p-3 bg-dark-200 border border-primary/20 rounded-xl mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-primary" />
                        <div>
                          <div className="text-xs font-bold text-white">{user.name}</div>
                          <div className="text-[10px] text-primary">{user.district} District</div>
                        </div>
                      </div>
                      <button onClick={logout} className="text-xs text-red-400 font-semibold hover:underline">Logout</button>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary font-bold text-xs py-2 rounded-lg transition-all"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      My User Dashboard
                    </Link>
                  </div>
                )}

                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? 'bg-primary/15 text-primary border border-primary/20 font-semibold'
                          : 'text-text-secondary hover:text-text-primary hover:bg-dark-300'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-4 border-t border-surface-border space-y-3">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openRecommendModal();
                  }}
                  className="btn-gold w-full justify-center text-xs py-3 font-bold"
                >
                  <Award className="w-4 h-4" />
                  Suggest Achiever
                </button>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-dark-300 hover:bg-dark-400 border border-surface-border text-gold font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}

                {!user && (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openAuthModal('login');
                    }}
                    className="btn-primary w-full justify-center text-xs py-2.5"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                )}

                <div className="text-xs text-text-muted mb-1 font-semibold uppercase tracking-wider">Select Language</div>
                <div className="flex gap-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all border ${
                        lang === l.code
                          ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                          : 'text-text-secondary bg-dark-300 border-surface-border hover:bg-dark-400'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
