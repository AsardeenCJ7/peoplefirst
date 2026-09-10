import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, MapPin, CheckCircle, ChevronRight } from 'lucide-react';

export default function AchieverCard({ achiever, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link
        to={`/achiever/${achiever.id}`}
        className="group block card overflow-hidden hover:border-primary/40 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-dark-300">
          <img
            src={achiever.thumbnail}
            alt={achiever.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <span className="badge-red text-[10px]">
              {achiever.category}
            </span>
            {achiever.verified && (
              <div className="flex items-center gap-1 bg-dark-100/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-success" />
                <span className="text-[10px] font-bold text-success">Verified</span>
              </div>
            )}
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-glow-red">
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Bottom: Year */}
          <div className="absolute bottom-3 left-3">
            <span className="text-[11px] text-white/70 font-medium">{achiever.year}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-manrope font-bold text-text-primary text-base leading-snug group-hover:text-primary transition-colors">
              {achiever.name}
            </h3>
            <p className="text-text-muted text-xs mt-1 line-clamp-2 leading-relaxed">
              {achiever.title}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-surface-border">
            <div className="flex items-center gap-1 text-text-muted text-xs">
              <MapPin className="w-3 h-3" />
              <span>{achiever.location}</span>
            </div>
            <div className="flex items-center gap-1 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Read Story</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
