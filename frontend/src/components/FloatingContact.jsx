import { motion } from 'framer-motion';
import { Phone, Calendar } from 'lucide-react';
import { BRAND } from '../data/constants';

export default function FloatingContact() {
  const scrollToContact = (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ==================================================
          DESKTOP FLOATING PILL (Unchanged visual identity)
          ================================================== */}
      <motion.div
        className="floating-pill hidden md:flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 glass-dark p-2 rounded-full border border-white/10 shadow-2xl">
          <a
            href={BRAND.phoneTel}
            className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-full hover:bg-white/5 transition-colors group"
            aria-label={`Call us at ${BRAND.phone}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#e07b39] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform pulse-glow-anim">
              <Phone size={14} className="text-black" />
            </div>
            <div>
              <p className="text-[10px] text-[#6b6560] leading-none mb-0.5">Need help planning?</p>
              <p className="text-[13px] font-semibold text-white">{BRAND.phone}</p>
            </div>
          </a>

          <div className="w-px h-8 bg-white/10 mx-1"></div>

          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 hover:bg-[#25D366]/30 hover:scale-110 transition-all text-[#25D366] mr-1"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.062-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </div>
      </motion.div>

      {/* ==================================================
          MOBILE FIXED BOTTOM BAR (Premium touch-friendly)
          ================================================== */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[999] md:hidden bg-[#0c0c10] border-t border-[#c9a96e]/30 shadow-[0_-12px_40px_rgba(0,0,0,0.95)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ delay: 2, type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Top luxury gold hairline accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent pointer-events-none" />

        <div className="flex items-center p-2.5 sm:p-4 gap-2 sm:gap-3 max-w-full min-w-0">
          {/* Call Us Button */}
          <a
            href={BRAND.phoneTel}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 rounded-xl bg-[#16161e] border border-white/15 hover:border-[#c9a96e]/50 shadow-md active:scale-[0.98] transition-all"
            aria-label="Call Us"
          >
            <Phone size={14} className="text-[#c9a96e] shrink-0" />
            <span className="text-[12px] sm:text-sm font-semibold text-white truncate">Call</span>
          </a>

          {/* WhatsApp Button */}
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 rounded-xl bg-[#092215] border border-[#25D366]/40 hover:border-[#25D366] shadow-[0_2px_12px_rgba(37,211,102,0.18)] active:scale-[0.98] transition-all"
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#25D366] fill-current shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.062-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="text-[12px] sm:text-sm font-semibold text-[#25D366] truncate">WhatsApp</span>
          </a>

          {/* Plan Trip Button */}
          <a
            href="#contact"
            onClick={scrollToContact}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 rounded-xl bg-gradient-to-r from-[#d49a3f] via-[#ba7c2b] to-[#c46820] active:scale-[0.98] transition-all shadow-[0_4px_18px_rgba(212,154,63,0.45)] text-white"
            aria-label="Plan Your Trip"
          >
            <Calendar size={14} className="text-white shrink-0" />
            <span className="text-[12px] sm:text-sm font-bold text-white truncate">Plan</span>
          </a>
        </div>
      </motion.div>
    </>
  );
}

