import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * VerifyEmail page
 * Handles the /verify-email?token=XXX&email=YYY route
 * which is linked from the verification email.
 */
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link. Please request a new one.');
      return;
    }

    const doVerify = async () => {
      const result = await verifyEmail(token, email);
      if (result.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2500);
      } else {
        setStatus('error');
        setMessage(result.message || 'Verification failed. The link may have expired.');
      }
    };

    doVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: "'Inter', sans-serif",
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          {status === 'verifying' && '⏳'}
          {status === 'success'   && '✅'}
          {status === 'error'     && '❌'}
        </div>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '0.75rem',
          }}
        >
          {status === 'verifying' && 'Verifying your email…'}
          {status === 'success'   && 'Email Verified!'}
          {status === 'error'     && 'Verification Failed'}
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          {status === 'verifying'
            ? 'Please wait while we confirm your email address.'
            : message}
        </p>

        {status === 'verifying' && (
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255,255,255,0.1)',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto',
            }}
          />
        )}

        {status === 'error' && (
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.85rem 2rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.opacity = '0.85')}
            onMouseOut={(e)  => (e.target.style.opacity = '1')}
          >
            Back to Home
          </button>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
