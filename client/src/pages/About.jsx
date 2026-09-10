import { motion } from 'framer-motion';
import { Star, Eye, Globe, Heart, Users, Award } from 'lucide-react';
import logo from '../assets/logo.jpeg';
import { useLanguage } from '../context/LanguageContext';

const milestones = [
  { year: '2018', eventKey: 'Founded PeopleFirst Media Channel in Colombo' },
  { year: '2019', eventKey: 'First 50 achiever documentaries published on YouTube' },
  { year: '2020', eventKey: 'Launched PeopleFirst.lk digital platform' },
  { year: '2021', eventKey: 'Reached 1 million YouTube views milestone' },
  { year: '2022', eventKey: 'Expanded to diaspora coverage across 34 countries' },
  { year: '2023', eventKey: 'Launched community nomination system' },
  { year: '2024', eventKey: 'Surpassed 500 documented achiever stories' },
  { year: '2026', eventKey: 'Launched award recognition programme' },
];

const team = [
  { name: 'Dharmasiri Bandara', role: 'Founder & Editor-in-Chief', bio: 'Veteran broadcast journalist with 30 years in Sri Lankan media.' },
  { name: 'Priyani Rodrigo', role: 'Head of Documentary Production', bio: 'Award-winning filmmaker specializing in biographical documentaries.' },
  { name: 'Chamara Perera', role: 'Digital Platform Director', bio: 'Tech entrepreneur building media solutions for the future.' },
  { name: 'Amara Wickramasinghe', role: 'Community Engagement Lead', bio: 'Grassroots organizer connecting communities across the island.' },
];

export default function About() {
  const { t } = useLanguage();

  const values = [
    { icon: Eye, titleKey: 'truthFirst', descKey: 'truthFirstDesc' },
    { icon: Heart, titleKey: 'peopleFirstVal', descKey: 'peopleFirstDesc' },
    { icon: Globe, titleKey: 'inclusiveVoice', descKey: 'inclusiveVoiceDesc' },
    { icon: Award, titleKey: 'standardsExcellence', descKey: 'standardsDesc' },
  ];

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Hero */}
      <section className="relative bg-dark-200 border-b border-surface-border py-10 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-red-glow" />
        <div className="container-main relative text-center space-y-6">
          <img src={logo} alt="PeopleFirst Logo" className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/40 mx-auto shadow-glow-red" />
          <div>
            <h1 className="font-manrope font-black text-2xl sm:text-4xl md:text-6xl text-text-primary mb-3 sm:mb-4">
              {t('aboutHeroTitle')} <span className="text-gradient-red">{t('aboutHeroHighlight')}</span>
            </h1>
            <p className="text-text-secondary text-base sm:text-xl max-w-2xl mx-auto font-light italic">
              {t('aboutMotto')}
            </p>
          </div>
          <p className="text-text-secondary text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
            {t('aboutDescription')}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-10 sm:py-20" id="mission">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-5 sm:p-8 border-primary/20 bg-primary/5 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-primary" />
                <h2 className="font-manrope font-bold text-xl text-text-primary">{t('ourMission')}</h2>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {t('missionText')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-5 sm:p-8 border-gold/20 bg-gold/5 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-gold" />
                <h2 className="font-manrope font-bold text-xl text-text-primary">{t('ourVision')}</h2>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {t('visionText')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-20 bg-dark-200 border-y border-surface-border">
        <div className="container-main">
          <div className="section-header text-center">
            <div className="section-label justify-center">{t('coreValues')}</div>
            <h2 className="section-title">{t('whatWeStandFor')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
            {values.map((v, i) => (
              <motion.div
                key={v.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center space-y-4 hover:border-primary/30"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-manrope font-bold text-text-primary">{t(v.titleKey)}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{t(v.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-10 sm:py-20">
        <div className="container-main max-w-3xl">
          <div className="section-header text-center">
            <div className="section-label justify-center">{t('ourJourney')}</div>
            <h2 className="section-title">{t('timelineImpact')}</h2>
          </div>
          <div className="relative mt-8 sm:mt-12 space-y-0">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 sm:gap-6 pb-6 sm:pb-8"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-primary/10 border-2 border-primary/30 rounded-full flex items-center justify-center relative z-10">
                  <span className="font-manrope font-bold text-primary text-[10px] sm:text-xs">{m.year}</span>
                </div>
                <div className="flex-1 pt-2 sm:pt-4">
                  <p className="text-text-primary font-medium text-sm sm:text-base">{m.eventKey}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-10 sm:py-20 bg-dark-200 border-y border-surface-border">
        <div className="container-main">
          <div className="section-header text-center">
            <div className="section-label justify-center">
              <Users className="w-3.5 h-3.5" />
              {t('ourPeople')}
            </div>
            <h2 className="section-title">{t('meetTheTeam')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center space-y-3 hover:border-primary/30"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto font-manrope font-black text-xl text-primary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-text-primary">{member.name}</h3>
                  <p className="text-primary text-xs font-semibold mt-0.5">{member.role}</p>
                </div>
                <p className="text-text-muted text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
