import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, User, Mail, Phone, FileText, Tag, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const categories = [
  'Healthcare & Medicine', 'Education & Heritage', 'Engineering & Technology',
  'Social Impact', 'Sports', 'Arts & Culture', 'Linguistics & Culture',
  'Humanitarian Service', 'Business & Entrepreneurship', 'Environment & Science', 'Other'
];

export default function Nominate() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    nomineeName: '', nomineeLocation: '', category: '', description: '',
    achievements: '', youtube: '', facebook: '', nominatorName: '', nominatorEmail: '',
    nominatorPhone: '', agreeTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-100 pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md px-4"
        >
          <div className="w-24 h-24 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="font-manrope font-black text-3xl text-text-primary">{t('nominationSubmitted')}</h2>
          <p className="text-text-secondary leading-relaxed">
            {t('nominationThankYou')} <strong className="text-text-primary">{form.nomineeName}</strong>.{' '}
            {t('nominationReview')}
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ nomineeName: '', nomineeLocation: '', category: '', description: '', achievements: '', youtube: '', facebook: '', nominatorName: '', nominatorEmail: '', nominatorPhone: '', agreeTerms: false }); }}
            className="btn-primary px-8 py-3"
          >
            {t('submitAnother')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100 pt-20">
      {/* Header */}
      <div className="bg-dark-200 border-b border-surface-border py-12">
        <div className="container-main max-w-3xl">
          <div className="section-label mb-3">
            <Award className="w-3.5 h-3.5" />
            {t('communityNominations')}
          </div>
          <h1 className="font-manrope font-black text-4xl md:text-5xl text-text-primary mb-4">
            {t('nominateAchiever')} <span className="text-gradient-red">{t('nominateHighlight')}</span>
          </h1>
          <p className="text-text-secondary text-lg">
            {t('nominatePageDesc')}
          </p>
        </div>
      </div>

      <div className="container-main py-10 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Nominee Info */}
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-manrope font-bold text-text-primary text-lg">{t('nomineeInfo')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  {t('nomineeName')} <span className="text-primary">*</span>
                </label>
                <input name="nomineeName" value={form.nomineeName} onChange={handleChange} required
                  className="input" placeholder="e.g. Dr. Nilanthi Jayasinghe" />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  {t('nomineeLocation')} <span className="text-primary">*</span>
                </label>
                <input name="nomineeLocation" value={form.nomineeLocation} onChange={handleChange} required
                  className="input" placeholder="e.g. Badulla District" />
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                {t('categoryField')} <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select name="category" value={form.category} onChange={handleChange} required
                  className="input pl-11 appearance-none cursor-pointer">
                  <option value="">{t('selectCategory')}</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                {t('descriptionAchievements')} <span className="text-primary">*</span>
              </label>
              <textarea name="description" value={form.description} onChange={handleChange} required
                className="textarea" rows={5}
                placeholder="Describe what makes this person extraordinary. What have they achieved? How have they impacted their community?..." />
              <p className="text-text-muted text-xs mt-1">{t('minChars')}</p>
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                {t('keyAchievements')}
              </label>
              <textarea name="achievements" value={form.achievements} onChange={handleChange}
                className="textarea" rows={4}
                placeholder="• Award or recognition received&#10;• Milestone or record achieved&#10;• Community impact metric" />
            </div>
          </div>

          {/* Section 2: Social / Media Links */}
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-manrope font-bold text-text-primary text-lg">{t('mediaLinks')}</h2>
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">{t('youtubeLink')}</label>
              <input name="youtube" value={form.youtube} onChange={handleChange}
                className="input" placeholder="https://youtube.com/watch?v=..." type="url" />
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">{t('facebookLink')}</label>
              <input name="facebook" value={form.facebook} onChange={handleChange}
                className="input" placeholder="https://facebook.com/..." type="url" />
            </div>
          </div>

          {/* Section 3: Nominator Info */}
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-manrope font-bold text-text-primary text-lg">{t('yourInfo')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">{t('yourFullName')} <span className="text-primary">*</span></label>
                <input name="nominatorName" value={form.nominatorName} onChange={handleChange} required
                  className="input" placeholder={t('yourName')} />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">{t('phoneNumber')}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input name="nominatorPhone" value={form.nominatorPhone} onChange={handleChange}
                    className="input pl-11" placeholder="+94 77 123 4567" type="tel" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">{t('emailAddress')} <span className="text-primary">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input name="nominatorEmail" value={form.nominatorEmail} onChange={handleChange} required
                  className="input pl-11" placeholder="your@email.com" type="email" />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} required
                className="w-4 h-4 mt-0.5 rounded accent-primary" />
              <span className="text-text-secondary text-sm">
                {t('agreeText')}
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !form.agreeTerms}
            className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {submitting ? t('submittingNomination') : t('submitNomination')}
          </button>
        </form>
      </div>
    </div>
  );
}
