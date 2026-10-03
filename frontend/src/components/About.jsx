import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';

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
      {/* Background image blur */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=60"
          alt=""
          className="w-full h-full object-cover opacity-[0.04] scale-110 blur-sm"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#111114]/90" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[440px] hidden lg:block"
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <img
                src="/taj_mahal_1791035480349.jpg"
                alt="Beautiful travel destination — Bangalir Berano journeys"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent" />
            </div>
            {/* Premium Overlay Badge */}
            <div className="absolute bottom-8 right-8 glass-dark rounded-full p-2 pr-6 overflow-hidden flex items-center gap-4 border border-[#c9a96e]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a96e]/20 to-transparent border border-[#c9a96e]/30 flex items-center justify-center shrink-0">
                <Compass size={18} className="text-[#c9a96e]" />
              </div>
              
              {/* Marquee container with true CSS mask fade edges */}
              <div 
                className="overflow-hidden whitespace-nowrap relative w-[160px]"
                style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
              >
                
                <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 7 }}
                  className="inline-flex w-max"
                >
                  <span className="text-[10px] font-bold text-[#f4f0ea] mr-8 uppercase tracking-[0.2em]">Exploring All Over India</span>
                  <span className="text-[10px] font-bold text-[#f4f0ea] mr-8 uppercase tracking-[0.2em]">Exploring All Over India</span>
                </motion.div>
              </div>
            </div>
            {/* Corner accent */}
            <div className="absolute -bottom-3 -left-3 w-24 h-24 rounded-2xl border-2 border-[#c9a96e]/15" aria-hidden="true" />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-5">
              About Us
            </p>
            <h2
              id="about-heading"
              className="font-display text-[clamp(28px,4vw,48px)] font-bold text-white mb-6 leading-tight"
            >
              Your Journey.
              <br />
              <span className="gradient-text">Our Responsibility.</span>
            </h2>
            <p className="text-[16px] text-[#a09a8e] leading-relaxed mb-6 max-w-lg">
              Bangalir Berano is a travel-focused community and tour initiative
              dedicated to helping travellers discover destinations through
              thoughtfully planned journeys and useful travel information.
            </p>
            <p className="text-[15px] text-[#6b6560] leading-relaxed mb-10 max-w-lg">
              From the hills of Darjeeling to the monasteries of Bhutan — every
              trip we organize carries our commitment to making travel comfortable,
              memorable and worth every moment.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.youtube.com/c/BANGALIRBERANO"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-2"
              >
                Explore Our Story <ArrowRight size={16} />
              </a>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary gap-2"
              >
                Plan A Trip
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
