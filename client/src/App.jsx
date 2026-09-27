import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/ui/AuthModal';
import RecommendModal from './components/ui/RecommendModal';
import IntroAnimation from './components/ui/IntroAnimation';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import Home from './pages/Home';
import Achievers from './pages/Achievers';
import AchieverDetail from './pages/AchieverDetail';
import Interviews from './pages/Interviews';
import Awards from './pages/Awards';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Admin from './pages/Admin';
import UserDashboard from './pages/UserDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import VerifyEmail from './pages/VerifyEmail';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen bg-dark-100 text-text-primary flex flex-col font-inter selection:bg-primary/30 selection:text-white">
      {!isAdmin && <Navbar />}
      <main className={`flex-1 ${!isAdmin && !isHome ? 'pt-16 lg:pt-20' : ''}`}>
        <Routes>
          {/* ── Public routes ─────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/achievers" element={<Achievers />} />
          <Route path="/achiever/:id" element={<AchieverDetail />} />
          <Route path="/achievers/:id" element={<AchieverDetail />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<About />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* ── User-only routes (role: reader) ───────────────── */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Admin-only route (role: admin) ────────────────── */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* ── Fallback ──────────────────────────────────────── */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {/* AuthModal must render everywhere — admin gate also uses it */}
      <AuthModal />
      {!isAdmin && <RecommendModal />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <IntroAnimation />
          <ScrollToTop />
          <AppLayout />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

