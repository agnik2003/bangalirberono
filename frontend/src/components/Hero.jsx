import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, MapPin, ChevronDown, ChevronLeft, ChevronRight, Info, Calendar, MessageCircle, Flame, Users, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API } from '../data/constants';
import { TourDetailsModal, BookModal } from './Destinations';
import { generateWhatsAppBookingUrl } from '../utils/whatsapp';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDestIndex, setCurrentDestIndex] = useState(0);
  const [selectedDestDetails, setSelectedDestDetails] = useState(null);
  const [selectedDestBook, setSelectedDestBook] = useState(null);
  const [resetTimerKey, setResetTimerKey] = useState(0);

  // ── Fetch packages from backend ──────────────────────────────────────────
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API}/packages`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const upcoming = data.data.filter(p => !p.status || p.status === 'Upcoming');
          setPackages(upcoming.length > 0 ? upcoming : data.data);
        }
      } catch (err) {
        console.error('Failed to load hero packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // ── Auto-rotate carousel (Runs continuously + works with manual clicks) ──
  const displayList = packages;
  useEffect(() => {
    if (displayList.length <= 1 || selectedDestDetails || selectedDestBook) return;
    const timer = setInterval(() => {
      setCurrentDestIndex(prev => (prev + 1) % displayList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayList.length, resetTimerKey, selectedDestDetails, selectedDestBook]);

  const handlePrev = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (displayList.length <= 1) return;
    setCurrentDestIndex(prev => (prev - 1 + displayList.length) % displayList.length);
    setResetTimerKey(k => k + 1);
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (displayList.length <= 1) return;
    setCurrentDestIndex(prev => (prev + 1) % displayList.length);
    setResetTimerKey(k => k + 1);
  };

  const handleSelectSlide = (idx, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentDestIndex(idx);
    setResetTimerKey(k => k + 1);
  };

  const currentDest = displayList.length > 0
    ? (displayList[currentDestIndex % displayList.length] || displayList[0])
    : null;

  const tagText = currentDest
    ? (currentDest.tag || (currentDest.category && (Array.isArray(currentDest.category) ? currentDest.category[0] : currentDest.category)) || 'Tour')
    : '';
  const placesText = currentDest ? (currentDest.route || currentDest.region || '') : '';

  const scrollToSection = href => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── GSAP desktop parallax (desktop only: >=1024px) ────────────────────────
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
      tl.to(bgRef.current, { x: '-8%', y: '15%', scale: 1.15, ease: 'none' }, 0);
      tl.to(contentRef.current, { y: '-150px', opacity: 0, ease: 'power1.out' }, 0);
      tl.to(cardsRef.current, { y: '-250px', x: '5%', opacity: 0, scale: 0.95, ease: 'power1.out' }, 0);
    });
    return () => mm.revert();
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full overflow-x-hidden bg-[#0a0a0b]"
      aria-label="Hero section"
      style={{ minHeight: '100svh' }}
    >
      {/* ── BACKGROUND ─────────────────────────────────────────────────── */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full origin-bottom">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85"
          alt="Himalayan mountain landscape"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Gradient overlays — luminous mountain visibility & high text legibility on mobile; desktop preserved */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[#0a0a0b]/10 lg:bg-[#0a0a0b]/18" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/40 via-[#0a0a0b]/10 to-[#0a0a0b]/75 lg:from-[#0a0a0b]/50 lg:via-[#0a0a0b]/10 lg:to-[#0a0a0b]/80" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/75 via-[#0a0a0b]/45 to-transparent" />
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-30 w-full max-w-[1400px] mx-auto
          px-4 sm:px-6 md:px-8 lg:px-10
          pt-24 sm:pt-28 md:pt-32 lg:pt-28
          pb-20 sm:pb-28 md:pb-28
          lg:min-h-[100svh] lg:flex lg:items-center min-w-0 box-border"
      >
        {/* Two-column grid on desktop, single column on mobile */}
        <div className="w-full grid lg:grid-cols-12 lg:gap-12 items-center min-w-0">

          {/* ── LEFT COLUMN: text & CTAs ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="w-full lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left min-w-0"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass border-white/10 mb-3.5 sm:mb-5 shadow-lg max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-pulse shrink-0" />
              <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-[#c9a96e] uppercase truncate">
                Travel · Explore · Experience
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-display font-bold leading-[1.08] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] mb-3.5 sm:mb-5 max-w-full break-words"
              style={{ fontSize: 'clamp(28px, 7.5vw, 72px)' }}
            >
              Travel Beyond<br />
              <span className="gradient-text">The Ordinary.</span>
            </h1>

            {/* Description */}
            <p className="text-[13px] sm:text-[15px] md:text-[16px] text-[#f4efe6] font-normal leading-relaxed max-w-xl mb-5 sm:mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-1 sm:px-0">
              Thoughtfully organized tours, comfortable stays, and genuine hospitality. From snow peaks to serene beaches, travel comfortably with people who care for you like family.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto mb-5 sm:mb-6 justify-center lg:justify-start max-w-[340px] sm:max-w-none mx-auto lg:mx-0 min-w-0">
              <button
                onClick={() => scrollToSection('#destinations')}
                className="btn-primary w-full sm:w-auto justify-center text-[13px] sm:text-sm py-2.5 sm:py-3 px-5 sm:px-7 min-h-[44px] min-w-0"
              >
                <span className="truncate">Explore Journeys</span>
                <ArrowRight size={14} className="shrink-0" />
              </button>
              <button
                onClick={() => scrollToSection('#contact')}
                className="btn-secondary w-full sm:w-auto justify-center text-[13px] sm:text-sm py-2.5 sm:py-3 px-5 sm:px-7 min-h-[44px] min-w-0"
              >
                <span className="truncate">Plan My Trip</span>
              </button>
            </div>

            {/* Rating Bar */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#c9a96e]/20 bg-gradient-to-r from-[#c9a96e]/15 to-transparent backdrop-blur-md shadow-[0_0_20px_rgba(201,169,110,0.05)] max-w-full">
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="text-[10px] font-bold tracking-[0.15em] text-[#c9a96e] uppercase hidden sm:block">Google</span>
                <div className="flex shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="text-[#f5c842] fill-[#f5c842]" />
                  ))}
                </div>
              </div>
              <div className="w-px h-3.5 sm:h-4 bg-white/15 hidden sm:block shrink-0" />
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 min-w-0">
                <span className="text-white font-bold font-display text-xs sm:text-base leading-none">4.8</span>
                <span className="text-[10.5px] sm:text-xs text-[#a09a8e] truncate">from 220+ Reviews</span>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Destination Card ───────────────────────── */}
          {(loading || currentDest) && (
            <motion.div
              ref={cardsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="w-full lg:col-span-5 flex justify-center lg:justify-end min-w-0 mt-6 sm:mt-8 lg:mt-0"
            >
              {loading ? (
                /* Skeleton */
                <div className="w-full max-w-[380px] sm:max-w-sm lg:max-w-md bg-[#141419]/95 rounded-2xl md:rounded-3xl overflow-hidden border border-[#c9a96e]/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-pulse flex flex-col mx-auto lg:mx-0 box-border min-w-0">
                  <div className="w-full h-[160px] sm:h-[210px] md:h-[235px] bg-[#1a1a22] relative">
                    <div className="absolute top-3 left-3 w-24 h-5 rounded-full bg-white/10" />
                    <div className="absolute top-3 right-3 w-20 h-5 rounded-full bg-white/10" />
                  </div>
                  <div className="p-3 sm:p-4 md:p-5 bg-[#141419] flex flex-col gap-2.5 sm:gap-3 border-t border-white/5 box-border min-w-0">
                    <div>
                      <div className="h-5 bg-white/10 rounded-lg w-3/4 mb-2" />
                      <div className="h-3.5 bg-white/5 rounded-md w-1/2" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full min-w-0">
                      <div className="w-full h-11 bg-white/10 rounded-xl" />
                      <div className="w-full h-11 bg-[#c9a96e]/20 rounded-xl" />
                    </div>
                    <div className="w-full h-11 bg-[#25D366]/15 rounded-xl" />
                  </div>
                </div>
              ) : currentDest ? (
                <div
                  className="w-full max-w-[380px] sm:max-w-sm lg:max-w-md bg-[#141419]/95 rounded-2xl md:rounded-3xl overflow-hidden border border-[#c9a96e]/25 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(201,169,110,0.08)] flex flex-col mx-auto lg:mx-0 box-border min-w-0"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDest._id || currentDest.id || currentDestIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: 'easeInOut' }}
                      className="flex flex-col w-full min-w-0"
                    >
                      {/* Card image */}
                      <div
                        onClick={() => setSelectedDestDetails(currentDest)}
                        className="relative w-full h-[160px] sm:h-[210px] md:h-[235px] overflow-hidden bg-black/60 cursor-pointer group"
                      >
                        <img
                          src={currentDest.image}
                          alt={`${currentDest.name} — next adventure`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-black/40 pointer-events-none" />

                        {/* Category & Urgent Seats badges */}
                        <div className="absolute top-0 left-0 right-0 p-2 sm:p-3.5 z-10 flex items-center justify-between gap-1.5 pointer-events-none min-w-0">
                          {/* Left: Next Adventure & Category Tag */}
                          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 overflow-hidden">
                            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-[0.1em] uppercase text-[#c9a96e] bg-[#0a0a0b]/90 backdrop-blur-md border border-[#c9a96e]/30 shadow-md shrink-0 whitespace-nowrap leading-tight">
                              Next Adventure
                            </span>
                            {tagText && (
                              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold text-white bg-black/80 backdrop-blur-md border border-white/15 shadow-md truncate min-w-0 max-w-[75px] xs:max-w-[100px] sm:max-w-[140px] leading-tight">
                                {tagText}
                              </span>
                            )}
                          </div>

                          {/* Right: Seats Left Badge (Flashing / Glowing when < 15) */}
                          {currentDest.seatsLeft != null && currentDest.seatsLeft !== '' && (() => {
                            const s = Number(currentDest.seatsLeft);
                            const isUrgent = !isNaN(s) && s < 15 && s > 0;
                            const isSoldOut = !isNaN(s) && s === 0;

                            if (isSoldOut) {
                              return (
                                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-wider uppercase text-red-300 bg-red-950/85 backdrop-blur-md border border-red-500/40 flex items-center gap-1 shadow-md shrink-0">
                                  <AlertCircle size={10} className="text-red-400" /> Sold Out
                                </span>
                              );
                            }

                            if (isUrgent) {
                              return (
                                <span className="urgent-seats-badge px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-extrabold tracking-wider uppercase text-white bg-gradient-to-r from-red-600/90 via-orange-600/90 to-amber-500/90 backdrop-blur-md border border-amber-300 flex items-center gap-1 sm:gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] select-none shrink-0 pointer-events-auto">
                                  <Flame size={11} className="text-yellow-200 fill-yellow-300 animate-pulse shrink-0" />
                                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Hurry! Only {s} Left!</span>
                                </span>
                              );
                            }

                            return (
                              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-wider uppercase text-amber-300 bg-amber-950/80 backdrop-blur-md border border-amber-500/30 flex items-center gap-1 shadow-md shrink-0 pointer-events-auto">
                                <Users size={10} className="text-amber-400" /> {currentDest.seatsLeft} Seats
                              </span>
                            );
                          })()}
                        </div>

                        {/* Hover hint */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="px-3 py-1.5 rounded-full bg-[#0a0a0b]/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-xl">
                            <Info size={12} className="text-[#c9a96e]" /> Click for Tour Details
                          </span>
                        </div>

                        {/* Prev & Next Carousel Buttons */}
                        {displayList.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={handlePrev}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/75 hover:bg-[#c9a96e] text-white hover:text-[#0a0a0b] border border-white/20 hover:border-[#c9a96e] backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.6)] active:scale-90 cursor-pointer group/nav"
                              aria-label="Previous tour package"
                              title="Previous Tour"
                            >
                              <ChevronLeft size={18} className="transition-transform group-hover/nav:-translate-x-0.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNext}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/75 hover:bg-[#c9a96e] text-white hover:text-[#0a0a0b] border border-white/20 hover:border-[#c9a96e] backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.6)] active:scale-90 cursor-pointer group/nav"
                              aria-label="Next tour package"
                              title="Next Tour"
                            >
                              <ChevronRight size={18} className="transition-transform group-hover/nav:translate-x-0.5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Card info panel */}
                      <div className="p-3 sm:p-4 md:p-5 bg-[#141419] flex flex-col gap-2.5 sm:gap-3 border-t border-white/5 box-border min-w-0">
                        {/* Title + route */}
                        <div className="min-w-0">
                          <h3
                            onClick={() => setSelectedDestDetails(currentDest)}
                            className="text-[15px] sm:text-xl md:text-2xl font-display font-bold text-white leading-tight cursor-pointer hover:text-[#c9a96e] transition-colors truncate mb-1"
                            title={currentDest.name}
                          >
                            {currentDest.name}
                          </h3>
                          {placesText && (
                            <p className="text-[11px] sm:text-[13px] text-[#a09a8e] flex items-center gap-1 min-w-0">
                              <MapPin size={11} className="text-[#c9a96e] shrink-0" />
                              <span className="truncate">{placesText}</span>
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 w-full min-w-0">
                          {/* Details + Book Now side-by-side with 50/50 grid */}
                          <div className="grid grid-cols-2 gap-2 w-full min-w-0">
                            <button
                              type="button"
                              onClick={() => setSelectedDestDetails(currentDest)}
                              className="w-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#c9a96e]/50 text-white font-semibold py-2.5 px-2 rounded-xl text-[12px] sm:text-[13px] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 min-h-[44px] min-w-0 box-border"
                            >
                              <Info size={13} className="text-[#c9a96e] shrink-0" />
                              <span className="truncate">Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedDestBook(currentDest)}
                              className="w-full bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] font-bold py-2.5 px-2 rounded-xl text-[12px] sm:text-[13px] transition-transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1.5 shadow-[0_4px_18px_rgba(201,169,110,0.35)] cursor-pointer min-h-[44px] min-w-0 box-border"
                            >
                              <Calendar size={13} className="shrink-0" />
                              <span className="truncate">Book Now</span>
                            </button>
                          </div>

                          {/* WhatsApp Button */}
                          <a
                            href={generateWhatsAppBookingUrl(currentDest)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#0a0a0b] border border-[#25D366]/40 hover:border-[#25D366] font-bold py-2.5 px-3 rounded-xl text-[12px] sm:text-[13px] transition-all duration-300 flex items-center justify-center gap-2 group/wa shadow-[0_4px_16px_rgba(37,211,102,0.12)] hover:shadow-[0_4px_22px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 active:scale-95 cursor-pointer min-h-[44px] min-w-0 box-border"
                          >
                            <MessageCircle size={14} className="text-[#25D366] group-hover/wa:text-[#0a0a0b] transition-colors shrink-0" />
                            <span className="truncate">Book via WhatsApp</span>
                          </a>

                          {/* Slide Pagination & Navigation Controls */}
                          {displayList.length > 1 && (
                            <div className="flex items-center justify-between pt-2 px-0.5 border-t border-white/5 mt-0.5">
                              {/* Clickable indicator dots */}
                              <div className="flex items-center gap-1.5" role="tablist" aria-label="Tour slides">
                                {displayList.map((_, idx) => {
                                  const isActive = idx === (currentDestIndex % displayList.length);
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={(e) => handleSelectSlide(idx, e)}
                                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                        isActive
                                          ? 'w-6 bg-gradient-to-r from-[#c9a96e] to-[#e07b39] shadow-[0_0_8px_rgba(201,169,110,0.8)]'
                                          : 'w-1.5 bg-white/25 hover:bg-white/50'
                                      }`}
                                      aria-label={`Go to tour slide ${idx + 1}`}
                                      title={`Tour ${idx + 1}`}
                                    />
                                  );
                                })}
                              </div>

                              {/* Counter & quick step buttons */}
                              <div className="flex items-center gap-2">
                                <span className="text-[10.5px] font-mono font-semibold tracking-wider text-[#a09a8e] bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                                  <span className="text-[#c9a96e] font-bold">{String((currentDestIndex % displayList.length) + 1).padStart(2, '0')}</span> / {String(displayList.length).padStart(2, '0')}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="w-6 h-6 rounded-md bg-white/5 hover:bg-[#c9a96e] text-[#a09a8e] hover:text-[#0a0a0b] flex items-center justify-center transition-colors cursor-pointer text-xs"
                                    title="Previous tour"
                                    aria-label="Previous tour"
                                  >
                                    <ChevronLeft size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-6 h-6 rounded-md bg-white/5 hover:bg-[#c9a96e] text-[#a09a8e] hover:text-[#0a0a0b] flex items-center justify-center transition-colors cursor-pointer text-xs"
                                    title="Next tour"
                                    aria-label="Next tour"
                                  >
                                    <ChevronRight size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : null}
            </motion.div>
          )}

        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 hidden sm:flex flex-col items-center gap-1 text-[#6b6560] pointer-events-none"
      >
        <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase">Scroll to Travel</span>
        <div className="animate-bounce mt-0.5">
          <ChevronDown size={16} className="text-[#c9a96e]" />
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {selectedDestDetails && (
          <TourDetailsModal
            dest={selectedDestDetails}
            onClose={() => setSelectedDestDetails(null)}
            onOpenBook={setSelectedDestBook}
          />
        )}
        {selectedDestBook && (
          <BookModal
            dest={selectedDestBook}
            onClose={() => setSelectedDestBook(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
