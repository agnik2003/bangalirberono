import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

// Inline social icons (lucide-react v1 doesn't include these)
const YoutubeIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
import { BRAND } from '../data/constants';

const SOCIAL_CARDS = [
  {
    id: 'youtube',
    icon: YoutubeIcon,
    platform: 'YouTube',
    headline: 'Watch Bangalir Berano',
    description: 'Travel stories, destination guides, trip vlogs and beautiful moments from our journeys.',
    cta: 'Visit YouTube',
    url: BRAND.youtube,
    color: '#FF0000',
    bgImage: '/social_youtube_1791035498683.jpg',
  },
  {
    id: 'facebook',
    icon: FacebookIcon,
    platform: 'Facebook',
    headline: 'Join The Community',
    description: 'Connect with fellow travellers, get updates and be part of the Bangalir Berano community.',
    cta: 'Visit Facebook',
    url: BRAND.facebook,
    color: '#1877F2',
    bgImage: '/social_facebook_1791035512671.jpg',
  },
];

export default function SocialSection() {
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true, margin: '-60px' });

  return (
    <section
      className="section-pad bg-[#0a0a0b]"
      aria-labelledby="social-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Heading */}
        <div ref={headRef} className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-4"
          >
            Stay Connected
          </motion.p>
          <motion.h2
            id="social-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-[clamp(28px,4.5vw,48px)] font-bold text-white mb-3"
          >
            Follow The Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[15px] text-[#6b6560]"
          >
            Travel stories, destinations, tips and experiences from Bangalir Berano.
          </motion.p>
        </div>

        {/* Social cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {SOCIAL_CARDS.map((card, i) => (
            <motion.a
              key={card.id}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.65 }}
              className="group relative rounded-3xl overflow-hidden h-72 block"
              aria-label={`${card.cta} — opens in new tab`}
            >
              {/* Background image */}
              <img
                src={card.bgImage}
                alt={card.platform}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />
              {/* Platform color tint on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ backgroundColor: card.color }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: card.color }}
                  >
                    <card.icon size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white/80 tracking-wide">{card.platform}</span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{card.headline}</h3>
                  <p className="text-[14px] text-white/60 mb-5 leading-relaxed max-w-xs">{card.description}</p>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold text-white group-hover:bg-white/20 transition-colors">
                    {card.cta} <ExternalLink size={13} />
                  </div>
                </div>
              </div>

              {/* Corner arrow */}
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                <ArrowRight size={14} className="text-white -rotate-45" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
