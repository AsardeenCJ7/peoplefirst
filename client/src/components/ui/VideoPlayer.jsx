import { useState } from 'react';
import YouTube from 'react-youtube';
import { motion } from 'framer-motion';
import { Play, Loader } from 'lucide-react';
import { extractYouTubeId } from '../../utils/youtube';

export default function VideoPlayer({ videoId: rawVideoId, title, thumbnail }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoId = extractYouTubeId(rawVideoId);

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      color: 'white',
    },
  };

  if (!videoId) return null;

  return (
    <div className="video-wrapper rounded-xl overflow-hidden bg-dark-100 shadow-card">
      {!playing ? (
        <div
          className="absolute inset-0 cursor-pointer group"
          onClick={() => {
            setPlaying(true);
            setLoading(true);
          }}
        >
          {/* Thumbnail */}
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />

          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 bg-primary hover:bg-primary-light rounded-full flex items-center justify-center shadow-glow-red transition-colors"
            >
              <Play className="w-9 h-9 text-white ml-1" fill="white" />
            </motion.div>
            {title && (
              <p className="text-white font-manrope font-semibold text-center text-sm max-w-xs px-4 text-shadow">
                {title}
              </p>
            )}
          </div>

          {/* YouTube branding */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center">
              <Play className="w-2 h-2 text-white ml-0.5" fill="white" />
            </div>
            <span className="text-white text-xs font-semibold">YouTube</span>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-100 z-10">
              <Loader className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={() => setLoading(false)}
            className="w-full h-full"
            iframeClassName="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
