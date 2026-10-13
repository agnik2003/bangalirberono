import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS, BRAND } from '../data/constants';
import ExperienceModal from './ExperienceModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActive] = useState('home');
  const menuRef = useRef(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [customTourModal, setCustomTourModal] = useState(false);
  const [mobileDestOpen, setMobileDestOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 60);

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100 && !menuOpen) {
        setHidden(true); // Scrolling down
      } else if (currentScrollY < lastScrollY.current || currentScrollY <= 100) {
        setHidden(false); // Scrolling up or at top
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  // Close menu on route click
  const handleNavClick = (href) => {
    setMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
    
    // Page routes (no hash) — use router navigation
    if (!href.startsWith('#')) {
      navigate(href);
      return;
    }

    // Hash routes — if not on home, go to home then scroll
    if (location.pathname !== '/') {
      navigate('/' + href);
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return;
    }

    // Hash routes — on home, just scroll
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle body scroll lock
  useEffect(() => {
    if (menuOpen) document.body.classList.add('mobile-menu-open');
    else document.body.classList.remove('mobile-menu-open');
    return () => document.body.classList.remove('mobile-menu-open');
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled
            ? 'py-2 sm:py-3 bg-[#0a0a0b]/50 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'py-2.5 sm:py-5 bg-transparent'
          }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className="flex items-center gap-3 group"
            aria-label="Bangalir Berano — Home"
          >
            <img
              src="/logo.png?v=4"
              alt="Bangalir Berano Logo"
              className="w-11 h-11 rounded-full shadow-lg group-hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-shadow duration-300 object-cover"
            />
            <div className="flex flex-col">
              <p className="text-[13px] sm:text-[15px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#c9a96e] uppercase leading-none mb-1">Bangalir Berano</p>
              <p className="hidden sm:block text-[10px] sm:text-[11px] text-[#8a837c] tracking-[0.25em] uppercase leading-none">Tours &amp; Travels</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className={link.label === 'Destinations' ? 'relative group/navItem' : ''}>
                {link.label === 'Destinations' ? (
                  <>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                      className="text-base font-bold text-[#a09a8e] group-hover/navItem:text-white tracking-wide transition-colors duration-200 relative group flex items-center gap-1 py-4"
                    >
                      {link.label}
                      <span className="absolute bottom-3 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] group-hover/navItem:w-full transition-all duration-300 rounded-full" />
                    </a>
                    {/* Dropdown */}
                    <div className="absolute top-[100%] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/navItem:opacity-100 group-hover/navItem:visible transition-all duration-300 z-[100] pt-4">
                      <div className="bg-[#0a0a0b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] min-w-[220px] flex flex-col p-2.5 transform origin-top group-hover/navItem:scale-100 scale-95 transition-transform duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent opacity-40" />
                        
                        <a
                          href="/destinations"
                          onClick={(e) => { e.preventDefault(); handleNavClick('/destinations'); }}
                          className="px-4 py-3.5 text-[14px] font-semibold text-[#a09a8e] hover:text-white hover:bg-[#c9a96e]/10 rounded-xl transition-all flex items-center justify-between group/link"
                        >
                          Group Tours
                          <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-[#c9a96e]" />
                        </a>
                        
                        <button
                          onClick={() => { setMenuOpen(false); setCustomTourModal(true); }}
                          className="px-4 py-3.5 text-[14px] font-semibold text-[#a09a8e] hover:text-white hover:bg-[#c9a96e]/10 rounded-xl transition-all text-left flex items-center justify-between group/link w-full mt-1"
                        >
                          Custom Tours
                          <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-[#c9a96e]" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="text-base font-bold text-[#a09a8e] hover:text-white tracking-wide transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] group-hover:w-full transition-all duration-300 rounded-full" />
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); handleNavClick('/contact'); }}
              className="btn-primary text-[14px] font-semibold px-6 py-2.5"
            >
              Plan Your Trip <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl glass text-white hover:border-[#c9a96e]/30 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[1000] bg-[#0a0a0b] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png?v=4"
                  alt="Bangalir Berano Logo"
                  className="w-10 h-10 rounded-full object-cover shadow-lg"
                />
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[#c9a96e] uppercase">Bangalir Berano</span>
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl glass text-white"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col flex-1 overflow-y-auto px-6 sm:px-8 py-4 justify-start sm:justify-center gap-1 sm:gap-2">
              {NAV_LINKS.map((link, i) => (
                link.label === 'Destinations' ? (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.07, duration: 0.35 }}
                    className="flex flex-col border-b border-white/5"
                  >
                    <button
                      onClick={() => setMobileDestOpen(!mobileDestOpen)}
                      className="group flex items-center justify-between py-4 text-[22px] font-semibold text-[#a09a8e] hover:text-white transition-colors text-left w-full"
                    >
                      {link.label}
                      <motion.div animate={{ rotate: mobileDestOpen ? 90 : 0 }}>
                        <ArrowRight size={18} className={`${mobileDestOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-[#c9a96e] transition-all -translate-x-2 group-hover:translate-x-0 duration-200`} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {mobileDestOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex flex-col overflow-hidden"
                        >
                          <div className="flex flex-col gap-1 pl-4 pb-4 border-l border-white/10 ml-2 mt-1">
                            <a
                              href="/destinations"
                              onClick={(e) => { e.preventDefault(); handleNavClick('/destinations'); }}
                              className="py-2.5 text-[18px] font-semibold text-[#8a837c] hover:text-[#c9a96e] transition-colors"
                            >
                              Group Tours
                            </a>
                            <button
                              onClick={() => { setMenuOpen(false); setCustomTourModal(true); }}
                              className="py-2.5 text-[18px] font-semibold text-[#8a837c] hover:text-[#c9a96e] transition-colors text-left"
                            >
                              Custom Tours
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.07, duration: 0.35 }}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="group flex items-center justify-between py-4 border-b border-white/5 text-[22px] font-semibold text-[#a09a8e] hover:text-white transition-colors"
                  >
                    {link.label}
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 text-[#c9a96e] transition-opacity -translate-x-2 group-hover:translate-x-0 transition-transform duration-200" />
                  </motion.a>
                )
              ))}
            </nav>

            {/* Bottom CTAs */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-10 pt-2 flex flex-col gap-3 shrink-0">
              <a href={BRAND.phoneTel} className="btn-primary justify-center text-sm py-4">
                <Phone size={16} /> Call {BRAND.phone}
              </a>
              <a
                href="/contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('/contact'); }}
                className="btn-secondary justify-center text-sm py-4"
              >
                Send Enquiry
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {customTourModal && (
          <ExperienceModal 
            exp={{ title: 'Custom Tours', icon: '✨', description: 'Have a specific destination or travel date in mind? Tell us where you want to go and we will tailor it for you.' }} 
            onClose={() => setCustomTourModal(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

