import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EXPERIENCES } from '../data/constants';
import ExperienceModal from './ExperienceModal';

function ExperienceCard({ exp, index, onEnquire }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative flex-shrink-0 w-[260px] sm:w-[300px] md:w-[340px] rounded-2xl overflow-hidden cursor-pointer"
      style={{ height: '420px' }}
      onClick={() => onEnquire({ ...exp, name: exp.title })}
    >
      <img
        src={exp.image}
        alt={exp.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Top decoration line & number */}
      <div className="absolute top-6 left-6 flex items-center gap-3" aria-hidden="true">
        <div className="w-8 h-[2px] bg-gradient-to-r from-[#c9a96e] to-transparent" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
          0{index + 1}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-lg font-bold text-white mb-2">{exp.title}</h3>
        <p className="text-[13px] text-[#a09a8e] leading-relaxed mb-4 transition-opacity duration-300">
          {exp.description}
        </p>
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#c9a96e] transition-all duration-300">
          Enquire
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-[#c9a96e]/20 transition-all duration-300 pointer-events-none" />
    </motion.article>
  );
}

export default function Experiences() {
  const navigate = useNavigate();
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true, margin: '-80px' });
  const [selectedExp, setSelectedExp] = useState(null);

  return (
    <section
      id="experiences"
      className="section-pad bg-[#0a0a0b] overflow-hidden"
      aria-labelledby="experiences-heading"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Heading */}
        <div ref={headRef} className="px-6 mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-4"
          >
            Experiences
          </motion.p>
          <div className="flex flex-col gap-5 items-center justify-center">
            <motion.h2
              id="experiences-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-display text-[clamp(30px,5vw,52px)] font-bold text-white"
            >
              More Than
              <br />
              <span className="gradient-text">Just A Trip.</span>
            </motion.h2>
            <motion.button
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/experiences')}
              className="btn-secondary gap-2 flex-shrink-0"
            >
              See All Types <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>

        {/* Horizontal scroll carousel */}
        <div className="relative">
          <div
            className="flex gap-5 overflow-x-auto overflow-y-hidden scrollbar-hide px-6 pb-4"
            role="list"
            aria-label="Experience types"
          >
            {EXPERIENCES.map((exp, i) => (
              <div key={exp.id} role="listitem">
                <ExperienceCard exp={exp} index={i} onEnquire={setSelectedExp} />
              </div>
            ))}
          </div>

          {/* Fade edges (decorative) */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-[#0a0a0b] to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-[#0a0a0b] to-transparent" aria-hidden="true" />
        </div>
      </div>

      <AnimatePresence>
        {selectedExp && (
          <ExperienceModal exp={selectedExp} onClose={() => setSelectedExp(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

