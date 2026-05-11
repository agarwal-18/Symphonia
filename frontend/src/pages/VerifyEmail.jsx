import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, RefreshCw, Music } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchProfile } = useAuth();

  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided. Please check your email for the verification link.');
    }
  }, [token]);

  const verifyToken = async (verificationToken) => {
    try {
      const response = await api.post('/api/verification/verify', {
        token: verificationToken
      });

      setStatus('success');
      setMessage('Email verified successfully! You can now access all features.');

      await fetchProfile();

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.message ||
        'Verification failed. The link may have expired. Please request a new verification email.'
      );
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post('/api/verification/resend');
      setMessage('Verification email sent! Please check your inbox.');
      setStatus('verifying');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Failed to resend verification email. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple mb-4">
            <Music size={32} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Symphonia</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          {status === 'verifying' && (
            <div className="text-center py-4">
              <Mail className="mx-auto mb-4 text-accent-blue animate-pulse" size={48} strokeWidth={1.5} />
              <h2 className="text-xl font-semibold mb-2">Verifying Email</h2>
              <p className="text-text-secondary">Please wait...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <CheckCircle className="mx-auto mb-4 text-emerald-400" size={48} strokeWidth={1.5} />
              <h2 className="text-xl font-semibold mb-2 text-emerald-400">Email Verified!</h2>
              <p className="text-text-secondary mb-6">{message}</p>
              <p className="text-sm text-text-muted">Redirecting to dashboard...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <XCircle className="mx-auto mb-4 text-red-400" size={48} strokeWidth={1.5} />
              <h2 className="text-xl font-semibold mb-2 text-red-400">Verification Failed</h2>
              <p className="text-text-secondary mb-8">{message}</p>

              <div className="space-y-3">
                <motion.button
                  onClick={handleResend}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={20} />
                      Resend Verification Email
                    </>
                  )}
                </motion.button>

                <Link to="/" className="block">
                  <button className="btn-secondary w-full">Go to Dashboard</button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
