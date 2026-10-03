import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';

const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// 4 Latest Working Video IDs with AI-Generated Genuine Adi Kailash Thumbnails
const YOUTUBE_VIDEOS = [
  {
    id: 'GEhVDWKetiA', // Real ID
    title: 'Adi Kailash Trip - 2026 | Part - 8',
    views: '16 views',
    time: '1d ago',
    duration: '5:05',
    customImage: '/adi_kailash_peak_1791034852625.jpg'
  },
  {
    id: 'C3bRpOMFy-Y', // Real ID
    title: 'Adi Kailash Trip - 2026 | Part - 7',
    views: '29 views',
    time: '1d ago',
    duration: '4:29',
    customImage: '/adi_kailash_trek_1791034946665.jpg'
  },
  {
    id: '7cB2n5qbxa8', // Real ID
    title: 'Adi Kailash Trip - 2026 | Part - 6',
    views: '67 views',
    time: '8d ago',
    duration: '3:38',
    customImage: '/adi_kailash_lake_1791034974409.jpg'
  },
  {
    id: 'PXnyC5i1wkk', // Real ID
    title: 'Adi Kailash Trip - 2026 | Part - 3',
    views: '210 views',
    time: '1mo ago',
    duration: '6:57',
    customImage: '/adi_kailash_camp_1791034993069.jpg'
  }
];

function VideoCard({ video, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: '-50px' });

  // Use custom image or fallback to high-quality default if maxres is missing
  const thumbnailUrl = video.customImage || `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  const fallbackUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="group relative flex flex-col gap-3 rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
    >
      {/* Video Container (16:9) */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#16161a] border border-white/5">
        {isHovered ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1`}
            title={video.title}
            className="absolute inset-0 w-full h-full scale-[1.15] pointer-events-none" // scale hides youtube UI edges
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumbnailUrl}
              onError={(e) => { e.currentTarget.src = fallbackUrl; }}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
              <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90">
                <Play size={20} className="ml-1" fill="currentColor" />
              </div>
            </div>
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
              {video.duration}
            </div>
          </>
        )}
      </div>

      {/* Video Details */}
      <div className="px-1">
        <h3 className="text-white text-sm md:text-base font-semibold line-clamp-2 leading-snug group-hover:text-[#c9a96e] transition-colors">
          {video.title}
        </h3>
        <p className="text-[#a09a8e] text-[11px] md:text-xs mt-1.5 flex items-center gap-1.5">
          {video.views} • {video.time}
        </p>
      </div>
    </motion.div>
  );
}

export default function JourneySection() {
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true, margin: '-50px' });

  return (
    <section className="py-24 md:py-32 bg-[#0a0a0b] relative border-t border-white/5" id="vlogs">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header & Channel Info */}
        <div ref={headRef} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <img
                src="/logo.png?v=3"
                alt="Bangalir Berano Logo"
                className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-[0_0_20px_rgba(201,169,110,0.3)] object-cover"
              />
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                  Bangalir Berano
                </h2>
                <a
                  href="https://www.youtube.com/@bangalirberano/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a09a8e] text-sm hover:text-white transition-colors flex items-center gap-1"
                >
                  @bangalirberano • 2.71K subscribers
                </a>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[#a09a8e] text-sm md:text-base max-w-xl"
            >
              Welcome to Bangalir Berano channel — Your Passport to Adventure! Experience our curated journeys through our cinematic travel vlogs.
            </motion.p>
          </div>

          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            href="https://www.youtube.com/@bangalirberano/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#c9a96e] hover:border-[#c9a96e] hover:text-black text-white font-semibold text-sm transition-all duration-300 group whitespace-nowrap"
          >
            <YoutubeIcon size={18} className="text-[#ff0000] group-hover:text-black transition-colors" />
            Watch Latest Videos
            <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
          </motion.a>
        </div>

        {/* 2-Column Grid for 4 Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {YOUTUBE_VIDEOS.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
