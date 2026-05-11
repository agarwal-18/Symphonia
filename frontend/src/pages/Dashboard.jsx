import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Clock, Users } from 'lucide-react';
import api from '../utils/api';
import CreateProjectModal from '../components/CreateProjectModal';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
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
          Loading projects...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12"
      >
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">
            My Projects
          </h1>
          <p className="text-text-secondary text-lg">
            Manage and collaborate on your music projects
          </p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-auto"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={22} strokeWidth={2} />
          New Project
        </motion.button>
      </motion.div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card text-center py-20"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FolderOpen size={72} className="mx-auto mb-6 text-text-muted" strokeWidth={1} />
          </motion.div>
          <h3 className="text-2xl font-semibold mb-3">No projects yet</h3>
          <p className="text-text-secondary mb-8 max-w-sm mx-auto">
            Create your first project to start collaborating on music
          </p>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Project
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/projects/${project._id}`}>
                <motion.div
                  className="card card-interactive h-full"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-text-primary pr-4">
                      {project.title}
                    </h3>
                    {project.isPublic && (
                      <span className="px-2.5 py-1 text-xs font-medium rounded-xl bg-accent-blue/15 text-accent-blue shrink-0">
                        Public
                      </span>
                    )}
                  </div>

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

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
