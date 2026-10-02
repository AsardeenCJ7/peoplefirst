import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { extractYouTubeId } from '../../utils/youtube';

export default function VideoPlayer({ videoId: rawVideoId, title, thumbnail }) {
  const [playing, setPlaying] = useState(false);

  const videoId = extractYouTubeId(rawVideoId) || 'iTvo6_eh48k';
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="video-wrapper relative rounded-xl overflow-hidden bg-dark-100 shadow-card border border-surface-border">
      {!playing ? (
        <div
          className="absolute inset-0 cursor-pointer group"
          onClick={() => setPlaying(true)}
        >
          {/* Thumbnail */}
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
          ) : (
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
          )}
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/70 transition-colors" />

          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 sm:w-20 h-16 sm:h-20 bg-primary hover:bg-primary-light rounded-full flex items-center justify-center shadow-glow-red transition-all"
            >
              <Play className="w-8 sm:w-9 h-8 sm:h-9 text-white ml-1" fill="white" />
            </motion.div>
            {title && (
              <p className="text-white font-manrope font-bold text-center text-xs sm:text-sm max-w-md px-4 line-clamp-2 drop-shadow-md">
                {title}
              </p>
            )}
            <span className="text-[11px] text-white/80 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm flex items-center gap-1.5">
              Click to Play Documentary in Player
            </span>
          </div>

          {/* YouTube branding & Direct Link */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-black/70 hover:bg-red-600 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-black">
          <iframe
            src={embedUrl}
            title={title || 'YouTube video player'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
