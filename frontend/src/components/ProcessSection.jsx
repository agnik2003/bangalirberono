import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { JOURNEY_STEPS } from '../data/constants';

function Step({ step, index, total }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const isLast = index === total - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: 45, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.15, duration: 0.8, type: 'spring', stiffness: 80, damping: 20 }}
      style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
      className="relative flex gap-4 sm:gap-6"
    >
      {/* Left — Number + connector */}
      <div className="flex flex-col items-center flex-shrink-0" aria-hidden="true">
        {/* Number circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.15 + index * 0.18, type: 'spring', stiffness: 200, damping: 15 }}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-sm font-black"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(224,123,57,0.10) 100%)',
            border: '1px solid rgba(201,169,110,0.25)',
          }}
        >
          <span className="gradient-text text-base sm:text-lg font-black">{step.number}</span>
          {/* Pulsing dot */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#c9a96e] flex items-center justify-center">
            <span className="w-full h-full rounded-full bg-[#c9a96e] animate-ping absolute opacity-60" />
          </span>
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <motion.div
            className="w-px flex-1 mt-3 min-h-[50px] sm:min-h-[60px]"
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: 0.4 + index * 0.18, duration: 0.6, ease: 'easeOut' }}
            style={{
              background: 'linear-gradient(to bottom, rgba(201,169,110,0.4), rgba(201,169,110,0.05))',
            }}
          />
        )}
      </div>

      {/* Right — Content */}
      <div className="pb-8 sm:pb-12">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2 leading-tight">{step.title}</h3>
        <p className="text-[13px] sm:text-[14px] text-[#6b6560] leading-relaxed max-w-md">{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true, margin: '-80px' });

  return (
    <section
      className="section-pad bg-[#0a0a0b] relative overflow-hidden"
      aria-labelledby="process-heading"
    >
      {/* Decorative grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" aria-hidden="true">
        <div
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — Heading */}
          <div ref={headRef} className="lg:sticky lg:top-32">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-5"
            >
              How It Works
            </motion.p>
            <motion.h2
              id="process-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-display text-[clamp(32px,5vw,54px)] font-bold text-white leading-tight mb-6"
            >
              From Dream
              <br />
              <span className="gradient-text">To Destination.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[15px] text-[#6b6560] leading-relaxed mb-8 max-w-sm"
            >
              Planning a family holiday should be exciting and relaxing. Here is how easy it is to travel with us.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.5 }}
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Start Planning
            </motion.button>
          </div>

          {/* Right — Steps */}
          <div className="flex flex-col">
            {JOURNEY_STEPS.map((step, i) => (
              <Step key={step.number} step={step} index={i} total={JOURNEY_STEPS.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

