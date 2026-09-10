import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, MapPin, Tag, Video, Send, CheckCircle, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const categories = [
  'Healthcare & Medicine',
  'Education & Heritage',
  'Engineering & Innovation',
  'Sports & Athletics',
  'Arts & Culture',
  'Community Leadership',
];

const sriLankaDistricts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
  'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya', 'Diaspora (Overseas)'
];

export default function RecommendModal() {
  const { user, isRecommendModalOpen, closeRecommendModal } = useAuth();

  const [achieverName, setAchieverName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [district, setDistrict] = useState(user?.district || 'Colombo');
  const [description, setDescription] = useState('');
  const [mediaLink, setMediaLink] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isRecommendModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!achieverName || !description) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  const handleReset = () => {
    setAchieverName('');
    setDescription('');
    setMediaLink('');
    setSubmitted(false);
    closeRecommendModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          onClick={closeRecommendModal}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-dark-200 border-2 border-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Top Gold Glow Accent */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={closeRecommendModal}
            className="absolute top-4 right-4 p-2 text-text-muted hover:text-white rounded-full bg-dark-300 hover:bg-dark-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-success/20 border border-success/40 rounded-full flex items-center justify-center mx-auto text-success shadow-glow-gold">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-manrope font-extrabold text-2xl text-white">
                Recommendation Submitted!
              </h3>
              <p className="text-text-secondary text-sm max-w-sm mx-auto leading-relaxed">
                Thank you <strong className="text-gold">{user?.name}</strong>! Your nomination for{' '}
                <strong className="text-white">{achieverName}</strong> ({district} District) has been received by our editorial team.
              </p>
              <button
                onClick={handleReset}
                className="btn-gold px-6 py-2.5 text-xs font-bold shadow-glow-gold"
              >
                Done / Submit Another
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center space-y-1.5 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> Suggest / Recommend Achiever
                </div>
                <h2 className="font-manrope font-black text-2xl text-white">
                  Nominate a Local Icon
                </h2>
                <p className="text-text-muted text-xs">
                  Recommending as <strong className="text-gold">{user?.name}</strong> ({user?.district} District)
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Achiever's Full Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      required
                      value={achieverName}
                      onChange={(e) => setAchieverName(e.target.value)}
                      placeholder="e.g. Dr. Nihal Abeysekera"
                      className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Field / Category
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold" />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-dark-300 border border-surface-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-text-primary focus:border-gold focus:outline-none transition-all appearance-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-dark-200">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Native District / Region
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-dark-300 border border-surface-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-text-primary focus:border-gold focus:outline-none transition-all appearance-none"
                      >
                        {sriLankaDistricts.map((d) => (
                          <option key={d} value={d} className="bg-dark-200">
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Why does this person deserve honor? <span className="text-primary">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe their contribution, achievements, or community service..."
                    className="w-full bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    YouTube / Media Link (Optional)
                  </label>
                  <div className="relative">
                    <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="url"
                      value={mediaLink}
                      onChange={(e) => setMediaLink(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-dark-300 border border-surface-border rounded-xl pl-10 pr-4 py-2 text-xs text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold justify-center py-3 rounded-xl font-bold text-sm shadow-glow-gold"
                >
                  {loading ? 'Submitting Recommendation...' : 'Submit Achiever Recommendation'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
