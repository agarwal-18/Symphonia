import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader } from 'lucide-react';
import api from '../utils/api';

const AISuggestions = ({ projectId }) => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('mixing');

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/ai/suggestions', {
        projectId,
        type,
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
      alert('Failed to get AI suggestions. Make sure OpenAI API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-5">
          <Sparkles size={24} strokeWidth={1.5} />
          AI Suggestions
        </h3>

        <div className="flex gap-2 mb-5 p-1 rounded-2xl bg-white/[0.03] w-fit">
          {['mixing', 'composition'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 capitalize ${
                type === t
                  ? 'bg-white/10 text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.button
          onClick={fetchSuggestions}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="animate-spin" size={20} strokeWidth={2} />
              Generating...
            </span>
          ) : (
            'Get AI Suggestions'
          )}
        </motion.button>
      </div>

      {suggestions && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
        >
          <span className="text-xs text-text-muted uppercase tracking-wider">
            {suggestions.type} Suggestions
          </span>
          <div className="text-text-primary whitespace-pre-wrap leading-relaxed mt-3">
            {suggestions.suggestion}
          </div>
          <div className="mt-4 text-xs text-text-muted">
            Generated at {new Date(suggestions.generatedAt).toLocaleString()}
          </div>
        </motion.div>
      )}

      {!suggestions && !loading && (
        <div className="text-center py-16 text-text-secondary">
          <Sparkles size={48} className="mx-auto mb-4 opacity-40" strokeWidth={1} />
          <p>Click the button above to get AI-powered suggestions</p>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
