import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download } from 'lucide-react';
import api from '../utils/api';

const FileList = ({ projectId, audioFiles, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('audio', files[0]);

    try {
      await api.post(`/api/upload/project/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUploadComplete();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Audio Files</h3>
        <label className="btn-primary cursor-pointer flex items-center gap-2">
          <Upload size={18} strokeWidth={2} />
          Upload
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>

      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`rounded-2xl p-10 text-center mb-6 border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? 'border-accent-blue/50 bg-accent-blue/5'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
        }`}
        whileHover={{ scale: 1.005 }}
      >
        <Upload size={48} className="mx-auto mb-4 text-text-muted" strokeWidth={1} />
        <p className="text-text-secondary mb-2">
          Drag and drop audio files here or{' '}
          <label className="text-accent-blue cursor-pointer hover:text-accent-teal font-medium">
            browse
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={uploading}
            />
          </label>
        </p>
        <p className="text-sm text-text-muted">MP3, WAV, M4A, AAC up to 100MB</p>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-accent-blue font-medium"
          >
            Uploading...
          </motion.div>
        )}
      </motion.div>

      {audioFiles.length === 0 ? (
        <p className="text-center py-12 text-text-secondary">
          No audio files uploaded yet
        </p>
      ) : (
        <div className="space-y-3">
          {audioFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-text-primary truncate">
                  {file.originalName}
                </div>
                <div className="text-sm text-text-secondary">
                  {formatFileSize(file.size)} • {file.format?.toUpperCase()}
                </div>
              </div>
              <a
                href={file.url}
                download
                className="p-2.5 rounded-xl hover:bg-white/10 transition-colors ml-4"
              >
                <Download size={20} strokeWidth={1.5} />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
