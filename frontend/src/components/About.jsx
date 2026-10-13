import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

const YoutubeIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const socialCards = [
  {
    id: 'youtube',
    href: 'https://www.youtube.com/c/BANGALIRBERANO',
    platform: 'YouTube',
    handle: 'Bangalir Berano',
    cta: 'Subscribe Now',
    Icon: YoutubeIcon,
    bg: '/social_youtube_1791035498683.jpg',
    overlayFrom: 'rgba(180,0,0,0.72)',
    overlayTo: 'rgba(0,0,0,0.55)',
    iconBg: 'rgba(255,255,255,0.18)',
    glowColor: '#ff4444',
    badgeText: 'text-red-300',
    badge: 'YouTube Channel',
  },
  {
    id: 'facebook',
    href: 'https://www.facebook.com/share/g/1cFHScGGe1/?mibextid=wwXIfr',
    platform: 'Facebook',
    handle: 'Bangalir Berano',
    cta: 'Join Community',
    Icon: FacebookIcon,
    bg: '/social_facebook_1791035512671.jpg',
    overlayFrom: 'rgba(10,60,180,0.72)',
    overlayTo: 'rgba(0,0,0,0.55)',
    iconBg: 'rgba(255,255,255,0.18)',
    glowColor: '#3b82f6',
    badgeText: 'text-blue-300',
    badge: 'Facebook Group',
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/bangalirberano?rpxt=MWR3OWMyMndpY2diZA%3D%3D&utm_source=qr',
    platform: 'Instagram',
    handle: '@bangalirberano',
    cta: 'Follow Us',
    Icon: InstagramIcon,
    bg: '/taj_mahal_1791035480349.jpg',
    overlayFrom: 'rgba(140,30,130,0.72)',
    overlayTo: 'rgba(180,60,0,0.5)',
    iconBg: 'rgba(255,255,255,0.18)',
    glowColor: '#e879f9',
    badgeText: 'text-pink-300',
    badge: 'Instagram',
  },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="about"
      ref={ref}
      className="section-pad bg-[#111114] relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* subtle bg */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111114] via-[#111114] to-[#1a1610]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* ══ LEFT: 3 Social Media Cards ══ */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {socialCards.map((card, i) => (
              <motion.a
                key={card.id}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl overflow-hidden block min-h-[120px] sm:h-[140px]"
                style={{ textDecoration: 'none' }}
                aria-label={`Visit Bangalir Berano on ${card.platform}`}
              >
                {/* Background photo */}
                <img
                  src={card.bg}
                  alt={card.platform}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(120deg, ${card.overlayFrom} 0%, ${card.overlayTo} 100%)`,
                    opacity: 0.88,
                  }}
                />
                <div className="absolute inset-0 group-hover:opacity-70 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)' }}
                />

                {/* Glow border on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 0 2px ${card.glowColor}55` }}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex items-center px-4 sm:px-6 py-4 sm:py-0 gap-3.5 sm:gap-5">
                  {/* Icon circle */}
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm
                      group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: card.iconBg,
                      border: `1.5px solid rgba(255,255,255,0.25)`,
                      boxShadow: `0 8px 32px ${card.glowColor}60`,
                    }}
                  >
                    <card.Icon size={24} className="text-white drop-shadow sm:w-[26px] sm:h-[26px]" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-[10px] font-bold tracking-[0.22em] uppercase ${card.badgeText} mb-1 block`}
                    >
                      {card.badge}
                    </span>
                    <h4 className="text-white font-bold text-[16px] leading-tight truncate group-hover:text-white/90 transition-colors">
                      {card.handle}
                    </h4>
                    <p className="text-white/60 text-[12px] mt-0.5">{card.cta} →</p>
                  </div>

                  {/* Right arrow badge */}
                  <div
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                      opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2
                      transition-all duration-400"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                  >
                    <ExternalLink size={14} className="text-white" />
                  </div>
                </div>

                {/* Bottom shimmer */}
                <div className="absolute bottom-0 left-0 h-[3px] w-full">
                  <div
                    className="h-full w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full"
                    style={{ background: `linear-gradient(to right, ${card.glowColor}, transparent)` }}
                  />
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* ══ RIGHT: Text ══ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left z-10"
          >
            <p className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-5">About Us</p>
            <h2
              id="about-heading"
              className="font-display text-[clamp(28px,4vw,48px)] font-bold text-white mb-6 leading-tight"
            >
              Your Journey.
              <br />
              <span className="gradient-text">Our Responsibility.</span>
            </h2>
            <p className="text-[16px] text-[#a09a8e] leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
              Bangalir Berano began with a heartfelt love for travel: bringing fellow Bengalis and holiday lovers together to experience India and beyond with comfort, safety, and genuine care. We take care of every small arrangement so you can simply relax and enjoy each day on tour.
            </p>

            <div className="text-left mx-auto lg:mx-0 max-w-lg mb-10">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">WHY TRAVEL WITH BANGALIR BERANO™?</h3>
              <ul className="space-y-2 mb-6 text-[#888176]">
                {[
                  '8+ Years of Travel Experience',
                  'Small & Comfortable Group Tours',
                  'Carefully Selected Hotels & Vehicles',
                  'Honest Pricing with No Hidden Costs',
                  'Well-Planned, Relaxed Itineraries',
                  'Reliable Support Throughout Your Journey',
                  'Travel with Trust, Safety & Care',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] mt-2 shrink-0 shadow-[0_0_8px_rgba(201,169,110,0.6)]" />
                    <span className="text-[14px] font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[15px] font-medium italic text-[#c9a96e]">
                "With us, you don't just visit places, you travel with people who care for you like family."
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary gap-2"
              >
                Plan A Trip <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

