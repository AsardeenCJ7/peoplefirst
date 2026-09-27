import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Lock, User, MapPin, Phone, Home as HomeIcon,
  LogIn, UserPlus, Sparkles, Eye, EyeOff, AlertCircle, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
  'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya', 'Diaspora (Overseas)',
];

function PasswordInput({ value, onChange, placeholder = '••••••••', id, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      <input
        id={id}
        type={show ? 'text' : 'password'}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-10 py-3 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
        tabIndex={-1}
        disabled={disabled}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function Field({ label, required: req, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary mb-1.5">
        {label}{req && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AuthModal() {
  const {
    isAuthModalOpen, authMode, setAuthMode, closeAuthModal,
    login, register,
    loginWithGoogle,
    registerPostAuthNavigate, unregisterPostAuthNavigate,
  } = useAuth();

  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  useEffect(() => {
    registerPostAuthNavigate(navigate);
    return () => unregisterPostAuthNavigate();
  }, [navigate, registerPostAuthNavigate, unregisterPostAuthNavigate]);

  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName,     setRegName]     = useState('');
  const [regEmail,    setRegEmail]    = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regDistrict, setRegDistrict] = useState('Colombo');
  const [regAddress,  setRegAddress]  = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  useEffect(() => {
    if (!isAuthModalOpen) {
      setError('');
    }
  }, [isAuthModalOpen]);

  // ── Google Sign-In initialization ───────────────────────────────────────────
  const handleGoogleResponse = useCallback(async (response) => {
    setError('');
    setLoading(true);
    try {
      const result = await loginWithGoogle(response.credential);
      if (result && !result.success) {
        setError(result.message || 'Google sign-in failed.');
      }
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') return;
    if (!window.google) return;
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: authMode === 'login' ? 'signin_with' : 'signup_with',
          shape: 'rectangular',
          width: googleBtnRef.current.offsetWidth || 360,
        });
      }
    } catch {
      // Ignore GIS init errors
    }
  }, [isAuthModalOpen, authMode, handleGoogleResponse]);

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError('');
    if (mode === 'login') {
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegWhatsapp('');
      setRegDistrict('Colombo');
      setRegAddress('');
    }
  };

  const handleClose = () => {
    closeAuthModal();
    setError('');
  };

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim() || !loginPassword) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await login(loginEmail.trim(), loginPassword);
      if (!result.success) {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setError('Please fill in all required fields (Name, Email, Password).');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        whatsapp: regWhatsapp.trim(),
        district: regDistrict,
        address: regAddress.trim(),
      });
      if (!result.success) {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50';

  const hasGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={handleClose}
        />
        <motion.div
          key="auth-modal"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-dark-200 border border-primary/30 rounded-3xl shadow-2xl z-10 overflow-hidden"
          style={{ maxHeight: '92vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 text-text-muted hover:text-white rounded-full bg-dark-300/80 hover:bg-dark-400 transition-all border border-surface-border/50"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8">
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> PeopleFirst
                </div>
                <h2 className="font-manrope font-black text-2xl text-white">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-text-muted text-xs">
                  {authMode === 'login'
                    ? 'Sign in to access your PeopleFirst account.'
                    : "Join Sri Lanka's leading civic recognition platform."}
                </p>
              </div>

              <div className="flex bg-dark-300 p-1 rounded-xl mb-5 border border-surface-border gap-1">
                {[
                  { mode: 'login', icon: LogIn, label: 'Sign In' },
                  { mode: 'register', icon: UserPlus, label: 'Sign Up' },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => switchMode(mode)}
                    disabled={loading}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      authMode === mode
                        ? 'bg-primary text-white shadow-glow-red'
                        : 'text-text-secondary hover:text-white hover:bg-dark-400/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>

              {/* ── Google Sign-In ──────────────────────────────── */}
              {hasGoogleClientId ? (
                <>
                  <div
                    ref={googleBtnRef}
                    id="google-signin-btn"
                    className="w-full flex justify-center mb-4 min-h-[40px]"
                  />
                  <div className="relative flex items-center mb-4">
                    <div className="flex-1 border-t border-surface-border" />
                    <span className="px-3 text-[11px] text-text-muted uppercase tracking-wider font-semibold bg-dark-200">or</span>
                    <div className="flex-1 border-t border-surface-border" />
                  </div>
                </>
              ) : null}

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300 leading-relaxed">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {authMode === 'login' && (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                  id="login-form"
                  noValidate
                >
                  <Field label="Email Address" required>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={loading}
                        autoComplete="email"
                        className={inp}
                      />
                    </div>
                  </Field>

                  <Field label="Password" required>
                    <PasswordInput
                      id="login-password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    id="login-submit-btn"
                    className="w-full btn-primary justify-center py-3.5 rounded-xl font-bold text-sm shadow-glow-red mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Signing in...</span>
                      : <span className="flex items-center gap-2"><LogIn className="w-4 h-4" /> Sign In</span>
                    }
                  </button>

                  <p className="text-center text-xs text-text-muted pt-1">
                    Do not have an account?{' '}
                    <button type="button" onClick={() => switchMode('register')} className="text-primary font-semibold hover:underline" disabled={loading}>
                      Create one free
                    </button>
                  </p>
                </motion.form>
              )}

              {authMode === 'register' && (
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  onSubmit={handleRegister}
                  className="space-y-3.5"
                  id="register-form"
                  noValidate
                >
                  <Field label="Full Name" required>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="e.g. Kasun Perera"
                        disabled={loading}
                        autoComplete="name"
                        className={inp}
                      />
                    </div>
                  </Field>

                  <Field label="Email Address" required>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={loading}
                        autoComplete="email"
                        className={inp}
                      />
                    </div>
                  </Field>

                  <Field label="Password" required>
                    <PasswordInput
                      id="reg-password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      disabled={loading}
                    />
                  </Field>

                  <Field label="WhatsApp / Phone Number">
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      <input
                        id="reg-whatsapp"
                        type="tel"
                        value={regWhatsapp}
                        onChange={e => setRegWhatsapp(e.target.value)}
                        placeholder="+94 77 123 4567 (optional)"
                        disabled={loading}
                        className={inp}
                      />
                    </div>
                  </Field>

                  <Field label="District" required>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                      <select
                        id="reg-district"
                        value={regDistrict}
                        onChange={e => setRegDistrict(e.target.value)}
                        disabled={loading}
                        className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none disabled:opacity-50"
                      >
                        {SRI_LANKA_DISTRICTS.map(d => (
                          <option key={d} value={d} className="bg-dark-200">{d}</option>
                        ))}
                      </select>
                    </div>
                  </Field>

                  <Field label="Address">
                    <div className="relative">
                      <HomeIcon className="absolute left-3.5 top-3 w-4 h-4 text-text-muted pointer-events-none" />
                      <textarea
                        id="reg-address"
                        value={regAddress}
                        onChange={e => setRegAddress(e.target.value)}
                        placeholder="No. 12, Main Street, Colombo 03 (optional)"
                        rows={2}
                        disabled={loading}
                        className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none disabled:opacity-50"
                      />
                    </div>
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    id="register-submit-btn"
                    className="w-full btn-primary justify-center py-3.5 rounded-xl font-bold text-sm shadow-glow-red disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Creating account...</span>
                      : <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Create Account</span>
                    }
                  </button>

                  <p className="text-center text-xs text-text-muted pt-1">
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('login')} className="text-primary font-semibold hover:underline" disabled={loading}>
                      Sign in
                    </button>
                  </p>
                </motion.form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
