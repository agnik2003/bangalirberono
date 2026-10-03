import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Map, Compass, Headphones, Camera } from 'lucide-react';
import { WHY_US } from '../data/constants';

const ICON_MAP = {
  Map,
  Compass,
  HeadphonesIcon: Headphones,
  Camera,
};

function BenefitCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = ICON_MAP[item.icon] || Map;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="group relative p-7 rounded-2xl border border-white/5 bg-[#16161a] hover:border-[#c9a96e]/20 transition-all duration-400 hover:-translate-y-1"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a96e]/15 to-[#e07b39]/10 border border-[#c9a96e]/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon size={22} className="text-[#c9a96e]" />
      </div>

      {/* Number */}
      <span className="absolute top-6 right-6 text-[11px] font-bold tracking-[0.2em] text-[#3a3530]">
        0{index + 1}
      </span>

      <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
      <p className="text-[14px] text-[#6b6560] leading-relaxed">{item.description}</p>

      {/* Hover glow accent */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/0 to-transparent group-hover:via-[#c9a96e]/25 transition-all duration-400" />
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true, margin: '-80px' });

  return (
    <section
      className="section-pad bg-[#111114] relative overflow-hidden"
      aria-labelledby="why-us-heading"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden="true">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#c9a96e]/3 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#e07b39]/3 blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative">
        {/* Heading */}
        <div ref={headRef} className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-4"
          >
            Why Bangalir Berano
          </motion.p>
          <motion.h2
            id="why-us-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-[clamp(28px,4.5vw,50px)] font-bold text-white max-w-xl mx-auto leading-tight"
          >
            Travel With People Who Understand Travel.
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_US.map((item, i) => (
            <BenefitCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
