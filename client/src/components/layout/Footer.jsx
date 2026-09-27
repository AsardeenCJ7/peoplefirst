import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Youtube, Facebook, Twitter, Instagram } from '../ui/SocialIcons';
import logo from '../../assets/logo.jpeg';
import { useLanguage } from '../../context/LanguageContext';

const footerLinks = {
  Platform: [
    { label: 'Featured Achievers', path: '/achievers' },
    { label: 'Video Interviews', path: '/interviews' },
    { label: 'Awards & Recognition', path: '/awards' },
    { label: 'Admin Portal (Upload)', path: '/admin' },
  ],
  News: [
    { label: 'Local News', path: '/news?category=Local' },
    { label: 'International', path: '/news?category=International' },
    { label: 'Sports', path: '/news?category=Sports' },
    { label: 'Education', path: '/news?category=Education' },
    { label: 'Health', path: '/news?category=Health' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Mission', path: '/about#mission' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Advertise', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
  ],
};

const socials = [
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-500' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-500' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-400' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-500' },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark-100 border-t border-surface-border">
      {/* Main Footer */}
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img
                src={logo}
                alt="PeopleFirst Media Channel"
                className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/40 group-hover:ring-primary transition-all"
              />
              <div>
                <div className="font-manrope font-bold text-xl text-text-primary">
                  People<span className="text-primary">First</span>
                </div>
                <div className="text-text-muted text-xs tracking-widest uppercase">Media Channel</div>
              </div>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              {t('tagline')}
            </p>
            <p className="text-primary font-semibold text-sm italic">
              {t('motto')}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg bg-dark-300 text-text-muted ${color} hover:bg-dark-400 transition-all duration-200`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <a href="mailto:info@peoplefirst.lk" className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                info@peoplefirst.lk
              </a>
              <a href="tel:+94112345678" className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                +94 11 234 5678
              </a>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <MapPin className="w-4 h-4 shrink-0" />
                Colombo 07, Sri Lanka
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h3 className="font-manrope font-bold text-text-primary text-sm tracking-wide uppercase">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-border">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs">
            {t('allRightsReserved')}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className="text-text-muted hover:text-text-secondary text-xs transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link to="/terms" className="text-text-muted hover:text-text-secondary text-xs transition-colors">
              {t('termsOfUse')}
            </Link>
            <span className="text-text-muted text-xs">
              Developed by <span className="text-primary font-bold">InxcodeCoder</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
