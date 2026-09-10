import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Play, MapPin } from 'lucide-react';
import { getAllAchievers } from '../data/achievers';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function HiddenHeroes() {
  const { t } = useLanguage();
  const allAchievers = useMemo(() => getAllAchievers(), []);
  const hiddenHeroes = useMemo(() => allAchievers.filter(a => !a.featured), [allAchievers]);

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Header */}
      <div className="relative bg-dark-200 border-b border-surface-border py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(200,16,46,0.1) 0%, transparent 70%)' }} />
        <div className="container-main relative">
          <div className="section-label mb-3 text-gold">
            <Star className="w-3.5 h-3.5" />
            {t('unsungHeroes')}
          </div>
          <h1 className="font-manrope font-black text-4xl md:text-5xl text-text-primary mb-4">
            {t('hiddenHeroesTitle')} <span className="text-gradient-gold">{t('hiddenHeroesHighlight')}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl">
            {t('hiddenHeroesDesc')}
          </p>
        </div>
      </div>

      <div className="container-main py-12">
        {/* Intro card */}
        <div className="card p-8 border-gold/20 bg-gold/5 mb-12 flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 bg-gold/15 rounded-2xl flex items-center justify-center shrink-0 text-2xl">
            🌟
          </div>
          <div className="space-y-2">
            <h2 className="font-manrope font-bold text-text-primary text-xl">{t('aboutHiddenHeroes')}</h2>
            <p className="text-text-secondary leading-relaxed">
              {t('aboutHiddenDesc')}
            </p>
            <RouterLink to="/nominate" className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:text-gold-light transition-colors mt-2">
              <Star className="w-4 h-4" />
              {t('nominateHiddenHero')}
            </RouterLink>
          </div>
        </div>

        {/* Heroes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hiddenHeroes.map((hero, i) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <RouterLink
                to={`/achievers/${hero.id}`}
                className="group block card overflow-hidden hover:border-gold/30 transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-dark-300">
                  <img
                    src={hero.thumbnail}
                    alt={hero.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="badge border border-gold/30 bg-gold/20 text-gold text-[10px]">{t('hiddenHeroBadge')}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-gold/90 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-dark-100 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-text-muted text-xs font-semibold">{hero.category}</p>
                  <h3 className="font-manrope font-bold text-text-primary text-sm leading-snug group-hover:text-gold transition-colors">
                    {hero.name}
                  </h3>
                  <p className="text-text-secondary text-xs line-clamp-2">{hero.title}</p>
                  <div className="flex items-center gap-1 text-text-muted text-xs pt-1">
                    <MapPin className="w-3 h-3" />
                    {hero.location}
                  </div>
                </div>
              </RouterLink>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
