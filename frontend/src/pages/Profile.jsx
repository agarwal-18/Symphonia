import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    collaborations: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/api/projects');
      const projects = response.data || [];
      const userId = user?._id || user?.id;
      setStats({
        projects: projects.filter(p => {
          const ownerId = p.owner?._id || p.owner;
          return ownerId?.toString() === userId?.toString();
        }).length,
        collaborations: projects.filter(p => {
          const ownerId = p.owner?._id || p.owner;
          return ownerId?.toString() !== userId?.toString();
        }).length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex items-center gap-6 mb-8">
          <motion.div
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-3xl font-bold text-white"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight">
              {user?.username}
            </h1>
            <p className="text-text-secondary">{user?.email}</p>
          </div>
        </div>

        {user?.bio && (
          <p className="text-text-secondary mb-8">{user.bio}</p>
        )}

        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/[0.06]">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-2xl bg-white/[0.03]"
          >
            <div className="text-3xl font-bold text-accent-blue mb-1">
              {stats.projects}
            </div>
            <div className="text-sm text-text-secondary">Projects</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-2xl bg-white/[0.03]"
          >
            <div className="text-3xl font-bold text-accent-purple mb-1">
              {stats.collaborations}
            </div>
            <div className="text-sm text-text-secondary">Collaborations</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
