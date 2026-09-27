import { motion } from 'framer-motion';
import {
  Sparkles, Eye, Globe, Heart, Users, Award, Shield, CheckCircle2,
  BookOpen, Mic, Video, Landmark, GraduationCap, Compass, Camera, Quote
} from 'lucide-react';
import logo from '../assets/logo.jpeg';

const missionPoints = [
  { icon: Mic, title: "Voice for Communities", text: "To give a voice to communities and ordinary people across Sri Lanka." },
  { icon: Shield, title: "Truth & Responsible Journalism", text: "To promote truth, fairness and responsible independent journalism." },
  { icon: Landmark, title: "History & Heritage", text: "To document our history, culture, traditions and elders for future generations." },
  { icon: Eye, title: "Social Awareness", text: "To create awareness on important social and community issues." },
  { icon: GraduationCap, title: "Youth Development", text: "To encourage education, youth development and social responsibility." },
  { icon: Video, title: "Connecting Stories", text: "To connect people through meaningful stories, interviews and documentaries." },
];

const valuesList = [
  { name: "Truth", color: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400" },
  { name: "Integrity", color: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400" },
  { name: "Humanity", color: "from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400" },
  { name: "Responsibility", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400" },
  { name: "Respect", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400" },
  { name: "Independence", color: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400" },
];

const whatWeDoList = [
  { emoji: "📰", title: "News & Special Reports", desc: "In-depth investigative reports and verified news wire." },
  { emoji: "🎙️", title: "Interviews & People’s Voices", desc: "Biographical conversations with ordinary and unsung icons." },
  { emoji: "🎥", title: "Documentaries", desc: "High-quality video productions celebrating real journeys." },
  { emoji: "🏛️", title: "History & Heritage Documentation", desc: "Preserving historical records and traditional Sri Lankan legacy." },
  { emoji: "👥", title: "Community Stories", desc: "Amplifying grassroots initiatives and everyday achievements." },
  { emoji: "🎓", title: "Education & Youth Development", desc: "Fostering leadership, civic learning, and youth empowerment." },
  { emoji: "🌍", title: "Social Awareness", desc: "Highlighting humanitarian causes, health, and environment." },
  { emoji: "📸", title: "Cultural & Historical Archives", desc: "Curating photographic and digital archives for posterity." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-dark-100 text-text-primary pb-20">
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative bg-dark-200 border-b border-surface-border py-12 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-red-glow opacity-60 pointer-events-none" />
        <div className="container-main relative z-10 text-center max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block relative"
          >
            <img
              src={logo}
              alt="PeopleFirst Media Channel Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-primary/40 shadow-glow-red mx-auto"
            />
          </motion.div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Independent Community Media
            </div>
            <h1 className="font-manrope font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
              About <span className="text-gradient-red">PeopleFirst</span>
            </h1>
          </div>

          <p className="text-text-secondary text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal">
            People First Media Channel is an independent community media initiative dedicated to giving people a voice and bringing truthful, meaningful stories to the public. We focus on community issues, social awareness, education, culture, heritage and the voices of ordinary people.
          </p>

          {/* Bilingual Tagline Banner */}
          <div className="pt-4">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-dark-300/90 border border-primary/30 rounded-2xl px-6 py-4 shadow-xl">
              <span className="font-manrope font-bold text-white text-sm sm:text-base">
                Media for the People • Service for the Truth
              </span>
              <span className="hidden sm:inline text-primary">|</span>
              <span className="font-bold text-primary text-sm sm:text-base tracking-wide" style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                மக்களுக்காக ஊடகம் • உண்மைக்காக சேவை
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VISION ────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 relative">
        <div className="container-main max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8 sm:p-12 bg-gradient-to-br from-gold/10 via-dark-200 to-dark-300 border-2 border-gold/40 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-4 left-6 opacity-10">
              <Quote className="w-24 h-24 text-gold" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-bold uppercase tracking-widest mx-auto">
              Our Vision
            </div>
            <blockquote className="font-manrope font-black text-xl sm:text-3xl text-white leading-relaxed italic max-w-2xl mx-auto relative z-10">
              “A society where every voice is heard, every story matters, and truth serves the people.”
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ── OUR MISSION ───────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-dark-200/50 border-y border-surface-border">
        <div className="container-main">
          <div className="text-center space-y-3 mb-12">
            <div className="section-label justify-center">Core Purpose</div>
            <h2 className="font-manrope font-black text-2xl sm:text-4xl text-white">Our Mission</h2>
            <p className="text-text-muted text-sm max-w-xl mx-auto">
              Dedicated pillars guiding our daily journalism and community archiving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missionPoints.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-6 bg-dark-200 border-surface-border hover:border-primary/40 space-y-3 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-manrope font-bold text-lg text-white">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20">
        <div className="container-main">
          <div className="text-center space-y-3 mb-12">
            <div className="section-label justify-center">Foundational Principles</div>
            <h2 className="font-manrope font-black text-2xl sm:text-4xl text-white">Our Values</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {valuesList.map((val, i) => (
              <motion.div
                key={val.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`bg-gradient-to-b ${val.color} border rounded-2xl p-5 text-center shadow-lg hover:scale-105 transition-transform`}
              >
                <span className="font-manrope font-extrabold text-base sm:text-lg block">
                  {val.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-dark-200/50 border-y border-surface-border">
        <div className="container-main">
          <div className="text-center space-y-3 mb-12">
            <div className="section-label justify-center">Coverage &amp; Scope</div>
            <h2 className="font-manrope font-black text-2xl sm:text-4xl text-white">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatWeDoList.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="card p-6 bg-dark-200 border-surface-border hover:border-primary/30 space-y-2 transition-all"
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <h3 className="font-manrope font-bold text-base text-white">{item.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR SPECIAL INITIATIVE ────────────────────────────────────────── */}
      <section className="py-12 sm:py-24 relative">
        <div className="container-main max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8 sm:p-12 bg-gradient-to-r from-dark-300 via-dark-200 to-dark-300 border-2 border-primary/40 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Landmark className="w-48 h-48 text-primary" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Our Special Initiative
              </div>
              <h2 className="font-manrope font-black text-2xl sm:text-4xl text-white">
                எமது முதுசங்கள் <span className="text-text-muted font-light">|</span> Our Elders – Our Heritage
              </h2>
            </div>

            <p className="text-text-secondary text-sm sm:text-lg leading-relaxed max-w-3xl">
              Through this initiative, we document the lives, memories, contributions and stories of respected elders and community figures through video, photography, interviews and written records, preserving their legacy for future generations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-dark-100/80 border border-surface-border p-4 rounded-xl flex items-center gap-3">
                <Video className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs text-text-secondary font-semibold">Video Documentaries &amp; Interviews</span>
              </div>
              <div className="bg-dark-100/80 border border-surface-border p-4 rounded-xl flex items-center gap-3">
                <Camera className="w-5 h-5 text-gold shrink-0" />
                <span className="text-xs text-text-secondary font-semibold">Photography &amp; Historical Archives</span>
              </div>
              <div className="bg-dark-100/80 border border-surface-border p-4 rounded-xl flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-text-secondary font-semibold">Written Biographical Records</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

