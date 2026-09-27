import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw } from 'lucide-react';

/**
 * ProtectedRoute — wraps user-only pages (/dashboard, /profile).
 * - If auth is still loading: shows a clean spinner.
 * - If not logged in: shows the auth modal and redirects to /.
 * - If logged in as admin: redirects to /admin (admin should not use the user dashboard).
 * - Otherwise: renders children normally.
 */
export default function ProtectedRoute({ children }) {
  const { user, authLoading, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      openAuthModal('login');
      navigate('/', { replace: true });
    } else if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, authLoading, navigate, openAuthModal]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-primary">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-xs font-semibold text-text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role === 'admin') return null;

  return children;
}
