import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

const WaveformPlayer = ({ projectId, audioFiles, project }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!waveformRef.current || audioFiles.length === 0) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'rgba(10, 132, 255, 0.5)',
      progressColor: '#0a84ff',
      cursorColor: '#ffffff',
      barWidth: 2,
      barRadius: 3,
      responsive: true,
      height: 100,
      normalize: true,
    });

    wavesurferRef.current = wavesurfer;

    if (audioFiles.length > 0 && !selectedFile) {
      setSelectedFile(audioFiles[0]);
    }

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    wavesurfer.on('timeupdate', (time) => setCurrentTime(time));
    wavesurfer.on('ready', () => {
      setDuration(wavesurfer.getDuration());
    });

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioFiles.length]);

  useEffect(() => {
    if (wavesurferRef.current && selectedFile) {
      wavesurferRef.current.load(selectedFile.url);
    }
  }, [selectedFile]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const skipBackward = () => {
    if (wavesurferRef.current && duration > 0) {
      wavesurferRef.current.seekTo(Math.max(0, currentTime - 10) / duration);
    }
  };

  const skipForward = () => {
    if (wavesurferRef.current && duration > 0) {
      wavesurferRef.current.seekTo(Math.min(duration, currentTime + 10) / duration);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (wavesurferRef.current) {
      if (isMuted) {
        wavesurferRef.current.setVolume(volume || 0.5);
        setIsMuted(false);
      } else {
        wavesurferRef.current.setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioFiles.length === 0) {
    return (
      <div className="card text-center py-16">
        <p className="text-text-secondary mb-2">No audio files in this project</p>
        <p className="text-sm text-text-muted">Upload audio files to see the waveform</p>
      </div>
    );
  }

  return (
    <div className="card">
      {audioFiles.length > 1 && (
        <div className="mb-6 pb-6 border-b border-white/[0.06]">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Select Audio Track
          </label>
          <select
            value={selectedFile?.url}
            onChange={(e) => {
              const file = audioFiles.find(f => f.url === e.target.value);
              setSelectedFile(file);
            }}
            className="input-field"
          >
            {audioFiles.map((file) => (
              <option key={file.url} value={file.url}>
                {file.originalName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="waveform-container mb-6">
        <div ref={waveformRef} className="w-full" />
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={skipBackward}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipBack size={22} strokeWidth={1.5} />
          </motion.button>
          <motion.button
            onClick={togglePlay}
            className="p-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-lg shadow-accent-blue/20"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
          </motion.button>
          <motion.button
            onClick={skipForward}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward size={22} strokeWidth={1.5} />
          </motion.button>
        </div>

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1"
          />
          <span className="text-xs text-text-muted w-12 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaveformPlayer;
