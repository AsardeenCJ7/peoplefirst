import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, User, Sparkles, MapPin, CheckCircle, Image as ImageIcon, FileText, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllAwardCategories, nominateCandidate } from '../../data/awards';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
];

const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle', 'Diaspora (Overseas)'
];

export default function NominateModal({ isOpen, onClose, onNominated }) {
  const { user } = useAuth();

  const [nominee, setNominee] = useState('');
  const [category, setCategory] = useState('Healthcare');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nominatorName, setNominatorName] = useState(user?.name || '');
  const [district, setDistrict] = useState(user?.district || 'Colombo');
  const [thumbnail, setThumbnail] = useState(SAMPLE_AVATARS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;
  //code 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nominee.trim() || !description.trim()) return;

    setIsSubmitting(true);

    const awardTitle = title.trim() || `${category} Community Laureate 2026`;
    const presenterText = `Nominated by ${nominatorName.trim() || 'Citizen Nominator'} (${district})`;

    setTimeout(() => {
      const created = nominateCandidate({
        nominee: nominee.trim(),
        category,
        title: awardTitle,
        description: description.trim(),
        presenter: presenterText,
        thumbnail,
        nominatorEmail: user?.email || 'guest@peoplefirst.lk',
        nominatorName: nominatorName.trim() || 'Citizen Nominator',
        nominatorDistrict: district,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      if (onNominated) onNominated(created);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form
        setNominee('');
        setTitle('');
        setDescription('');
      }, 2000);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-dark-200 border-2 border-gold/40 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 my-8 overflow-hidden"
        >
          {/* Top Gold Accent */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text-muted hover:text-white rounded-full bg-dark-300 hover:bg-dark-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold text-gold flex items-center justify-center mx-auto shadow-glow-gold">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-manrope font-black text-2xl text-white">Nomination Submitted!</h3>
              <p className="text-text-secondary text-sm max-w-sm mx-auto leading-relaxed">
                <strong className="text-gold">{nominee}</strong> has been officially nominated in <strong className="text-white">{category}</strong> and entered into the live voting pool.
              </p>
              <div className="pt-2">
                <span className="text-xs text-text-muted font-mono">Updating awards registry...</span>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="space-y-1 mb-5 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5" /> Civic Award Nomination
                </div>
                <h2 className="font-manrope font-black text-2xl text-white mt-1">
                  Nominate a Candidate
                </h2>
                <p className="text-text-muted text-xs leading-relaxed">
                  Suggest an inspiring Sri Lankan hero or innovator for the 2026 Community Awards. Once submitted, citizens can vote for them immediately.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Nominee Name */}
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    Candidate Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Nilanthi Jayasinghe / Chamari Senaratne"
                      value={nominee}
                      onChange={(e) => setNominee(e.target.value)}
                      className="w-full bg-dark-300 border border-surface-border rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Category & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">
                      Award Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-dark-300 border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:border-gold focus:outline-none cursor-pointer"
                    >
                      {getAllAwardCategories().filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat} className="bg-dark-200">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">
                      Region / District *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold" />
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-dark-300 border border-surface-border rounded-xl pl-8 pr-3 py-2.5 text-xs text-text-primary focus:border-gold focus:outline-none cursor-pointer"
                      >
                        {SRI_LANKA_DISTRICTS.map((d) => (
                          <option key={d} value={d} className="bg-dark-200">
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Proposed Award Title (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    Proposed Award Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${category} Pioneer of the Year 2026`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-all"
                  />
                </div>

                {/* Contribution & Reason */}
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    Contribution & Why They Deserve This Award *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe their public service, ground-breaking research, athletic feat, or social impact in Sri Lanka..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-dark-300 border border-surface-border rounded-xl p-3 text-xs sm:text-sm text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Candidate Photo Selection */}
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5 flex items-center justify-between">
                    <span>Photo / Portrait</span>
                    <span className="text-[10px] text-text-muted">Choose preset or enter URL</span>
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    {SAMPLE_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setThumbnail(url)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${thumbnail === url ? 'border-gold scale-110 shadow-glow-gold' : 'border-surface-border opacity-70 hover:opacity-100'
                          }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste custom image URL (https://...)"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full bg-dark-300 border border-surface-border rounded-xl px-3 py-1.5 text-xs text-text-primary placeholder-text-muted focus:border-gold focus:outline-none"
                  />
                </div>

                {/* Nominator Information */}
                <div className="pt-2 border-t border-surface-border/60">
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    Your Name (Citizen Nominator)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kasun Kalhara"
                    value={nominatorName}
                    onChange={(e) => setNominatorName(e.target.value)}
                    className="w-full bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:border-gold focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold py-3 rounded-xl font-black text-xs sm:text-sm justify-center shadow-glow-gold flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Recording Nomination...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Candidate for Voting</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
