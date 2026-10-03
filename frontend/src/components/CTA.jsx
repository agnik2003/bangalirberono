import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { BRAND } from '../data/constants';

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Full bleed image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
          alt="Mountain landscape — plan your next journey"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Heavy overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/60 via-[#0a0a0b]/50 to-[#0a0a0b]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/40 to-transparent" />
      </div>

      {/* Decorative element */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#c9a96e]/[0.06]" />
      </div>

      <div className="relative z-10 py-28 md:py-36 max-w-[1400px] mx-auto px-6">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-5"
          >
            Start Your Journey
          </motion.p>

          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display text-[clamp(32px,6vw,64px)] font-bold text-white leading-tight mb-5"
          >
            Where Will Your
            <br />
            Next Journey
            <br />
            <span className="gradient-text">Take You?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[16px] text-[#a09a8e] leading-relaxed mb-10 max-w-md"
          >
            Tell us where you want to go. We'll help you plan the journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-sm gap-2 px-7 py-4"
            >
              Plan My Trip <ArrowRight size={16} />
            </button>

            <a
              href={BRAND.phoneTel}
              className="btn-secondary text-sm gap-2 px-7 py-4"
              aria-label={`Call us at ${BRAND.phone}`}
            >
              <Phone size={16} /> Call {BRAND.phone}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
