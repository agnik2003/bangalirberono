import { API } from '../data/constants';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DestinationCard, TourDetailsModal, BookModal } from '../components/Destinations';
import { generateWhatsAppBookingUrl } from '../utils/whatsapp';
import {
  Calendar, Clock, MapPin, Users, Info, MessageCircle,
  ChevronLeft, ChevronRight, Flame, AlertCircle, Sparkles,
  LayoutList, X
} from 'lucide-react';

// Module-level cache so navigating to this page is 100% instant (0ms delay)
let cachedDestinations = null;
let cachedCategories = null;

// Modal displaying ALL upcoming trips in a comprehensive executive list
function AllUpcomingTripsModal({ trips, onClose, onOpenDetails, onOpenBook }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const upcomingList = trips.filter(p => !p.status || p.status === 'Upcoming');
  const displayTrips = upcomingList.length > 0 ? upcomingList : trips;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#121217] border border-[#c9a96e]/30 rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(201,169,110,0.1)] relative my-auto max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#c9a96e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#e07b39]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a96e] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c9a96e]" />
              </span>
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#c9a96e] uppercase">
                Upcoming Departures Schedule
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">
              All Upcoming Trips
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[12px] font-semibold bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30">
              {displayTrips.length} Tours Available
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable List of Upcoming Trips */}
        <div className="py-5 overflow-y-auto space-y-4 flex-1 pr-1 custom-scrollbar relative z-10">
          {displayTrips.map((trip) => (
            <div
              key={trip._id || trip.id || trip.name}
              className="bg-[#171720]/90 hover:bg-[#1a1a24] border border-white/10 hover:border-[#c9a96e]/40 rounded-2xl p-4 sm:p-5 transition-all shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
            >
              {/* Trip Info */}
              <div className="space-y-2.5 flex-1 min-w-0">
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Seats Left Urgent Badge (Glowing when < 15) */}
                  {trip.seatsLeft !== null && trip.seatsLeft !== undefined && trip.seatsLeft !== '' && (() => {
                    const s = Number(trip.seatsLeft);
                    if (!isNaN(s) && s < 15 && s > 0) {
                      return (
                        <span className="urgent-seats-badge inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-red-600/90 via-orange-600/90 to-amber-500/90 text-white border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.55)]">
                          <Flame size={12} className="text-yellow-200 fill-yellow-300 animate-pulse" />
                          Hurry! Only {s} Left!
                        </span>
                      );
                    }
                    if (!isNaN(s) && s === 0) {
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                          <AlertCircle size={12} className="text-red-400" />
                          Sold Out
                        </span>
                      );
                    }
                    return (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <Users size={12} className="text-emerald-400" />
                        {trip.seatsLeft} Seats Left
                      </span>
                    );
                  })()}

                  {trip.date && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium bg-white/5 text-[#d4cfc5] border border-white/10">
                      <Calendar size={12} className="text-[#c9a96e]" />
                      {trip.date}
                    </span>
                  )}

                  {trip.duration && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium bg-white/5 text-[#d4cfc5] border border-white/10">
                      <Clock size={12} className="text-[#c9a96e]" />
                      {trip.duration}
                    </span>
                  )}

                  {trip.price && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30 ml-auto lg:ml-0">
                      {trip.price}
                    </span>
                  )}
                </div>

                {/* Trip Title */}
                <h3
                  onClick={() => {
                    onClose();
                    onOpenDetails(trip);
                  }}
                  className="text-lg sm:text-xl font-display font-bold text-white hover:text-[#c9a96e] transition-colors cursor-pointer"
                >
                  {trip.name}
                </h3>

                {/* Route / Places Covered */}
                {(trip.route || trip.region) && (
                  <p className="text-[12.5px] sm:text-[13px] text-[#a09a8e] flex items-center gap-1.5 line-clamp-1">
                    <MapPin size={13} className="text-[#c9a96e] shrink-0" />
                    <span>{trip.route || trip.region}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons for Each Trip */}
              <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                {/* 1. Details */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDetails(trip);
                  }}
                  className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[12px] sm:text-[12.5px] font-semibold border border-white/10 hover:border-[#c9a96e]/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm active:scale-95"
                >
                  <Info size={14} className="text-[#c9a96e]" />
                  <span>Details</span>
                </button>

                {/* 2. Book Now */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBook(trip);
                  }}
                  className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] text-[12px] sm:text-[12.5px] font-bold shadow-[0_2px_12px_rgba(201,169,110,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Calendar size={14} />
                  <span>Book Now</span>
                </button>

                {/* 3. Book via WhatsApp */}
                <a
                  href={generateWhatsAppBookingUrl(trip)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#0a0a0b] border border-[#25D366]/40 hover:border-[#25D366] text-[12px] sm:text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm active:scale-95"
                >
                  <MessageCircle size={14} />
                  <span>Book via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Sleek Single-Line Rolling Summary Ticker for Upcoming Departures
function UpcomingTripsSummary({
  trips,
  loading,
  onOpenDetails,
  onOpenBook,
  onOpenViewAll,
  modalOpen
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter only upcoming trips if status is defined
  const upcomingList = trips.filter(p => !p.status || p.status === 'Upcoming');
  const displayTrips = upcomingList.length > 0 ? upcomingList : trips;

  // Auto-slide effect (rolling ticker)
  useEffect(() => {
    if (displayTrips.length <= 1 || isPaused || modalOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayTrips.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [displayTrips.length, isPaused, modalOpen]);

  // Keep index within bounds if trips change
  const activeIndex = displayTrips.length > 0 ? currentSlide % displayTrips.length : 0;
  const activeTrip = displayTrips[activeIndex];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + displayTrips.length) % displayTrips.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % displayTrips.length);
  };

  if (loading || !activeTrip) return null;

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-6 md:mb-8 relative z-20">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative bg-[#141418]/95 backdrop-blur-md border border-[#c9a96e]/30 hover:border-[#c9a96e]/50 rounded-2xl md:rounded-full py-2.5 px-3.5 sm:px-5 shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_15px_rgba(201,169,110,0.06)] transition-all flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 overflow-hidden group"
      >
        {/* Subtle Ambient Gold Flare */}
        <div className="absolute -left-10 top-0 w-32 h-full bg-[#c9a96e]/10 blur-xl pointer-events-none" />

        {/* Left Badge + Rolling Ticker Content */}
        <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
          {/* Static Pill: Upcoming */}
          <div className="flex items-center gap-2 shrink-0 px-2.5 py-1 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a96e] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a96e]" />
            </span>
            <span className="text-[10.5px] sm:text-[11px] font-bold tracking-wider text-[#c9a96e] uppercase whitespace-nowrap">
              Upcoming
            </span>
          </div>

          {/* Rolling / Auto-Sliding Details Line */}
          <div className="min-w-0 flex-1 relative h-8 overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTrip._id || activeTrip.id || activeIndex}
                initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(3px)' }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2 sm:gap-2.5 text-[12.5px] sm:text-[13px] text-[#d4cfc5] whitespace-nowrap w-full py-0.5 overflow-hidden"
              >
                {/* Full Trip Name - Never Truncated */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(activeTrip);
                  }}
                  className="font-bold text-white hover:text-[#c9a96e] transition-colors cursor-pointer shrink-0 whitespace-nowrap text-left text-[13px] sm:text-[13.5px]"
                  title={activeTrip.name}
                >
                  {activeTrip.name}
                </button>

                {/* Seats Left Urgent Pill (Glowing when < 15) */}
                {activeTrip.seatsLeft !== null && activeTrip.seatsLeft !== undefined && activeTrip.seatsLeft !== '' && (() => {
                  const s = Number(activeTrip.seatsLeft);
                  if (!isNaN(s) && s < 15 && s > 0) {
                    return (
                      <span className="urgent-seats-badge shrink-0 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-red-600/90 via-orange-600/90 to-amber-500/90 text-white border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.55)] whitespace-nowrap">
                        <Flame size={12} className="text-yellow-200 fill-yellow-300 animate-pulse" />
                        Hurry! Only {s} Left!
                      </span>
                    );
                  }
                  if (!isNaN(s) && s === 0) {
                    return (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 whitespace-nowrap">
                        <AlertCircle size={11} className="text-red-400" />
                        Sold Out
                      </span>
                    );
                  }
                  return (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                      <Users size={11} className="text-emerald-400" />
                      {activeTrip.seatsLeft} Seats Left
                    </span>
                  );
                })()}

                {/* Date */}
                {activeTrip.date && (
                  <>
                    <span className="text-white/20 hidden md:inline shrink-0">•</span>
                    <span className="hidden md:inline-flex items-center gap-1 text-[#c9a96e] text-[12px] shrink-0 font-medium whitespace-nowrap">
                      <Calendar size={12} className="shrink-0" />
                      {activeTrip.date}
                    </span>
                  </>
                )}

                {/* Price */}
                {activeTrip.price && (
                  <>
                    <span className="text-white/20 hidden sm:inline shrink-0">•</span>
                    <span className="hidden sm:inline font-bold text-white shrink-0 whitespace-nowrap">
                      {activeTrip.price}
                    </span>
                  </>
                )}

                {/* Route / Places Visited (Shown on wide screens) */}
                {(activeTrip.route || activeTrip.region) && (
                  <>
                    <span className="text-white/20 hidden 2xl:inline shrink-0">•</span>
                    <span className="hidden 2xl:inline-flex items-center gap-1 text-[#a09a8e] text-[12px] truncate max-w-[240px]">
                      <MapPin size={12} className="text-[#c9a96e] shrink-0" />
                      <span className="truncate">{activeTrip.route || activeTrip.region}</span>
                    </span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section: View All + The 3 Required Buttons + Slide Navigation */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-1.5 sm:gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5 relative z-10">
          {/* View All Button */}
          {onOpenViewAll && (
            <button
              type="button"
              id="ticker-view-all-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenViewAll();
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#c9a96e]/10 hover:bg-[#c9a96e]/20 text-[#c9a96e] hover:text-white border border-[#c9a96e]/30 hover:border-[#c9a96e]/60 text-[11px] sm:text-[11.5px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm active:scale-95"
              title="View all upcoming trips list"
            >
              <LayoutList size={13} className="text-[#c9a96e]" />
              <span>View All</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#c9a96e]/25 text-[#c9a96e] font-bold">
                {displayTrips.length}
              </span>
            </button>
          )}

          {/* 1. Details */}
          <button
            type="button"
            id="ticker-details-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(activeTrip);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11.5px] sm:text-[12px] font-semibold border border-white/10 hover:border-[#c9a96e]/50 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-sm active:scale-95"
          >
            <Info size={13} className="text-[#c9a96e]" />
            <span>Details</span>
          </button>

          {/* 2. Book Now */}
          <button
            type="button"
            id="ticker-book-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenBook(activeTrip);
            }}
            className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] text-[11.5px] sm:text-[12px] font-bold shadow-[0_2px_10px_rgba(201,169,110,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <Calendar size={13} />
            <span>Book Now</span>
          </button>

          {/* 3. Book via WhatsApp */}
          <a
            id="ticker-whatsapp-btn"
            href={generateWhatsAppBookingUrl(activeTrip)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#0a0a0b] border border-[#25D366]/40 hover:border-[#25D366] text-[11.5px] sm:text-[12px] font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-sm active:scale-95"
          >
            <MessageCircle size={13} />
            <span className="hidden sm:inline">Book via WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>

          {/* Slide Arrows */}
          {displayTrips.length > 1 && (
            <div className="flex items-center pl-1 border-l border-white/10 ml-0.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous trip"
                className="w-6 h-6 rounded-full flex items-center justify-center text-[#a09a8e] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next trip"
                className="w-6 h-6 rounded-full flex items-center justify-center text-[#a09a8e] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AllDestinationsPage() {
  const [activeFilter, setActiveFilter] = useState('All Tours');
  const [destinations, setDestinations] = useState(() => cachedDestinations || []);
  const [loading, setLoading] = useState(() => !cachedDestinations);
  const [selectedDestDetails, setSelectedDestDetails] = useState(null);
  const [selectedDestBook, setSelectedDestBook] = useState(null);
  const [showAllUpcomingModal, setShowAllUpcomingModal] = useState(false);
  const [categories, setCategories] = useState(() => cachedCategories || []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'All Destinations | Bangalir Berano Tours & Travels';

    const loadData = async () => {
      try {
        const [pkgsRes, catsRes] = await Promise.all([
          fetch(`${API}/packages`).then(r => r.json()).catch(() => null),
          fetch(`${API}/categories`).then(r => r.json()).catch(() => null)
        ]);

        if (pkgsRes && pkgsRes.success && Array.isArray(pkgsRes.data)) {
          const upcoming = pkgsRes.data.filter(p => !p.status || p.status === 'Upcoming');
          cachedDestinations = upcoming;
          setDestinations(upcoming);
        }

        if (catsRes && catsRes.success && Array.isArray(catsRes.data)) {
          const catNames = catsRes.data.map(c => c.name);
          cachedCategories = catNames;
          setCategories(catNames);
        }
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredDestinations = destinations.filter(dest =>
    activeFilter === 'All Tours' ? true : (Array.isArray(dest.category) ? dest.category.includes(activeFilter) : dest.category === activeFilter)
  );

  const dynamicFilters = ['All Tours', ...categories];

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
        {/* Page hero strip */}
        <div className="pt-28 pb-6 px-4 sm:px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#c9a96e]/5 to-transparent pointer-events-none" />
          <p className="text-[11px] font-bold tracking-[0.3em] text-[#c9a96e] uppercase mb-3 relative z-10">
            Explore The World
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white relative z-10">
            All Destinations
          </h1>
        </div>

        {/* Written Summary Auto-Sliding Component for Upcoming Trips */}
        <UpcomingTripsSummary
          trips={destinations}
          loading={loading}
          onOpenDetails={setSelectedDestDetails}
          onOpenBook={setSelectedDestBook}
          onOpenViewAll={() => setShowAllUpcomingModal(true)}
          modalOpen={Boolean(selectedDestDetails || selectedDestBook || showAllUpcomingModal)}
        />

        <section className="pt-6 pb-28 md:py-12 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10 md:mb-12">
              {dynamicFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-[11px] sm:text-[12px] md:text-[14px] font-semibold transition-all border whitespace-nowrap cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-[#c9a96e] to-[#e07b39] text-[#0a0a0b] border-transparent shadow-md'
                      : 'bg-[#16161a] text-white border-white/10 hover:border-[#c9a96e]/50 hover:bg-[#1a1a1f]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[460px] rounded-[28px] bg-[#16161a] animate-pulse" />
                ))}
              </div>
            ) : filteredDestinations.length === 0 ? (
              <div className="text-center py-20 text-[#a09a8e]">No packages found for this category.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredDestinations.map((dest, index) => (
                  <DestinationCard
                    key={dest._id || dest.id}
                    dest={dest}
                    index={index}
                    onOpenDetails={setSelectedDestDetails}
                    onOpenBook={setSelectedDestBook}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Modals */}
        <AnimatePresence>
          {showAllUpcomingModal && (
            <AllUpcomingTripsModal
              trips={destinations}
              onClose={() => setShowAllUpcomingModal(false)}
              onOpenDetails={setSelectedDestDetails}
              onOpenBook={setSelectedDestBook}
            />
          )}
          {selectedDestDetails && (
            <TourDetailsModal dest={selectedDestDetails} onClose={() => setSelectedDestDetails(null)} onOpenBook={setSelectedDestBook} />
          )}
          {selectedDestBook && (
            <BookModal dest={selectedDestBook} onClose={() => setSelectedDestBook(null)} />
          )}
        </AnimatePresence>
    </div>
  );
}
