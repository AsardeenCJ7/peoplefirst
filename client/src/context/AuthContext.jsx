import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('peopleFirst_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }
  }, []);

  const login = (email, password) => {
    const isAdmin = email.toLowerCase().includes('admin');
    const mockUser = {
      name: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
      email,
      district: 'Colombo',
      role: isAdmin ? 'admin' : 'reader',
      joinedDate: 'September 2026',
      bio: 'Enthusiastic reader and community contributor on PeopleFirst.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    };
    setUser(mockUser);
    localStorage.setItem('peopleFirst_user', JSON.stringify(mockUser));
    setIsAuthModalOpen(false);
  };

  const register = (name, email, district, password) => {
    const isAdmin = email.toLowerCase().includes('admin');
    const mockUser = {
      name,
      email,
      district: district || 'Colombo',
      role: isAdmin ? 'admin' : 'reader',
      joinedDate: 'September 2026',
      bio: 'Enthusiastic reader and community contributor on PeopleFirst.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    };
    setUser(mockUser);
    localStorage.setItem('peopleFirst_user', JSON.stringify(mockUser));
    setIsAuthModalOpen(false);
  };

  // ── GOOGLE AUTHENTICATION INTERFACE ──────────────────────────────────────────
  // Hook for backend integration:
  // When server-side code is provided, pass credential token:
  // const res = await fetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: credential }) });
  const loginWithGoogle = async (googleProfile = null) => {
    const profile = googleProfile || {
      name: 'Kasun Kalhara',
      email: 'kasun.kalhara@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      district: 'Colombo',
      googleId: 'google-oauth2|' + Date.now(),
    };

    const googleUser = {
      name: profile.name,
      email: profile.email,
      district: profile.district || 'Colombo',
      role: profile.email.toLowerCase().includes('admin') ? 'admin' : 'reader',
      joinedDate: 'September 2026',
      bio: 'Verified community member authenticated via Google.',
      avatar: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      authProvider: 'google',
      googleId: profile.googleId,
    };

    setUser(googleUser);
    localStorage.setItem('peopleFirst_user', JSON.stringify(googleUser));
    setIsAuthModalOpen(false);
    return googleUser;
  };

  const updateUserProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('peopleFirst_user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('peopleFirst_user');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openRecommendModal = () => {
    if (!user) {
      openAuthModal('login');
    } else {
      setIsRecommendModalOpen(true);
    }
  };

  const closeRecommendModal = () => {
    setIsRecommendModalOpen(false);
  };

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
        login,
        register,
        loginWithGoogle,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
