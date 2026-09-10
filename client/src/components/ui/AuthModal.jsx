import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, MapPin, LogIn, UserPlus, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const sriLankaDistricts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
  'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya', 'Diaspora (Overseas)'
];

export default function AuthModal() {
  const { isAuthModalOpen, authMode, setAuthMode, closeAuthModal, login, register, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [loading, setLoading] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 800);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    setTimeout(() => {
      register(name, email, district, password);
      setLoading(false);
    }, 800);
  };

  const selectGoogleAccount = (acc) => {
    setLoading(true);
    setTimeout(() => {
      loginWithGoogle(acc);
      setShowGooglePicker(false);
      setLoading(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={closeAuthModal}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-dark-200 border-2 border-primary/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Top Red Glow Accent */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-text-muted hover:text-white rounded-full bg-dark-300 hover:bg-dark-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> PeopleFirst Community
            </div>
            <h2 className="font-manrope font-black text-2xl text-white">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-text-muted text-xs">
              {authMode === 'login'
                ? 'Sign in to vote for awards, like news, and nominate achievers.'
                : 'Join Sri Lanka\'s leading civic recognition platform.'}
            </p>
          </div>

          {/* Google Sign-in Primary Button */}
          <div className="space-y-4 mb-5">
            <button
              type="button"
              onClick={() => setShowGooglePicker(true)}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{authMode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-surface-border w-full" />
              <span className="bg-dark-200 px-3 text-[11px] text-text-muted uppercase tracking-wider font-semibold shrink-0">
                or with email
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-dark-300 p-1 rounded-xl mb-5 border border-surface-border">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMode === 'login'
                  ? 'bg-primary text-white shadow-glow-red'
                  : 'text-text-secondary hover:text-white'
                }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Login
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMode === 'register'
                  ? 'bg-primary text-white shadow-glow-red'
                  : 'text-text-secondary hover:text-white'
                }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Sign Up
            </button>
          </div>

          {/* Forms */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-3 rounded-xl font-bold text-sm shadow-glow-red"
              >
                {loading ? 'Signing in...' : 'Sign In to Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kasun Kalhara"
                    className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Native District / Region
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none transition-all appearance-none"
                  >
                    {sriLankaDistricts.map((d) => (
                      <option key={d} value={d} className="bg-dark-200">
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-3 rounded-xl font-bold text-sm shadow-glow-red"
              >
                {loading ? 'Creating account...' : 'Create PeopleFirst Account'}
              </button>
            </form>
          )}

          {/* Google OAuth Account Picker Dialog (Client UI ready for backend integration) */}
          <AnimatePresence>
            {showGooglePicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="absolute inset-0 bg-dark-100/98 backdrop-blur-xl z-30 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span className="font-bold text-sm text-white">Sign in with Google</span>
                    </div>
                    <button
                      onClick={() => setShowGooglePicker(false)}
                      className="p-1 rounded-full text-text-muted hover:text-white hover:bg-dark-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-1">
                    <h3 className="font-manrope font-bold text-base text-white">Choose an account</h3>
                    <p className="text-xs text-text-muted">to continue to <strong className="text-white">PeopleFirst Media</strong></p>
                  </div>

                  {/* Preset Google Accounts */}
                  <div className="mt-5 space-y-2">
                    {[
                      {
                        name: 'Kasun Kalhara',
                        email: 'kasun.kalhara@gmail.com',
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
                        district: 'Colombo'
                      },
                      {
                        name: 'Dr. Nilanthi Jayasinghe',
                        email: 'nilanthi.med@gmail.com',
                        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120',
                        district: 'Kandy'
                      },
                      {
                        name: 'Arjuna Silva',
                        email: 'arjuna.silva@gmail.com',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
                        district: 'Galle'
                      }
                    ].map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => selectGoogleAccount(acc)}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-dark-200 hover:bg-dark-300 border border-surface-border transition-all text-left group"
                      >
                        <img src={acc.avatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-surface-border group-hover:ring-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">{acc.name}</p>
                          <p className="text-[11px] text-text-muted truncate">{acc.email}</p>
                        </div>
                        <span className="text-[10px] bg-dark-400 text-text-secondary px-2 py-0.5 rounded font-mono shrink-0">Google</span>
                      </button>
                    ))}
                  </div>

                  {/* Or Custom Google Email input */}
                  <div className="mt-4 pt-3 border-t border-surface-border">
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Use another Google account:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="flex-1 bg-dark-300 border border-surface-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        disabled={!customGoogleEmail || !customGoogleEmail.includes('@')}
                        onClick={() => selectGoogleAccount({
                          name: customGoogleEmail.split('@')[0].replace('.', ' '),
                          email: customGoogleEmail,
                          district: 'Colombo',
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
                        })}
                        className="btn-primary text-xs px-3 py-1.5 font-bold disabled:opacity-40"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-border/60 text-[10px] text-text-muted flex items-center justify-between">
                  <span>Google OAuth 2.0 Client Interface</span>
                  <span className="text-primary font-medium">Ready for Server API</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
