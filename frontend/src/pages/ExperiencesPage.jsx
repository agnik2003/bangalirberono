import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EXPERIENCES } from '../data/constants';
import ExperienceModal from '../components/ExperienceModal';

function ExperienceGridCard({ exp, index, onEnquire }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full h-[460px] rounded-2xl overflow-hidden cursor-pointer bg-[#16161a]"
      onClick={() => onEnquire({ ...exp, name: exp.title })}
    >
      <img
        src={exp.image}
        alt={exp.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Top decoration line & number */}
      <div className="absolute top-6 left-6 flex items-center gap-3" aria-hidden="true">
        <div className="w-8 h-[2px] bg-gradient-to-r from-[#c9a96e] to-transparent" />
        <span className="text-[11px] font-bold tracking-[0.2em] text-white/70 uppercase drop-shadow-md">
          0{index + 1}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
        <div className="text-3xl mb-3">{exp.icon}</div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{exp.title}</h3>
        <p className="text-[14px] text-[#a09a8e] leading-relaxed mb-6 transition-opacity duration-300">
          {exp.description}
        </p>
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#c9a96e] transition-all duration-300">
          Enquire Now
          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-[#c9a96e]/30 transition-all duration-300 pointer-events-none" />
    </motion.article>
  );
}

export default function ExperiencesPage() {
  const [selectedExp, setSelectedExp] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Experiences | Bangalir Berano Tours & Travels';
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
        {/* Page hero strip */}
        <div className="pt-28 sm:pt-32 pb-8 px-4 sm:px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#c9a96e]/5 to-transparent pointer-events-none" />
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold tracking-[0.3em] text-[#c9a96e] uppercase mb-4 relative z-10"
          >
            Travel Styles
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white relative z-10"
          >
            All Experiences
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-[#a09a8e] max-w-lg mx-auto text-sm md:text-base relative z-10"
          >
            Whether you are planning a relaxed family holiday, a couple's getaway, or an adventurous mountain tour, find the travel style that fits your plan.
          </motion.p>
        </div>

        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {EXPERIENCES.map((exp, index) => (
                <ExperienceGridCard
                  key={exp.id}
                  exp={exp}
                  index={index}
                  onEnquire={setSelectedExp}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Modals */}
        <AnimatePresence>
          {selectedExp && (
            <ExperienceModal exp={selectedExp} onClose={() => setSelectedExp(null)} />
          )}
        </AnimatePresence>
    </div>
  );
}

