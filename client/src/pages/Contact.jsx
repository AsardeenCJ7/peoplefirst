import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Youtube, Facebook, Twitter, Instagram } from '../components/ui/SocialIcons';
import { useLanguage } from '../context/LanguageContext';

const socials = [
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com', color: 'hover:bg-red-600/20 hover:text-red-400' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com', color: 'hover:bg-blue-600/20 hover:text-blue-400' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', color: 'hover:bg-sky-500/20 hover:text-sky-400' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com', color: 'hover:bg-pink-500/20 hover:text-pink-400' },
];

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const contactInfo = [
    { icon: Mail, label: t('emailAddress'), value: 'info@peoplefirst.lk', href: 'mailto:info@peoplefirst.lk' },
    { icon: Phone, label: t('phoneNumber'), value: '+94 11 234 5678', href: 'tel:+94112345678' },
    { icon: MapPin, label: 'Address', value: '42 Galle Road, Colombo 03, Sri Lanka', href: null },
    { icon: Clock, label: 'Working Hours', value: 'Mon - Fri: 9:00 AM – 5:00 PM', href: null },
  ];

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Header */}
      <div className="bg-dark-200 border-b border-surface-border py-8 sm:py-12">
        <div className="container-main">
          <div className="section-label mb-3">
            <Mail className="w-3.5 h-3.5" />
            {t('getInTouch')}
          </div>
          <h1 className="font-manrope font-black text-2xl sm:text-4xl md:text-5xl text-text-primary mb-3 sm:mb-4">
            {t('contactTitle')} <span className="text-gradient-red">{t('contactUs')}</span>
          </h1>
          <p className="text-text-secondary text-sm sm:text-lg max-w-xl">
            {t('contactDesc')}
          </p>
        </div>
      </div>

      <div className="container-main py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-5 flex items-start gap-4 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-text-primary text-sm font-medium hover:text-primary transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-text-primary text-sm font-medium">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="card p-5 space-y-3">
              <h3 className="font-manrope font-bold text-text-primary text-sm">{t('followUs')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {socials.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg bg-dark-300 border border-surface-border text-text-muted text-sm font-medium transition-all ${color}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-6 sm:p-12 text-center space-y-5"
              >
                <div className="w-20 h-20 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h3 className="font-manrope font-black text-2xl text-text-primary">{t('messageSent')}</h3>
                <p className="text-text-secondary">
                  {t('messageSentDesc')}
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary px-6 py-2.5 text-sm">
                  {t('sendAnother')}
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="card p-5 sm:p-8 space-y-5"
              >
                <h2 className="font-manrope font-bold text-text-primary text-xl">{t('sendMessage')}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">{t('fullName')} <span className="text-primary">*</span></label>
                    <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder={t('yourName')} />
                  </div>
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">{t('emailAddress')} <span className="text-primary">*</span></label>
                    <input name="email" value={form.email} onChange={handleChange} required type="email" className="input" placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">{t('subject')} <span className="text-primary">*</span></label>
                  <input name="subject" value={form.subject} onChange={handleChange} required className="input" placeholder={t('subjectPlaceholder')} />
                </div>

                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">{t('message')} <span className="text-primary">*</span></label>
                  <textarea name="message" value={form.message} onChange={handleChange} required
                    className="textarea" rows={6} placeholder={t('messagePlaceholder')} />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {submitting ? t('sending') : t('sendMessageBtn')}
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
