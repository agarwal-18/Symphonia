import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Check } from 'lucide-react';
import api from '../utils/api';

const VersionManager = ({ project, onVersionChange }) => {
  const [selectedVersion, setSelectedVersion] = useState(project.currentVersion);
  const [loading, setLoading] = useState(false);

  const switchVersion = (versionNumber) => {
    setSelectedVersion(versionNumber);
  };

  const createNewVersion = async () => {
    setLoading(true);
    try {
      await api.post(`/api/projects/${project._id}/versions`, {
        description: `Version ${project.currentVersion + 1}`,
      });
      onVersionChange();
    } catch (error) {
      console.error('Failed to create version:', error);
      alert('Failed to create version');
    } finally {
      setLoading(false);
    }
  };

  const versions = project.versions?.slice().reverse() || [];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <GitBranch size={24} strokeWidth={1.5} />
          Versions
        </h3>
        <motion.button
          onClick={createNewVersion}
          disabled={loading}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Creating...' : 'New Version'}
        </motion.button>
      </div>

      <div className="space-y-3">
        {versions.map((version, i) => {
          const isSelected = version.versionNumber === selectedVersion;
          const isCurrent = version.versionNumber === project.currentVersion;
          return (
            <motion.div
              key={version.versionNumber}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => switchVersion(version.versionNumber)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-accent-blue/10 border-accent-blue/30'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">v{version.versionNumber}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-xs rounded-xl bg-accent-blue/15 text-accent-blue font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  {version.description && (
                    <p className="text-sm text-text-secondary">{version.description}</p>
                  )}
                  <div className="text-xs text-text-muted mt-2">
                    {new Date(version.createdAt).toLocaleDateString()} •{' '}
                    {version.audioFiles?.length || 0} file(s)
                  </div>
                </div>
                {isSelected && (
                  <Check size={20} className="text-accent-blue" strokeWidth={2} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionManager;
