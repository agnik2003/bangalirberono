import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';
import { NAV_LINKS, BRAND } from '../data/constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActive] = useState('home');
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route click
  const handleNavClick = (href) => {
    setMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
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
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled
            ? 'py-3 bg-[#0a0a0b]/50 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'py-5 bg-transparent'
          }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className="flex items-center gap-3 group"
            aria-label="Bangalir Berano — Home"
          >
            <img
              src="/logo.png?v=3"
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
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-base font-bold text-[#a09a8e] hover:text-white tracking-wide transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] group-hover:w-full transition-all duration-300 rounded-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
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
                  src="/logo.png?v=3"
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
            <nav className="flex flex-col flex-1 justify-center px-8 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.35 }}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="group flex items-center justify-between py-4 border-b border-white/5 text-2xl font-semibold text-[#a09a8e] hover:text-white transition-colors"
                >
                  {link.label}
                  <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 text-[#c9a96e] transition-opacity -translate-x-2 group-hover:translate-x-0 transition-transform duration-200" />
                </motion.a>
              ))}
            </nav>

            {/* Bottom CTAs */}
            <div className="px-8 pb-10 flex flex-col gap-3">
              <a href={BRAND.phoneTel} className="btn-primary justify-center text-sm py-4">
                <Phone size={16} /> Call {BRAND.phone}
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                className="btn-secondary justify-center text-sm py-4"
              >
                Send Enquiry
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
