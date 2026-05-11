import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Compass } from 'lucide-react';
import api from '../utils/api';

const Feed = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProjects();
  }, []);

  const fetchPublicProjects = async () => {
    try {
      const response = await api.get('/api/projects?publicOnly=true');
      setProjects(response.data || []);
    } catch (error) {
      console.error('Failed to fetch public projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-accent-blue text-lg font-medium"
        >
          Loading feed...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">
          Discover
        </h1>
        <p className="text-text-secondary text-lg">
          Explore public music projects from the community
        </p>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-20"
        >
          <Compass size={64} className="mx-auto mb-6 text-text-muted" strokeWidth={1} />
          <h3 className="text-xl font-semibold mb-2">No public projects yet</h3>
          <p className="text-text-secondary">
            Be the first to share a project with the community
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/projects/${project._id}`}>
                <motion.div
                  className="card card-interactive h-full"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <h3 className="text-xl font-semibold text-text-primary mb-4">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-text-secondary text-sm mb-5 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-5 text-sm text-text-muted mt-auto pt-5 border-t border-white/[0.06]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} strokeWidth={1.5} />
                      {formatDate(project.updatedAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={16} strokeWidth={1.5} />
                      {project.collaborators?.length + 1 || 1}
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
