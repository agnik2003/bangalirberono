import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '../data/constants';

function DestinationCard({ dest, index }) {
  const cardRef = useRef(null);

  // Use scroll progress for each card to create the depth entry effect
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1", "1.2 1"] // When the card enters the viewport from the bottom
  });

  // Calculate depth transforms based on scroll
  // Starts small and deep, scales up and moves forward
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.article
      ref={cardRef}
      style={{ scale, y, opacity }}
      className="destination-card h-[380px] md:h-[420px] group relative overflow-hidden rounded-2xl will-change-transform"
      aria-label={`${dest.name}, ${dest.region}`}
    >
      {/* Image */}
      <img
        src={dest.image}
        alt={`${dest.name} — ${dest.region} travel destination`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/90 via-[#0a0a0b]/20 to-transparent transition-all duration-500" />

      {/* Tag badge */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase text-[#c9a96e] bg-[#0a0a0b]/40 backdrop-blur-sm border border-[#c9a96e]/20">
          {dest.tag}
        </span>
      </div>

      {/* Content block */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">
              {dest.name}
            </h3>
            <p className="text-[12px] md:text-[13px] text-[#c9a96e] font-semibold flex items-center gap-1.5 mb-3">
              <MapPin size={12} /> {dest.region}
            </p>
            <p className="text-[14px] md:text-[15px] text-[#a09a8e] leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {dest.description}
            </p>
          </div>

          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a96e] group-hover:border-[#c9a96e] transition-all duration-300 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowRight size={16} className="text-white group-hover:text-black" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Destinations() {
  return (
    <section id="destinations" className="py-24 md:py-32 bg-[#0a0a0b] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#c9a96e]/5 blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="text-[11px] md:text-[12px] font-bold tracking-[0.2em] text-[#c9a96e] uppercase mb-4">
            Destinations
          </span>
          <h2 className="font-display text-[clamp(40px,6vw,64px)] font-bold leading-tight text-white mb-6">
            Where Will You Go Next?
          </h2>
          <p className="text-[15px] md:text-lg text-[#a09a8e] max-w-2xl leading-relaxed">
            From mountain escapes to peaceful retreats, discover journeys designed around the way you love to travel.
          </p>
        </div>

        {/* CSS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {DESTINATIONS.map((dest, index) => (
            <DestinationCard key={dest.id} dest={dest} index={index} />
          ))}
        </div>

        <div className="mt-12 flex justify-center w-full">
          <p className="text-[13px] md:text-[14px] text-[#6b6560] italic tracking-wide font-medium flex items-center gap-2 before:content-[''] before:h-px before:w-8 before:bg-[#6b6560]/40 after:content-[''] after:h-px after:w-8 after:bg-[#6b6560]/40">
            And explore all over India and other places
          </p>
        </div>
      </div>
    </section>
  );
}
