import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { Facebook, Twitter } from './SocialIcons';

export default function ShareButtons({ url, title, compact = false }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const platforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/30',
    },
    {
      name: 'Twitter / X',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30',
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-300 border border-surface-border text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all text-sm font-semibold"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2 bg-surface-card border border-surface-border rounded-xl shadow-card p-3 flex gap-2 z-20"
            >
              {platforms.map(({ name, icon: Icon, href, color }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Share on ${name}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg bg-dark-300 border border-surface-border text-text-muted ${color} transition-all`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <button
                onClick={handleCopy}
                title="Copy link"
                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
                  copied
                    ? 'bg-success/20 text-success border-success/30'
                    : 'bg-dark-300 border-surface-border text-text-muted hover:bg-dark-400 hover:text-text-primary'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-text-secondary text-sm flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share this story
      </h4>
      <div className="flex flex-wrap gap-2">
        {platforms.map(({ name, icon: Icon, href, color }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-dark-300 border border-surface-border text-text-secondary ${color} text-sm font-medium transition-all duration-200`}
          >
            <Icon className="w-4 h-4" />
            {name}
          </a>
        ))}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
            copied
              ? 'bg-success/10 text-success border-success/30'
              : 'bg-dark-300 border-surface-border text-text-secondary hover:bg-dark-400 hover:text-text-primary'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
