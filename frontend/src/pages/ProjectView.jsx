import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Sparkles, MessageSquare, GitBranch } from 'lucide-react';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';
import WaveformPlayer from '../components/WaveformPlayer';
import CommentPanel from '../components/CommentPanel';
import FileList from '../components/FileList';
import VersionManager from '../components/VersionManager';
import AISuggestions from '../components/AISuggestions';

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('waveform');
  const socket = useSocket();

  useEffect(() => {
    fetchProject();

    if (socket) {
      socket.emit('join-project', id);

      socket.on('new-comment', () => {
        fetchProject();
      });

      socket.on('comment-update', () => {
        fetchProject();
      });

      return () => {
        socket.emit('leave-project', id);
        socket.off('new-comment');
        socket.off('comment-update');
      };
    }
  }, [id, socket]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-accent-blue text-lg font-medium"
        >
          Loading project...
        </motion.div>
      </div>
    );
  }

  if (!project) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card text-center py-20"
      >
        <p className="text-text-secondary">Project not found</p>
      </motion.div>
    );
  }

  const currentVersion = project.versions?.find(v => v.versionNumber === project.currentVersion);
  const audioFiles = currentVersion?.audioFiles || [];

  const tabs = [
    { id: 'waveform', label: 'Waveform', icon: MessageSquare },
    { id: 'files', label: 'Files', icon: Download },
    { id: 'versions', label: 'Versions', icon: GitBranch },
    { id: 'ai', label: 'AI Suggestions', icon: Sparkles },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
          {project.title}
        </h1>
        {project.description && (
          <p className="text-text-secondary text-lg">{project.description}</p>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1 p-1 rounded-2xl bg-white/[0.03] mb-8 w-fit"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'waveform' && (
            <>
              <WaveformPlayer
                projectId={id}
                audioFiles={audioFiles}
                project={project}
              />
              <CommentPanel projectId={id} socket={socket} />
            </>
          )}

          {activeTab === 'files' && (
            <FileList
              projectId={id}
              audioFiles={audioFiles}
              onUploadComplete={fetchProject}
            />
          )}

          {activeTab === 'versions' && (
            <VersionManager
              project={project}
              onVersionChange={fetchProject}
            />
          )}

          {activeTab === 'ai' && <AISuggestions projectId={id} />}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="font-semibold mb-5 text-lg">Project Info</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-text-muted mb-1.5 text-xs uppercase tracking-wider">Owner</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-xs font-semibold">
                    {project.owner?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span>{project.owner?.username}</span>
                </div>
              </div>
              <div>
                <div className="text-text-muted mb-1.5 text-xs uppercase tracking-wider">Version</div>
                <div className="font-medium">v{project.currentVersion}</div>
              </div>
              <div>
                <div className="text-text-muted mb-1.5 text-xs uppercase tracking-wider">Files</div>
                <div className="font-medium">{audioFiles.length}</div>
              </div>
              {project.tags?.length > 0 && (
                <div>
                  <div className="text-text-muted mb-2 text-xs uppercase tracking-wider">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs rounded-xl bg-white/5 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {project.collaborators?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="card"
            >
              <h3 className="font-semibold mb-5 text-lg">Collaborators</h3>
              <div className="space-y-3">
                {project.collaborators.map((collab) => (
                  <div key={collab.user?._id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-xs font-semibold">
                        {collab.user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{collab.user?.username}</span>
                    </div>
                    <span className="text-xs text-text-muted">{collab.role}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
