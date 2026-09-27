import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw } from 'lucide-react';

/**
 * AdminRoute — wraps admin-only pages (/admin).
 * - If auth is still loading: shows a clean spinner.
 * - If not logged in: shows the auth modal and redirects to /.
 * - If logged in but not admin: redirects to /dashboard.
 * - Otherwise: renders children normally.
 */
export default function AdminRoute({ children }) {
  const { user, authLoading, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      openAuthModal('login');
      navigate('/', { replace: true });
    } else if (user.role !== 'admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate, openAuthModal]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-primary">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-xs font-semibold text-text-muted">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return children;
}
