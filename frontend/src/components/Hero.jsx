import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, MapPin, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESTINATIONS } from '../data/constants';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef(null);
  const [currentDestIndex, setCurrentDestIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDestIndex((prev) => (prev + 1) % DESTINATIONS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let mm = gsap.matchMedia();

    // 3D Scroll Effect ONLY for desktop/laptop (>= 768px)
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1, // Smooth scrub
        }
      });

      // Background scales slightly and pans left for a classy 3D horizontal slide effect
      tl.to(bgRef.current, { x: '-8%', y: '15%', scale: 1.15, ease: 'none' }, 0);

      // UI elements slide up and fade out for parallax
      tl.to(contentRef.current, { y: '-150px', opacity: 0, ease: 'power1.out' }, 0);
      tl.to(cardsRef.current, { y: '-250px', x: '5%', opacity: 0, scale: 0.95, ease: 'power1.out' }, 0);
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#0a0a0b] flex flex-col justify-center"
      aria-label="Hero section"
    >
      {/* ==================================================
          CINEMATIC 3D BACKGROUND
          ================================================== */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full origin-bottom">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85"
          alt="Himalayan mountain landscape"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Heavy gradient at the bottom to blend seamlessly into the next dark section */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/30 via-transparent to-[#0a0a0b]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/80 md:from-[#0a0a0b]/60 via-transparent to-transparent" />
      </div>

      {/* ==================================================
          UI & TYPOGRAPHY
          ================================================== */}

      <div
        ref={contentRef}
        className="relative z-30 flex-1 h-full flex items-center max-w-[1400px] mx-auto px-5 md:px-6 w-full pt-28 pb-32 md:py-0"
      >
        <div className="w-full grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* LEFT COLUMN: TYPOGRAPHY & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full glass border-white/10 mb-6 md:mb-8 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-pulse" />
              <span className="text-[9px] md:text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase">
                Travel · Explore · Experience
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-[clamp(40px,9vw,88px)] font-bold leading-[1.05] text-white mb-5 md:mb-6">
              Travel Beyond
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="gradient-text">The Ordinary.</span>
            </h1>

            {/* Subtext */}
            <p className="text-[clamp(14px,3.5vw,19px)] text-[#a09a8e] leading-relaxed max-w-xl mb-8 md:mb-10">
              Curated journeys, unforgettable experiences and beautiful destinations —
              planned with care for every kind of traveller.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto relative z-40 mb-10 lg:mb-14">
              <button
                onClick={() => scrollToSection('#destinations')}
                className="btn-primary justify-center text-[14px] md:text-sm gap-2 min-h-[48px] md:min-h-0 px-7 py-3.5 w-full sm:w-auto"
              >
                Explore Journeys <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollToSection('#contact')}
                className="btn-secondary justify-center text-[14px] md:text-sm gap-2 min-h-[48px] md:min-h-0 px-7 py-3.5 w-full sm:w-auto"
              >
                Plan My Trip
              </button>
            </div>

            {/* Horizontal Rating Bar */}
            <div className="flex items-center gap-4 md:gap-6 px-6 py-3.5 rounded-full border border-[#c9a96e]/20 bg-gradient-to-r from-[#c9a96e]/15 to-transparent backdrop-blur-md shadow-[0_0_20px_rgba(201,169,110,0.05)]">
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                <span className="text-[10px] md:text-[11px] text-[#c9a96e] font-bold tracking-[0.15em] uppercase hidden md:block">Google</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-[#f5c842] fill-[#f5c842]" />
                  ))}
                </div>
              </div>
              <div className="h-6 w-px bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2">
                <p className="text-white font-bold font-display text-xl leading-none">4.8</p>
                <span className="text-[11px] md:text-sm text-[#a09a8e]">from 220+ Reviews</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: BIG DESTINATION CARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="lg:col-span-5 flex justify-center lg:justify-end w-full"
            ref={cardsRef} // Use cardsRef here for parallax scroll effect!
          >
            <div className="glass-dark rounded-2xl md:rounded-3xl overflow-hidden w-full max-w-sm lg:max-w-md shadow-2xl backdrop-blur-xl border border-white/10 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDestIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <div className="h-[250px] md:h-[350px] lg:h-[400px] relative overflow-hidden">
                    <img
                      src={DESTINATIONS[currentDestIndex].image}
                      alt={`${DESTINATIONS[currentDestIndex].name} — next adventure`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/30 to-transparent" />

                    {/* Top tags */}
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-[#c9a96e] uppercase drop-shadow-lg">
                        Next Adventure
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 glass px-2.5 py-1 rounded text-[9px] md:text-[10px] text-white font-semibold">
                      {DESTINATIONS[currentDestIndex].tag || "Explore"}
                    </div>

                    {/* Bottom Content within the image box */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-1 drop-shadow-md">
                          {DESTINATIONS[currentDestIndex].name}
                        </h3>
                        <p className="text-[12px] md:text-sm text-[#a09a8e] flex items-center gap-1.5 drop-shadow-md">
                          <MapPin size={14} className="text-[#c9a96e]" /> {DESTINATIONS[currentDestIndex].region}
                        </p>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#e07b39] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(201,169,110,0.4)]">
                        <ArrowRight size={18} className="text-black" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 md:gap-2 text-[#6b6560]"
      >
        <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase">Scroll to Travel</span>
        <div className="animate-bounce mt-1">
          <ChevronDown size={16} className="md:w-[18px] md:h-[18px] text-[#c9a96e]" />
        </div>
      </motion.div>
    </section>
  );
}
