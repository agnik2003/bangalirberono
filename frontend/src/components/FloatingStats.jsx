import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { STATS } from '../data/constants';

import { animate } from 'framer-motion';

function CountingNumber({ value, inView }) {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!inView || !nodeRef.current) return;

    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) {
      nodeRef.current.textContent = value;
      return;
    }

    const targetNum = parseFloat(numMatch[0]);
    const prefix = value.slice(0, numMatch.index);
    const suffix = value.slice(numMatch.index + numMatch[0].length);
    const isFloat = numMatch[0].includes('.');

    const controls = animate(0, targetNum, {
      duration: 2.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(currentValue) {
        if (nodeRef.current) {
          const formatted = isFloat ? currentValue.toFixed(1) : Math.floor(currentValue);
          nodeRef.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [inView, value]);

  return <span ref={nodeRef}>0{value.replace(/[\d.]+/g, '')}</span>;
}

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center px-3 sm:px-6 py-5 sm:py-8 group"
    >
      <motion.p
        className="stat-number"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.2 + index * 0.15, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <CountingNumber value={stat.value} inView={inView} />
      </motion.p>
      <p className="text-[11px] sm:text-[13px] font-medium text-[#6b6560] mt-1.5 sm:mt-2 tracking-wide uppercase text-center">
        {stat.label}
      </p>
    </motion.div>
  );
}

export default function FloatingStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="stats" ref={ref} className="relative bg-[#0a0a0b] py-2" aria-label="Key statistics">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,110,0.06) 0%, rgba(224,123,57,0.04) 100%)',
            border: '1px solid rgba(201,169,110,0.12)',
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/10 to-transparent" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="relative">
                <StatCard stat={stat} index={i} />
                {/* Decorative vertical accent line */}
                {i === 0 && (
                  <div className="absolute top-1/4 bottom-1/4 right-0 w-px bg-gradient-to-b from-transparent via-[#c9a96e]/20 to-transparent hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

