import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Moneragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Trincomalee', 'Vavuniya', 'Overseas / Diaspora'
];

export default function RequireWhatsappModal() {
  const { user, updateUserProfile } = useAuth();
  const [whatsapp, setWhatsapp] = useState('');
  const [district, setDistrict] = useState(user?.district || 'Colombo');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Show modal ONLY when user is logged in AND their whatsapp number is missing or empty
  const isRequired = user && (!user.whatsapp || !user.whatsapp.trim());

  if (!isRequired) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanWhatsapp = whatsapp.trim();
    if (!cleanWhatsapp) {
      setError('WhatsApp number is required.');
      return;
    }
    if (cleanWhatsapp.length < 7) {
      setError('Please enter a valid WhatsApp number (e.g. +94 77 123 4567 or 0771234567).');
      return;
    }

    setLoading(true);
    try {
      const res = await updateUserProfile({ whatsapp: cleanWhatsapp, district });
      if (!res.success) {
        setError(res.message || 'Failed to save WhatsApp number. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-dark-200 border border-primary/40 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Top accent border */}
          <div className="h-1.5 bg-gradient-to-r from-red-600 via-primary to-red-500" />

          <div className="p-6 sm:p-8">
            <div className="text-center space-y-3 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 text-primary mb-1">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="font-manrope font-black text-2xl text-white">
                WhatsApp Number Required
              </h2>
              <p className="text-text-muted text-xs leading-relaxed max-w-xs mx-auto">
                Hi <strong className="text-white">{user.name}</strong>, to complete your PeopleFirst registration, please enter your active WhatsApp contact number below.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  WhatsApp Contact Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+94 77 123 4567 or 0771234567"
                    disabled={loading}
                    className="w-full bg-dark-300 border border-surface-border focus:border-primary text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Sri Lanka Native District / Region <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={loading}
                    className="w-full bg-dark-300 border border-surface-border focus:border-primary text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all appearance-none"
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d} value={d} className="bg-dark-200 text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-3.5 rounded-xl font-bold text-sm shadow-glow-red mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Save &amp; Continue
                  </span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
