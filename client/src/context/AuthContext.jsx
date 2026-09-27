import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api, { getToken, setToken, removeToken } from '../services/api';

const AuthContext = createContext();

// ─── localStorage key for persisted user object ───────────────────────────────
const USER_KEY   = 'pf_user';
const VERIFY_KEY = 'pf_pending_verify';

export function AuthProvider({ children }) {
  const [user, setUser]                                   = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen]             = useState(false);
  const [authMode, setAuthMode]                           = useState('login');
  const [isRecommendModalOpen, setIsRecommendModalOpen]   = useState(false);
  const [pendingVerifyEmail, setPendingVerifyEmail]       = useState(null);
  const [authLoading, setAuthLoading]                     = useState(true);

  // Navigate ref registered by AuthModal / Admin for post-auth redirect
  const postAuthNavigateRef = useRef(null);

  // ── Bootstrap – restore session from stored JWT ─────────────────────────────
  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      const saved = localStorage.getItem(USER_KEY);
      if (token && saved) {
        try {
          setUser(JSON.parse(saved));
          // Re-validate token with server
          const res = await api.get('/auth/me');
          if (res.success) _persistUser(res.user);
        } catch {
          // Token expired / invalid
          _clearSession();
        }
      }
      // Restore pending verify state
      const pending = localStorage.getItem(VERIFY_KEY);
      if (pending) setPendingVerifyEmail(pending);
      setAuthLoading(false);
    };
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const _persistUser = (u) => {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const _clearSession = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem(USER_KEY);
  };

  const _redirectForRole = (role) => {
    if (postAuthNavigateRef.current) {
      postAuthNavigateRef.current(role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  // ── REGISTER ─────────────────────────────────────────────────────────────────
  const register = async ({ name, email, password, whatsapp, district, address }) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, whatsapp, district, address });
      if (!res.success) return { success: false, message: res.message };

      if (res.token && res.user) {
        setToken(res.token);
        _persistUser(res.user);
        setIsAuthModalOpen(false);
        setPendingVerifyEmail(null);
        localStorage.removeItem(VERIFY_KEY);
        _redirectForRole(res.user.role);
        return { success: true, user: res.user, verified: true };
      }
      return { success: true, verified: true };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed. Please try again.' };
    }
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (!res.success) return { success: false, message: res.message };

      setToken(res.token);
      _persistUser(res.user);
      setIsAuthModalOpen(false);
      setPendingVerifyEmail(null);
      localStorage.removeItem(VERIFY_KEY);
      _redirectForRole(res.user.role);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed. Please check your credentials.' };
    }
  };

  // ── EMAIL VERIFICATION (via backend token link) ───────────────────────────────
  /**
   * Called when user clicks the link in their verification email.
   * The link opens the client at /verify-email?token=XXX&email=YYY
   * This function sends those params to the backend and logs the user in.
   */
  const verifyEmail = async (token, email) => {
    try {
      const res = await api.get(`/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`);
      if (!res.success) return { success: false, message: res.message };

      setToken(res.token);
      _persistUser(res.user);
      setPendingVerifyEmail(null);
      localStorage.removeItem(VERIFY_KEY);
      setIsAuthModalOpen(false);
      _redirectForRole(res.user.role);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Verification failed.' };
    }
  };

  // ── RESEND VERIFICATION EMAIL ─────────────────────────────────────────────────
  const resendVerificationEmail = async (email) => {
    try {
      const res = await api.post('/auth/resend-verification', { email });
      return { success: res.success, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Could not resend email.' };
    }
  };

  // ── GOOGLE LOGIN (real backend call) ──────────────────────────────────────
  const loginWithGoogle = async (googleCredential) => {
    try {
      const res = await api.post('/auth/google', { credential: googleCredential });
      if (!res.success) return { success: false, message: res.message };

      setToken(res.token);
      _persistUser(res.user);
      setIsAuthModalOpen(false);
      setPendingVerifyEmail(null);
      localStorage.removeItem(VERIFY_KEY);
      _redirectForRole(res.user.role);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, message: err.message || 'Google sign-in failed.' };
    }
  };

  // ── UPDATE PROFILE ────────────────────────────────────────────────────────────
  const updateUserProfile = async (updatedFields) => {
    try {
      const res = await api.put('/users/profile', updatedFields);
      if (res.success) _persistUser({ ...user, ...res.user });
      return { success: res.success, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Profile update failed.' };
    }
  };

  // ── UPLOAD AVATAR ─────────────────────────────────────────────────────────────
  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.upload('/users/avatar', formData);
      if (res.success) _persistUser({ ...user, avatar: res.avatarUrl });
      return { success: res.success, avatarUrl: res.avatarUrl, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Avatar upload failed.' };
    }
  };

  // ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      return { success: res.success, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Password change failed.' };
    }
  };

  // ── LOGOUT ────────────────────────────────────────────────────────────────────
  const logout = () => {
    _clearSession();
    if (postAuthNavigateRef.current) {
      postAuthNavigateRef.current('/');
    }
  };

  // ── MODAL CONTROLS ────────────────────────────────────────────────────────────
  const openAuthModal  = (mode = 'login') => { setAuthMode(mode); setIsAuthModalOpen(true); };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openRecommendModal  = () => { if (!user) openAuthModal('login'); else setIsRecommendModalOpen(true); };
  const closeRecommendModal = () => setIsRecommendModalOpen(false);

  // ── NAVIGATE REGISTRATION ─────────────────────────────────────────────────────
  const registerPostAuthNavigate   = (fn) => { postAuthNavigateRef.current = fn; };
  const unregisterPostAuthNavigate = ()   => { postAuthNavigateRef.current = null; };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        isRecommendModalOpen,
        openRecommendModal,
        closeRecommendModal,
        pendingVerifyEmail,
        authLoading,
        login,
        register,
        verifyEmail,
        resendVerificationEmail,
        loginWithGoogle,
        updateUserProfile,
        uploadAvatar,
        changePassword,
        logout,
        registerPostAuthNavigate,
        unregisterPostAuthNavigate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
