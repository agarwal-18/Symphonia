import { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const VerificationBanner = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && !user.emailVerified) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [user]);

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post('/api/verification/resend');
      setShow(false);
      setTimeout(() => setShow(true), 100);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!show || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-amber-400/90">
            Please verify your email — check <span className="font-medium">{user.email}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResend}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <Mail size={16} strokeWidth={1.5} />
              {loading ? 'Sending...' : 'Resend'}
            </button>
            <button
              onClick={() => setShow(false)}
              className="p-2 rounded-xl hover:bg-amber-500/10 text-amber-400/80 transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerificationBanner;
