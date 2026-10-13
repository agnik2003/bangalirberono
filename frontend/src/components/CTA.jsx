import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data/constants';

function FAQItem({ faq, index, isOpen, toggleOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'bg-gradient-to-r from-[#c9a96e] to-[#e07b39] border-transparent shadow-lg'
          : 'bg-[#16161a] border-white/10 hover:border-[#c9a96e]/30'
      }`}
    >
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left focus:outline-none"
      >
        <h3
          className={`text-[15px] sm:text-[16px] md:text-lg font-bold pr-4 sm:pr-8 ${
            isOpen ? 'text-[#0a0a0b]' : 'text-white'
          }`}
        >
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-shrink-0 ${isOpen ? 'text-[#0a0a0b]' : 'text-[#c9a96e]'}`}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div
              className={`px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 text-[13.5px] sm:text-[14px] md:text-[15px] leading-relaxed whitespace-pre-line ${
                isOpen ? 'text-[#0a0a0b]/80 font-medium' : 'text-[#a09a8e]'
              }`}
            >
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CTA() {
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true, margin: '-80px' });
  const [openId, setOpenId] = useState(1); // First one open by default like the screenshot

  return (
    <section
      id="faq"
      className="section-pad bg-[#0a0a0b] relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Full bleed background image from original CTA */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Heavy overlays to make sure the FAQ text remains perfectly readable */}
        <div className="absolute inset-0 bg-[#0a0a0b]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-[#111114]" />
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Heading */}
        <div ref={headRef} className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[11px] font-semibold tracking-[0.25em] text-[#c9a96e] uppercase mb-4"
          >
            Got Questions?
          </motion.p>
          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-[clamp(32px,5vw,52px)] font-bold text-white leading-tight"
          >
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              index={i}
              isOpen={openId === faq.id}
              toggleOpen={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

